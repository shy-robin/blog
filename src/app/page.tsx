import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <span>
          <strong>ShyRobin 的博客网站</strong>
          <span>（To be implemented ...）</span>
        </span>
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <span className="flex gap-1 items-center">
          <img
            className="w-4 h-4 rounded-full"
            src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png"
            alt="Profile"
          />
          <a
            className="text-xs text-[#4e495a] hover:text-[#fff] transition-colors"
            href="https://beian.mps.gov.cn/#/query/webSearch?code=11011402054462"
            rel="noreferrer"
            target="_blank"
          >
            京公网安备11011402054462
          </a>
        </span>
        <a
          className="text-xs text-[#4e495a] hover:text-[#fff] transition-colors"
          href="https://beian.miit.gov.cn/#/Integrated/index"
          target="_blank"
        >
          京ICP备2024096758号-1
        </a>
      </footer>
    </div>
  );
}
