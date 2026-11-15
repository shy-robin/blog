import "server-only";
import { cache } from "react";
import { client } from "./client";
import type { Profile, Project } from "@/lib/portfolio";

export const getProfile = cache(
  async (): Promise<Profile | null> =>
    client.fetch(
      `*[_type == "profile" && _id == "profile"][0]{
        name,intro,bio,avatar,location,
        githubUrl,email,qq,wechat,wechatQrCode,
        basicInfo,gender,birthDate,hometown,school,occupation,
        interests,experiences
      }`,
      {},
      { next: { revalidate: 60, tags: ["profile"] } },
    ),
);

export const getProjects = cache(
  async (): Promise<Project[]> =>
    client.fetch(
      `*[_type == "project" && defined(title) && !(_id in path("drafts.**"))]
    | order(coalesce(sortOrder, 0) asc, _createdAt desc){_id,title,summary,coverImage,role,contributions,technologies,demoUrl,sourceUrl}`,
      {},
      { next: { revalidate: 60, tags: ["projects"] } },
    ),
);
