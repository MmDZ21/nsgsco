"use client";
import { FormEvent, useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { fetchSuggestions } = useContext(UserContext);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if both title and body are non-empty
    if (title.trim() !== "" && body.trim() !== "") {
      // Create a FormData object and append the form data (title, body, file)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      // Send a POST request to your API endpoint (e.g., /api/tickets) with formData
      const response = await toast.promise(
        fetch("/api/suggestions/new", {
          method: "POST",
          body: formData,
        }),
        {
          pending: "در حال ارسال",
          success: " پیشنهاد شما ارسال شد",
          error: "ناموفق",
        }
      );

      // Handle the response and display a success message or error
      if (response.ok) {
        setBody("");
        setTitle("");
        fetchSuggestions();
        router.push(
          `/dashboard/${
            session?.user.role === "ADMIN" ? "admin" : "user"
          }/suggestions`
        );
      }
    } else {
      // If either title or body is empty, show an error message
      toast.warn("عنوان و متن را وارد کنید", {
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
        ایجاد پیشنهاد جدید
      </div>
      <div className="bg-gray-800 rounded-b-lg py-6">
        <form className="mt-6" onSubmit={(e) => handleSubmit(e)}>
          <div className="relative">
            <input
              className="right-dir appearance-none bg-gray-800 border-2 pr-6 border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-300 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
              id="title"
              type="text"
              placeholder="عنوان"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="relative mt-3">
            <textarea
              className="right-dir appearance-none bg-gray-800 border-2 pr-6 border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-300 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
              id="body"
              placeholder="متن پیشنهاد"
              rows={10}
              onChange={(e) => setBody(e.target.value)}
            />
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
