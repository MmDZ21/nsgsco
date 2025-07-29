"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "@/public/assets/img/nsgsco-logo-portal.png";
import ResetForm from "@/components/ResetForm";
import VerificationCode from "@/components/VerificationCode";
import ResetPassword from "@/components/ResetPassword";
const Page = () => {
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  return (
    <main className="bg-nsgscoBg bg-no-repeat bg-center bg-cover">
      <div className="h-screen flex items-center justify-center">
        <div className="p-8 mx-auto">
          <div className="bg-gray-900 bg-opacity-80 rounded-t-lg p-8">
            <p className="flex justify-center">
              <Image priority width={500} src={logo} alt="نیرو صنعت گستر شرق" />
            </p>
          </div>
          <div className="bg-gray-950 bg-opacity-80 rounded-b-lg py-6 px-24">
            <p className="text-center text-lg text-gray-200 font-light">
              {!verified
                ? codeSent
                  ? "تایید کد"
                  : "فراموشی کلمه عبور"
                : "تغییر کلمه عبور"}
            </p>
            <div>
              {!verified ? (
                codeSent ? (
                  <VerificationCode
                    setCodeSent={setCodeSent}
                    setVerified={setVerified}
                    setCode={setCode}
                  />
                ) : (
                  <ResetForm setCodeSent={setCodeSent} />
                )
              ) : (
                <ResetPassword setVerified={setVerified} code={code} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Page;
