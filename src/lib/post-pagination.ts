export const POSTS_PER_PAGE = 12;

export function pageValue(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^[1-9]\d*$/.test(raw)) return 1;
  const page = Number(raw);
  return Number.isSafeInteger(page) &&
    page <= Math.floor(Number.MAX_SAFE_INTEGER / POSTS_PER_PAGE)
    ? page
    : 1;
}

const published = `_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))`;

export function postPageQueries(query: string, tag: string, page: number) {
  const terms = query
    .normalize("NFKC")
    .toLocaleLowerCase("zh-CN")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const text = `lower(coalesce(title, "") + " " + coalesce(excerpt, "") + " " + array::join(coalesce(tags, []), " ") + " " + coalesce(pt::text(body), "") + " " + coalesce(array::join(body[_type == "codeBlock" && defined(code)].code, " "), ""))`;
  const filter = [
    published,
    `($tag == "" || $tag in tags)`,
    ...terms.map((_, i) => `count(string::split(${text}, $term${i})) > 1`),
  ].join(" && ");
  const params: Record<string, string | number> = {
    tag,
    start: (page - 1) * POSTS_PER_PAGE,
    end: page * POSTS_PER_PAGE,
  };
  terms.forEach((term, i) => {
    params[`term${i}`] = term;
  });
  return {
    params,
    stats: `{"total":count(*[${published}]),"matched":count(*[${filter}]),"tagSets":*[${published}]{tags}}`,
    items: `*[${filter}] | order(publishedAt desc, _createdAt desc, _id asc)[$start...$end]{_id,title,"slug":slug.current,excerpt,publishedAt,tags}`,
  };
}
