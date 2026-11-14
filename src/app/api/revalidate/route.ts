import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { NextRequest, NextResponse } from "next/server";
import { contentCacheTag } from "@/lib/portfolio";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "Webhook is not configured" },
      { status: 503 },
    );
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      request,
      secret,
    );
    if (!isValidSignature)
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    const tag = contentCacheTag(body?._type);
    if (!tag)
      return NextResponse.json(
        { error: "Unsupported document type" },
        { status: 400 },
      );
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook request" },
      { status: 400 },
    );
  }
}
