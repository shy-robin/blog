"""Download legacy images and generate an import file with explicit broken-image links."""
import concurrent.futures
import hashlib
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path


def image_extension(data):
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if data.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if data.startswith((b"GIF87a", b"GIF89a")):
        return ".gif"
    if data.startswith(b"RIFF") and data[8:12] == b"WEBP":
        return ".webp"
    if data[4:12] in (b"ftypavif", b"ftypavis"):
        return ".avif"
    raise ValueError("Response is not a supported image (possibly an HTML error page)")


def prepare(source, output):
    assets_dir = output / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)
    assets = json.loads((output / "assets.json").read_text())
    urls = sorted({item["url"] for item in assets})
    previous_path = output / "asset-results.json"
    previous = json.loads(previous_path.read_text()) if previous_path.exists() else {}

    def download(url):
        stem = hashlib.sha256(url.encode()).hexdigest()
        cached = list(assets_dir.glob(stem + ".*"))
        if cached:
            image_extension(cached[0].read_bytes())
            return url, {"file": str(cached[0].resolve())}
        if url in previous and "error" in previous[url] and "--retry" not in sys.argv:
            return url, previous[url]
        try:
            parsed = urllib.parse.urlparse(url)
            local = (source / urllib.parse.unquote(parsed.path).lstrip("/")).resolve()
            if parsed.hostname in ("gainmore.gitee.io", "gainmore.github.io") and local.is_relative_to(source) and local.is_file():
                data = local.read_bytes()
            else:
                request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Referer": "https://gainmore.gitee.io/"})
                with urllib.request.urlopen(request, timeout=10) as response:
                    data = response.read(25 * 1024 * 1024 + 1)
                if len(data) > 25 * 1024 * 1024:
                    raise ValueError("Image exceeds 25 MB")
            extension = image_extension(data)
            target = assets_dir / (stem + extension)
            target.write_bytes(data)
            return url, {"file": str(target.resolve()), "bytes": len(data)}
        except Exception as error:
            return url, {"error": str(error)}

    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for url, result in pool.map(download, urls):
            results[url] = result
            if len(results) % 25 == 0:
                print(f"Checked {len(results)}/{len(urls)} images", flush=True)
    (output / "asset-results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2))
    documents = [json.loads(line) for line in (output / "posts-source.ndjson").read_text().splitlines()]
    failures = []
    for document in documents:
        for index, block in enumerate(document["body"]):
            if block["_type"] != "image":
                continue
            url = block["_sanityAsset"].removeprefix("image@")
            result = results[url]
            if "file" in result:
                block["_sanityAsset"] = "image@" + Path(result["file"]).as_uri()
            else:
                failures.append({"title": document["title"], "id": document["_id"], "url": url, "error": result["error"]})
                document["body"][index] = {
                    "_type": "block", "_key": block["_key"], "style": "normal",
                    "children": [{"_type": "span", "_key": "text", "text": "原文图片（暂未恢复）：" + (block.get("alt") or url), "marks": ["source"]}],
                    "markDefs": [{"_type": "link", "_key": "source", "href": url}],
                }
    (output / "posts.ndjson").write_text("\n".join(json.dumps(x, ensure_ascii=False) for x in documents) + "\n")
    (output / "missing-images.json").write_text(json.dumps(failures, ensure_ascii=False, indent=2))
    print(json.dumps({"articles": len(documents), "uniqueImages": len(urls), "downloaded": sum("file" in r for r in results.values()), "failed": sum("error" in r for r in results.values()), "failedOccurrences": len(failures)}), flush=True)


if __name__ == "__main__":
    prepare(Path(sys.argv[1]).expanduser().resolve(), Path(sys.argv[2] if len(sys.argv) > 2 else "migration-output/gainmore").resolve())
