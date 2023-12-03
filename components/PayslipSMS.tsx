"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { initializeSmsService } from "@/lib/smsir";
import axios from "axios";
import { toast } from "react-toastify";
const PayslipSMS = () => {
  const [department, setDepartment] = useState<string>("all");
  const [msgText, setMsgText] = useState<string>(
    "کاربر گرامی، فیش حقوقی شما از طریق پنل سایت در دسترس می‌باشد.\nnsgsco403.ir\nنیرو صنعت گستر شرق"
  );
  const smsService = initializeSmsService();
  const sendSms = async () => {
    const phonesResponse = await axios.post("/api/users/getByDepartment", {
      department,
    });
    if (phonesResponse.data.length < 1) {
      return toast.error("کاربری یافت نشد", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    const smsRes = await toast.promise(
      smsService.SendBulk(msgText, phonesResponse.data),
      {
        pending: "در حال ارسال...",
        success: "با موفقیت ارسال شد",
        error: "ناموفق",
      }
    );
    console.log(smsRes);
  };
  return (
    <>
      <Dialog>
        <DialogTrigger className="text-white py-[6px] px-4 flex items-center justify-center gap-1 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition">
          اطلاع رسانی
        </DialogTrigger>
        <DialogContent className="max-w-lg bg-gray-900">
          <DialogHeader>
            <DialogTitle className="font-IranSansBold flex justify-center text-white">
              ارسال پیام برای کاربران
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div dir="rtl" className="flex flex-col justify-center">
              <label className="text-white px-2 py-4">انتخاب کارگاه:</label>
              <div className="flex justify-center">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  id="department"
                  className="border text-center text-sm rounded-lg p-1 w-1/2 bg-gray-950 bg-opacity-40 border-gray-600 placeholder-gray-400 text-white focus:ring-nsgsco focus:border-nsgsco"
                >
                  <option value="all">همه</option>
                  <option value="test">تست</option>
                  <option value="omomi">عمومی</option>
                  <option value="fani">فنی</option>
                  <option value="fava">فاوا</option>
                  <option value="edari">اداری</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <textarea
                dir="rtl"
                onChange={(e) => setMsgText(e.target.value)}
                rows={8}
                value={msgText}
                className="bg-gray-950 bg-opacity-40 border text-sm rounded-lg p-1 w-1/2 border-gray-600 placeholder-gray-400 text-white focus:ring-nsgsco focus:border-nsgsco"
              ></textarea>
            </div>
            <div className="flex justify-center items-center pt-8">
              <Dialog>
                <DialogTrigger className="text-white py-[6px] px-4 flex items-center justify-center gap-1 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition">
                  ارسال
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-IranSansBold flex justify-center">
                      از ارسال پیام به کارگاه های زیر مطمئنید؟
                    </DialogTitle>
                  </DialogHeader>
                  <DialogFooter className="flex gap-1 ">
                    <DialogTrigger asChild>
                      <button
                        onClick={() => {}}
                        className="text-white py-2 px-4 flex flex-col items-center justify-center gap-1 uppercase rounded bg-red-700 hover:bg-[#3e0909] text-sm tracking-wider transition"
                      >
                        خیر
                      </button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => sendSms()}
                        className="text-white py-2 px-4 flex flex-col items-center justify-center gap-1 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
                      >
                        بله
                      </button>
                    </DialogTrigger>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PayslipSMS;
