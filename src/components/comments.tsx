import "server-only";
import { defaultGiscusConfig, getGiscusConfig } from "@/lib/giscus";
import { GiscusComments } from "./giscus-comments";

export function Comments({ postId }: { postId: string }) {
  const config = getGiscusConfig({
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? defaultGiscusConfig.repo,
    repoId:
      process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? defaultGiscusConfig.repoId,
    category:
      process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? defaultGiscusConfig.category,
    categoryId:
      process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ??
      defaultGiscusConfig.categoryId,
  });
  if (!config) return null;
  return <GiscusComments key={postId} config={config} postId={postId} />;
}
