import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "博客管理 | ShyRobin",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#fff",
        color: "#111",
      }}
    >
      {children}
    </div>
  );
}
