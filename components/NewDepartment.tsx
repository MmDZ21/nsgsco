"use client";
import React, { FormEvent, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DepartmentModel } from "@/types/prisma";
import { UserContext } from "@/context/UserContext";
import { toast } from "react-toastify";

const NewDepartment = ({
  departments,
  setDepartments,
}: {
  departments: DepartmentModel[];
  setDepartments: any;
}) => {
  const [name, setName] = useState<string>("");
  const { fetchDepartments } = useContext(UserContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if both title and body are non-empty
    if (name.trim() !== "") {
      // Create a FormData object and append the form data (title, body, file)
      const formData = new FormData();
      formData.append("name", name);
      // Send a POST request to your API endpoint (e.g., /api/tickets) with formData
      const response = await toast.promise(
        fetch("/api/departments/new", {
          method: "POST",
          body: formData,
        }),
        {
          pending: "در حال انجام",
          success: "کارگاه جدید با موفقیت ایجاد شد",
          error: "ناموفق",
        }
      );

      // Handle the response and display a success message or error
      if (response.ok) {
        setName("");
        await fetchDepartments();
      }
    } else {
      // If either title or body is empty, show an error message
      toast.warn("نام کارگاه را وارد کنید", {
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
  };
  return (
    <Dialog>
      <DialogTrigger className="text-white py-2 px-4 rounded bg-nsgsco  hover:bg-[#093e3b] text-sm tracking-wider transition">
        کارگاه جدید
      </DialogTrigger>
      <DialogContent className="max-w-md bg-gray-900">
        <DialogHeader>
          <DialogTitle className="font-IranSansBold flex justify-center text-white">
            ایجاد کارگاه جدید
          </DialogTitle>
        </DialogHeader>

        <form
          dir="rtl"
          className="flex flex-col justify-center items-center gap-5"
          onSubmit={handleSubmit}
        >
          <label className="text-white px-2 pt-4" htmlFor="name">
            نام کارگاه:
          </label>
          <input
            className="bg-gray-950 bg-opacity-40 border text-sm rounded-lg p-1 w-1/2 border-gray-600 placeholder-gray-400 text-white focus:ring-nsgsco focus:border-nsgsco"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="name"
            placeholder="کارگاه جدید"
            required
          />
          <button
            type="submit"
            className="text-white py-2 px-4 mt-2 flex flex-col items-center justify-center uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
          >
            ثبت
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewDepartment;
