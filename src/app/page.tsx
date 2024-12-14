"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const getTimeLeft = (target = new Date("2025/01/31").getTime()) => {
    const current = Date.now();
    const timeLeft = target - current;
    return timeLeft;
  };

  const formatTime = (time: number) => {
    const day = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return {
      day,
      hours,
      minutes,
      seconds,
    };
  };

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let time = getTimeLeft();
    const GAP = 1000;

    const timer = setInterval(() => {
      if (time < 0) {
        clearInterval(timer);
        return;
      }

      const { day, hours, minutes, seconds } = formatTime(time);
      setDays(day);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);

      time -= GAP;
    }, GAP);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <span>
          <strong>ShyRobin 的博客网站</strong>
          <br />
          <em>To be implemented before 2025/01/31 ...</em>
          <br />
          <span className="text-[#4e495a] text-lg flex items-center rounded-full bg-[#fff] dark:bg-[#000] transition-colors gap-2 my-2">
            <span className="text-xs">剩余</span>
            <span className="text-lg text-[#000] bg-[#fff] inline-block w-10 h-10 rounded-md flex items-center justify-center">
              {days.toString().padStart(2, "0")}
            </span>
            <span className="text-xs">天</span>
            <span className="text-lg text-[#000] bg-[#fff] inline-block w-10 h-10 rounded-md flex items-center justify-center">
              {hours.toString().padStart(2, "0")}
            </span>
            <span className="text-xs">小时</span>
            <span className="text-lg text-[#000] bg-[#fff] inline-block w-10 h-10 rounded-md flex items-center justify-center">
              {minutes.toString().padStart(2, "0")}
            </span>
            <span className="text-xs">分钟</span>
            <span className="text-lg text-[#000] bg-[#fff] inline-block w-10 h-10 rounded-md flex items-center justify-center">
              {seconds.toString().padStart(2, "0")}
            </span>
            <span className="text-xs">秒</span>
          </span>
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
