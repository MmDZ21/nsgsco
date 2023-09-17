"use client";

import { toPersianDigits } from "@/utils/Clock";
import { useRouter } from "next/navigation";

const Notif = (unread: { quantity: number; type: string; admin: boolean }) => {
  const router = useRouter();
  return (
    <div>
      <div className="right-dir flex w-full border-t border-gray-700 p-4 hover:bg-gray-700 2xl:items-start">
        <svg
          className="w-6 h-6 text-nsgsco"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M15.133 10.632v-1.8a5.407 5.407 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V1.1a1 1 0 0 0-2 0v2.364a.944.944 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C4.867 13.018 3 13.614 3 14.807 3 15.4 3 16 3.538 16h12.924C17 16 17 15.4 17 14.807c0-1.193-1.867-1.789-1.867-4.175Zm-13.267-.8a1 1 0 0 1-1-1 9.424 9.424 0 0 1 2.517-6.39A1.001 1.001 0 1 1 4.854 3.8a7.431 7.431 0 0 0-1.988 5.037 1 1 0 0 1-1 .995Zm16.268 0a1 1 0 0 1-1-1A7.431 7.431 0 0 0 15.146 3.8a1 1 0 0 1 1.471-1.354 9.425 9.425 0 0 1 2.517 6.391 1 1 0 0 1-1 .995ZM6.823 17a3.453 3.453 0 0 0 6.354 0H6.823Z" />
        </svg>
        <div className="w-full pr-4">
          <div className="flex w-full items-center justify-between">
            <div className="font-IranSansBold text-white">
              {unread.type === "ticket" ? "تیکت جدید" : "پیشنهاد جدید"} !
            </div>
            <div
              onClick={() =>
                router.push(
                  `/dashboard/${unread.admin ? "admin" : "user"}/${
                    unread.type === "ticket" ? "requests" : "suggestions"
                  }`
                )
              }
              className="flex h-7 w-7 cursor-pointer items-center justify-center"
            >
              <svg
                className="w-4 h-4 text-white hover:text-nsgsco"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
                />
              </svg>
            </div>
          </div>
          <p className="my-2 text-sm text-gray-400">
            شما {toPersianDigits(unread.quantity)}
            {unread.type === "ticket" ? " تیکت " : " پیشنهاد "}
            خوانده نشده دارید.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notif;
