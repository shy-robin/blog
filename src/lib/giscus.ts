export type GiscusConfig = {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
};

// These are public repository identifiers, not credentials.
export const defaultGiscusConfig: GiscusConfig = {
  repo: "shy-robin/blog",
  repoId: "R_kgDONaitLQ",
  category: "Announcements",
  categoryId: "DIC_kwDONaitLc4DLH00",
};

export function getGiscusConfig(
  values: Partial<GiscusConfig>,
): GiscusConfig | null {
  const repo = values.repo?.trim();
  const repoId = values.repoId?.trim();
  const category = values.category?.trim();
  const categoryId = values.categoryId?.trim();
  if (
    !repo ||
    !/^[\w.-]+\/[\w.-]+$/.test(repo) ||
    !repoId ||
    !category ||
    !categoryId
  )
    return null;
  return { repo, repoId, category, categoryId };
}

export function giscusAttributes(config: GiscusConfig, postId: string) {
  return {
    "data-repo": config.repo,
    "data-repo-id": config.repoId,
    "data-category": config.category,
    "data-category-id": config.categoryId,
    "data-mapping": "specific",
    "data-term": `post:${postId}`,
    "data-strict": "1",
    "data-reactions-enabled": "1",
    "data-emit-metadata": "0",
    "data-input-position": "top",
    "data-theme": "light",
    "data-lang": "zh-CN",
    "data-loading": "lazy",
  };
}
