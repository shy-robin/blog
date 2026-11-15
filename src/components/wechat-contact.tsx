"use client";

import { useId, useRef } from "react";
import { ArrowRight } from "./arrow-right";
import { SanityImage } from "./sanity-image";

export function WeChatContact({
  src,
  width,
  height,
}: {
  src: string;
  width: number;
  height: number;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useId();
  return (
    <>
      <button
        className="footer-wechat-trigger"
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        WeChat <ArrowRight />
      </button>
      <dialog
        className="wechat-dialog"
        ref={dialog}
        aria-labelledby={heading}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="wechat-dialog-content">
          <div className="wechat-dialog-heading">
            <h2 id={heading}>微信联系</h2>
            <button
              type="button"
              autoFocus
              aria-label="关闭微信二维码"
              onClick={() => dialog.current?.close()}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div className="wechat-qr-image">
            <SanityImage
              src={src}
              alt="微信好友二维码"
              width={width}
              height={height}
              sizes="(max-width: 400px) 75vw, 280px"
            />
          </div>
          <p>使用微信扫一扫，或保存图片后在微信中识别。</p>
        </div>
      </dialog>
    </>
  );
}
