"use client";
import { UserContext } from "@/context/UserContext";
import { Payslip } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const PayslipFiles = ({ date }: { date: string | undefined }) => {
  const payslips = useContext(UserContext).payslips;
  const [file, setFile] = useState<Payslip | null | undefined>(null);
  useEffect(() => {
    const file = payslips.find((payslip) => payslip.persianDate === date);
    setFile(file);
  }, [date]);
  const handleDownload = (fileId: string | undefined) => {
    if (fileId !== undefined) {
      toast.loading("در حال آماده سازی", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      const downloadLink = document.createElement("a");
      downloadLink.href = `/api/payslips/download/${fileId}`; // Replace with your download API endpoint
      downloadLink.target = "_blank";
      downloadLink.download = fileId;
      downloadLink.click();
    }
    // Trigger a download for the selected payslip
  };
  return (
    <div className="text-center p-4">
      {file?.persianDate ? (
        <div>
          <svg
            className="w-10 h-10 text-white mx-auto mb-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 20"
          >
            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2Z" />
          </svg>
          <div>{file?.persianDate}</div>
          <button
            onClick={() => handleDownload(file?.id)}
            className="text-white mt-2 py-2 px-4 rounded bg-nsgsco text-sm tracking-wider transition hover:bg-[#093e3b]"
          >
            دانلود
          </button>
        </div>
      ) : (
        "فایلی یافت نشد"
      )}
    </div>
  );
};

export default PayslipFiles;
