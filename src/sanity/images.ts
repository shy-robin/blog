export function imageUrl(
  image?: { asset?: { _ref?: string } },
  width = 1400,
): string | null {
  const match = image?.asset?._ref?.match(
    /^image-([a-zA-Z0-9]+)-(\d+x\d+)-([a-zA-Z0-9]+)$/,
  );
  if (!match) return null;
  const project = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "e4fd09lc";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  return `https://cdn.sanity.io/images/${project}/${dataset}/${match[1]}-${match[2]}.${match[3]}?w=${width}&fit=max&auto=format`;
}

export function imageDimensions(image?: { asset?: { _ref?: string } }) {
  const match = image?.asset?._ref?.match(/-(\d+)x(\d+)-[a-zA-Z0-9]+$/);
  return {
    width: Number(match?.[1]) || 1400,
    height: Number(match?.[2]) || 900,
  };
}
