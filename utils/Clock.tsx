"use client";

import { useEffect, useState } from "react";
export const toPersianDigits = (number: number) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(number).replace(/\d/g, (match) => persianDigits[Number(match)]);
};
export const getTime = () => {
  const now = new Date();
  const hours = toPersianDigits(now.getHours());
  const minutes = toPersianDigits(now.getMinutes());
  const seconds = toPersianDigits(now.getSeconds());
  return {
    hours,
    minutes,
    seconds,
  };
};

const Clock = () => {
  const { hours, minutes, seconds } = getTime();
  const [time, setTime] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
  }>();

  useEffect(() => {
    setInterval(() => {
      setTime({ hours, minutes, seconds });
    }, 1000);
  }, []);
  return (
    <div className="flex flex-wrap text-white text-xl font-bold">
      <div className="pr-5">
        <div suppressHydrationWarning>{hours}</div>
      </div>
      <div className="pr-5">
        <div>:</div>
      </div>
      <div className="pr-5">
        <div suppressHydrationWarning>{minutes}</div>
      </div>
      <div className="pr-5">
        <div>:</div>
      </div>
      <div>
        <div suppressHydrationWarning>{seconds}</div>
      </div>
    </div>
  );
};

export default Clock;
