"use client";
import { useEffect, useState } from "react";
import moment from "jalali-moment";
import { toPersianDigits } from "@/utils/Clock";
const persianDays = [
  "شنبه",
  "یک شنبه",
  "دوشنبه",
  "سه شنبه",
  "چهارشنبه",
  "پنج شنبه",
  "جمعه",
];
export const persianYears = [
  "۱۴۰۱",
  "۱۴۰۲",
  "۱۴۰۳",
  "۱۴۰۴",
  "۱۴۰۵",
  "۱۴۰۶",
  "۱۴۰۷",
];
export const persianMonths = [
  "فروردین",

  "اردیبهشت",

  "خرداد",

  "تیر",

  "مرداد",

  "شهریور",

  "مهر",

  "آبان",

  "آذر",

  "دی",
  "بهمن",

  "اسفند",
];
export const fiveYears = () => {
  const persianDate = moment().format("jYYYY/jMM/jDD");
  const parsedDate = moment(persianDate, "jYYYY/jMM/jDD"); // Month (add 1 to correct zero-based indexing)
  const year = parsedDate.jYear();
  return [
    toPersianDigits(year - 1),
    toPersianDigits(year),
    toPersianDigits(year + 1),
    toPersianDigits(year + 2),
    toPersianDigits(year + 3),
  ];
};
const PersianDate = () => {
  const [today, setToday] = useState<string>("");
  const [month, setMonth] = useState<string>("");

  const persianDate = moment().format("jYYYY/jMM/jDD"); // Example date: '1402/06/11'
  // Parse the Persian date
  const parsedDate = moment(persianDate, "jYYYY/jMM/jDD"); // Month (add 1 to correct zero-based indexing)
  const jalaliDay = toPersianDigits(parsedDate.jDate()); // Day

  useEffect(() => {
    const now = new Date();
    const day = now.getDay() + 1;
    const jalaliMonth = parsedDate.jMonth();

    setToday(persianDays[day]);
    setMonth(persianMonths[jalaliMonth]);
  }, []);
  return (
    <div className="right-dir flex flex-wrap">
      <div suppressHydrationWarning>{today}</div>
      <div suppressHydrationWarning className="mr-3">
        {jalaliDay}
      </div>
      <div suppressHydrationWarning className="mr-3">
        {month}
      </div>
    </div>
  );
};

export default PersianDate;
