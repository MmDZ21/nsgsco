"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ChangeAvatar = () => {
  const router = useRouter();
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("sign-in");
    },
  });
  const [newPicture, setNewPicture] = useState<File | null>(null); // Store the selected file

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // Use optional chaining
    if (selectedFile) {
      // Update the state with the selected file
      setNewPicture(selectedFile);

      // Update the displayed image by creating a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPicture(event.target!.result as string); // Non-null assertion operator (!)
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const [picture, setPicture] = useState<string>(
    session?.user.image ? session.user.image : "/assets/img/profiles/avatar.png"
  );
  console.log(session);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (newPicture) {
      formData.append("file", newPicture);
      if (session?.user.image) {
        formData.append("prevFile", session.user.image);
      }
    }
    try {
      const response = await toast.promise(
        axios.patch("/api/auth/settings/update/changeAvatar", formData),
        {
          pending: "بارگزاری",
          success: "تصویر شما با موفقیت تغییر کرد",
          error: "ناموفق",
        }
      );
      await update({
        ...session,
        user: { ...session?.user, image: response.data },
      });
    } catch (error) {
      console.log(error);
    }
    setNewPicture(null);
  };

  return (
    <div>
      <div className="text-gray-300 text-center pb-16 ">
        تغییر تصویر پروفایل
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap flex-col justify-center"
      >
        <div>
          <label htmlFor="upload" className="relative group cursor-pointer">
            <Image
              src={newPicture ? URL.createObjectURL(newPicture) : picture}
              alt={session?.user.name ? session.user.name : "تصویر کاربر"}
              width={150}
              height={150}
              className="rounded-full w-[150px] h-[150px] object-cover"
            />
            <div className="absolute flex justify-center items-center bg-black rounded-full w-full h-full top-0 bottom-0 right-0 left-0 opacity-0 group-hover:opacity-80 group-hover:brightness-50 transition ease-in-out duration-500">
              <svg
                className="w-6 h-6 text-nsgsco opacity-100"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12V1m0 0L4 5m4-4 4 4m3 5v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                />
              </svg>
            </div>
          </label>
          <input
            id="upload"
            type="file"
            accept=".png,.jpg"
            hidden
            onChange={handleImageChange}
          />
        </div>
        <div className="flex flex-col items-center ">
          <button
            type="submit"
            className="text-white mt-6 py-2 px-4 md:w-full uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
          >
            ثبت تغیرات
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeAvatar;
