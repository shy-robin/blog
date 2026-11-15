import Link from "next/link";
import { ArrowRight } from "./arrow-right";
import { QQContact } from "./qq-contact";
import { WeChatContact } from "./wechat-contact";
import { imageUrl, imageDimensions } from "@/sanity/images";
import {
  contactEmailUrl,
  safeExternalUrl,
  qqContactUrls,
  type Profile,
} from "@/lib/portfolio";

export function SiteFooter({ profile }: { profile: Profile }) {
  const github = safeExternalUrl(profile.githubUrl);
  const email = contactEmailUrl(profile.email);
  const qq = qqContactUrls(profile.qq);
  const wechatQr = imageUrl(profile.wechatQrCode, 600);
  const hasContacts = Boolean(github || email || qq || wechatQr);
  return (
    <footer className="directory-footer">
      {hasContacts && (
        <section
          className="footer-column"
          aria-labelledby="footer-contact-heading"
        >
          <h2 id="footer-contact-heading">联系</h2>
          <ul className="footer-tree">
            {github && (
              <li>
                <a href={github} target="_blank" rel="noreferrer">
                  GitHub <ArrowRight />
                </a>
              </li>
            )}
            {qq && (
              <li>
                <QQContact urls={qq} />
              </li>
            )}
            {wechatQr && (
              <li>
                <WeChatContact
                  src={wechatQr}
                  {...imageDimensions(profile.wechatQrCode)}
                />
              </li>
            )}
            {email && (
              <li>
                <a href={email}>
                  Email <ArrowRight />
                </a>
              </li>
            )}
          </ul>
        </section>
      )}
      <nav className="footer-column" aria-labelledby="footer-index-heading">
        <h2 id="footer-index-heading">索引</h2>
        <ul className="footer-tree">
          <li>
            <Link href="/posts">文章</Link>
          </li>
          <li>
            <Link href="/projects">项目</Link>
          </li>
          <li>
            <Link href="/about">关于</Link>
          </li>
          <li>
            <a href="/feed.xml">RSS</a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
