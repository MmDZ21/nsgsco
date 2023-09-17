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
const persianMonths = [
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
