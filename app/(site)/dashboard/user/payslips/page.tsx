"use client";
import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { persianMonths, persianYears } from "@/utils/PersianDate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import Image from "next/image";
import { Payslip } from "@prisma/client";
import axios from "axios";
export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("sign-in");
    },
  });
  const { payslips, fetchPayslips } = useContext(UserContext);
  const [file, setFile] = useState<Payslip | null | undefined>(null);
  const [month, setMonth] = useState<string | undefined>(undefined);
  const [year, setYear] = useState<string | undefined>(undefined);
  const handleSubmit = async () => {
    const file = payslips.find(
      (payslip) => payslip.year === year && payslip.month === month
    );
    setFile(file);
    if (file && !file.seen) {
      console.log("updating status...");
      await axios.patch(`/api/payslips/updateStatus/${file.id}`);
      await fetchPayslips();
    }
  };
  const handleDownload = (
    fileId: string | undefined,
    fileName: string | undefined
  ) => {
    if (fileId !== undefined) {
      toast.success("در حال آماده سازی", {
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
  function printImg(url: string) {
    const win = window.open("");
    win?.document.write(
      '<img src="' +
        url +
        '" width="100%" onload="window.print();window.close()" />'
    );
    win?.focus();
  }
  return (
    <div className="py-10">
      <form>
        <div className="flex gap-4 flex-col md:flex-row-reverse justify-center items-center bg-gray-950/40 py-6 px-8 md:px-24 shadow-md rounded-3xl">
          <select
            id="month"
            className="border text-center text-sm rounded-lg block md:w-1/3 p-4 bg-gray-950 bg-opacity-40 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setMonth(e.target.value)}
            defaultValue={undefined}
          >
            {persianMonths.map((month) => (
              <option className="bg-gray-900" value={month} key={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            id="year"
            className="border text-center text-sm rounded-lg block md:w-1/3 p-4 bg-gray-950 bg-opacity-40 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setYear(e.target.value)}
            defaultValue={undefined}
          >
            {persianYears.map((year) => (
              <option className="bg-gray-900" value={year} key={year}>
                {year}
              </option>
            ))}
          </select>
          <Dialog>
            <DialogTrigger
              className="text-white py-4 px-4 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
              onClick={() => handleSubmit()}
            >
              مشاهده فیش
            </DialogTrigger>
            <DialogContent>
              {file ? (
                <div>
                  <DialogHeader>
                    <DialogTitle dir="rtl" className="flex justify-center">
                      <div className="font-IranSansBold mx-2">
                        {session?.user.name}
                      </div>
                      -
                      <div className="font-IranSansBold mx-2">
                        {file.year} - {file.month}
                      </div>
                    </DialogTitle>
                    <DialogDescription>
                      <Image
                        src={`/api/payslips/download/${file.id}`}
                        alt={file.id}
                        width="1654"
                        height="1166"
                        id="payslip"
                      ></Image>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        printImg(`/api/payslips/download/${file.id}`)
                      }
                      className="text-white py-2 px-4 flex flex-col items-center justify-center gap-1 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 20h10a1 1 0 0 0 1-1v-5H4v5a1 1 0 0 0 1 1Z" />
                        <path d="M18 7H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-1-2V2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h14Z" />
                      </svg>
                      <p>پرینت</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(file.id, file.filename)}
                      className="text-white py-2 px-4 flex flex-col items-center justify-center gap-1 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                        <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                      </svg>
                      <p>دریافت</p>
                    </button>
                  </DialogFooter>
                </div>
              ) : (
                <div>
                  <p>فیش مورد نظر موجود نیست</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  );
}
