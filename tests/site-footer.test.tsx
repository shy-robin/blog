import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { SiteFooter } from "../src/components/site-footer";
import { ImageConfigContext } from "next/dist/shared/lib/image-config-context.shared-runtime";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import nextConfig from "../next.config";

test("footer uses supplied contacts and existing destinations without invented profiles", () => {
  const html = renderToStaticMarkup(
    <ImageConfigContext.Provider
      value={{ ...imageConfigDefault, ...nextConfig.images }}
    >
      <SiteFooter
        profile={{
          email: "hello@example.com",
          githubUrl: "https://github.com/example",
          location: "北京",
          qq: "123456789",
          wechat: "demo_wechat",
          wechatQrCode: {
            _type: "image",
            asset: { _ref: "image-demo123-600x600-png" },
          },
        }}
      />
    </ImageConfigContext.Provider>,
  );
  for (const href of [
    "/posts",
    "/projects",
    "/about",
    "/feed.xml",
    "https://github.com/example",
    "mailto:hello@example.com",
  ]) {
    assert.ok(html.includes(`href="${href}"`));
  }
  assert.doesNotMatch(html, /UTC\+8|北京|©|footer-clock/);
  assert.match(html, /wpa\.qq\.com/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /123456789/);
  assert.match(html, /微信好友二维码/);
  assert.doesNotMatch(html, /复制|已复制|demo_wechat/);
  assert.doesNotMatch(html, /Twitter|Telegram|YouTube|Cali Castle|22\.4820/);
});

test("footer omits missing or unsafe contact links", () => {
  const html = renderToStaticMarkup(
    <SiteFooter
      profile={{ githubUrl: "javascript:alert(1)", email: "invalid" }}
    />,
  );
  assert.doesNotMatch(html, /javascript:|mailto:|footer-contact-heading/);
  assert.match(html, /footer-index-heading/);
});

test("an empty profile never adds default contact accounts", () => {
  const html = renderToStaticMarkup(<SiteFooter profile={{}} />);
  assert.doesNotMatch(
    html,
    /footer-contact-heading|github\.com|mailto:|aria-haspopup="dialog"/,
  );
});

test("WeChat without a QR code does not create a broken entry", () => {
  const html = renderToStaticMarkup(
    <SiteFooter profile={{ wechat: "demo_wechat" }} />,
  );
  assert.doesNotMatch(
    html,
    /aria-haspopup="dialog"|demo_wechat|footer-contact-heading/,
  );
});
