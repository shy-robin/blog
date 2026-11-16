import { BottomNav, type NavPage } from "./bottom-nav";
import { getProfile } from "@/sanity/portfolio";
import { displayProfile } from "@/lib/portfolio";
import { imageUrl } from "@/sanity/images";
import { SiteFooter } from "./site-footer";

export async function BlogShell({
  children,
  active,
  className,
}: {
  children: React.ReactNode;
  active?: NavPage;
  className?: string;
}) {
  // Navigation should remain usable if the optional profile cannot be loaded.
  const profile = displayProfile(await getProfile().catch(() => null));
  const avatarUrl = imageUrl(profile.avatar, 80);
  return (
    <div className={className ? `blog-shell ${className}` : "blog-shell"}>
      <a className="skip-link" href="#main">
        跳到正文
      </a>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter profile={profile} />
      <BottomNav active={active} avatarUrl={avatarUrl} name={profile.name} />
    </div>
  );
}
