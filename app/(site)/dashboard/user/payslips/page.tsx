"use client";
import { useContext, useState } from "react";
import PayslipFiles from "@/components/PayslipFiles";
import { UserContext } from "@/context/UserContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("sign-in");
    },
  });
  const payslips = useContext(UserContext).payslips;
  const [date, setDate] = useState<string | undefined>(undefined);

  return (
    <div className="py-10">
      <form>
        <select
          id="date"
          className="border text-center text-sm rounded-lg block w-full p-3 bg-gray-900 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setDate(e.target.value)}
        >
          <option selected value={undefined}>
            انتخاب تاریخ
          </option>
          {payslips.map((payslip) => (
            <option key={payslip.id} value={payslip.persianDate}>
              {payslip.persianDate}
            </option>
          ))}
        </select>
      </form>
      <div className="mt-1 bg-gray-900 py-6 px-24 text-xs shadow-md rounded-lg text-white">
        <PayslipFiles date={date} />
      </div>
    </div>
  );
}
