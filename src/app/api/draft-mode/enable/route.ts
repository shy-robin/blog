import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { previewSlug, secretsEqual } from "@/lib/preview";

export async function GET(request: NextRequest) {
  const expected = process.env.SANITY_PREVIEW_SECRET;
  if (!expected)
    return NextResponse.json(
      { error: "Preview is not configured" },
      { status: 503 },
    );
  const params = request.nextUrl.searchParams;
  if (!secretsEqual(params.get("secret"), expected))
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  const slug = previewSlug(params.get("slug"));
  if (!slug)
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  (await draftMode()).enable();
  redirect(`/posts/${encodeURIComponent(slug)}`);
}
