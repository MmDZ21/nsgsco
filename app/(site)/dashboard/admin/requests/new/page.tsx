"use client";
import { FormEvent, useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { fetchTickets } = useContext(UserContext);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if both title and body are non-empty
    if (title.trim() !== "" && body.trim() !== "" && receiver.trim() !== "") {
      // Create a FormData object and append the form data (title, body, file)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      formData.append("receiver", receiver);
      if (file) {
        formData.append("file", file);
      }

      // Send a POST request to your API endpoint (e.g., /api/tickets) with formData
      const response = await toast.promise(
        fetch("/api/tickets/new", {
          method: "POST",
          body: formData,
        }),
        {
          pending: "در حال ارسال",
          success: "پیام شما ارسال شد",
          error: "پیام ارسال نشد!",
        }
      );

      // Handle the response and display a success message or error
      if (response.ok) {
        setBody("");
        setFile(null);
        setTitle("");
        fetchTickets();
        router.push(
          `/dashboard/${
            session?.user.role === "ADMIN" ? "admin" : "user"
          }/requests`
        );
      }
    } else {
      toast.warn("عنوان، متن و گیرنده را وارد کنید", {
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
    <div className="pt-6 mx-auto">
      <div className="right-dir text-lg text-white font-IranSansBold">
        ایجاد پیام جدید
      </div>
      <div className="rounded-b-lg py-6">
        <form className="mt-6" onSubmit={(e) => handleSubmit(e)}>
          <div className="relative flex gap-2 right-dir">
            <input
              className="right-dir appearance-none bg-transparent border-2 pr-4 border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600  transition  rounded-md w-3/4 py-3 text-gray-300 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
              id="title"
              type="text"
              placeholder="عنوان"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="right-dir appearance-none text-xs md:text-sm bg-transparent border-2 pr-4 border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600  transition  rounded-md w-1/4 py-3 text-gray-300 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
              id="receiver"
              type="text"
              placeholder="کد ملی گیرنده"
              onChange={(e) => setReceiver(e.target.value)}
            />
          </div>
          <div className="relative mt-3">
            <textarea
              className="right-dir appearance-none bg-transparent border-2 pr-4 border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-300 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
              id="body"
              placeholder="متن پیام"
              rows={10}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="relative flex flex-wrap items-center justify-between">
            <input
              className="my-5 border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400"
              id="file"
              type="file"
              accept=".zip, .jpg, .png, .xls, .pdf, .rar"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="text-gray-400 ">پیوست</div>
          </div>
          <div className="flex items-center justify-center mt-8">
            <button className="text-white py-2 px-4 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition">
              ارسال
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
