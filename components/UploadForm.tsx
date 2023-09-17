"use client";
import React, { useState } from "react";
import axios from "axios";
import { Id, toast } from "react-toastify";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const toastId = React.useRef<Id | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await toast.promise(
        axios.post("/api/payslips/upload", formData),
        {
          pending: "در حال بارگزاری",
          success: "با موفقیت بارگزاری شد",
          error: "بارگزاری ناموفق",
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("An error occurred while uploading the file:", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="p-8 mx-auto">
        <div className="bg-gray-900 py-6 px-24 shadow-md rounded-3xl">
          <form className="mt-6" onSubmit={handleSubmit}>
            {/* File input */}
            <label
              className="block mb-2 text-sm font-medium text-gray-300 right-dir"
              htmlFor="file_input"
            >
              بارگزاری فایل
            </label>
            <input
              className="block my-5 w-full border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />
            <p
              className="mt-1 text-sm text-gray-300 right-dir"
              id="file_input_help"
            >
              فقط فایل فشرده با فرمت zip.
            </p>

            <div className="flex items-center justify-center mt-8">
              <button
                type="submit"
                className="text-white py-2 px-4 rounded bg-nsgsco  hover:bg-[#093e3b] text-sm tracking-wider transition"
              >
                بارگزاری
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
