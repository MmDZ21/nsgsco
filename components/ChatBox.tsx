"use client";
import { UserContext } from "@/context/UserContext";
import { TicketModel } from "@/types/prisma";
import moment from "jalali-moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect, useRef, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  ownMessage: "right-dir",
  hisMessage: "",
};
export const ChatBox = ({ ticket }: { ticket: TicketModel }) => {
  const router = useRouter();
  const { fetchTickets } = useContext(UserContext);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("sign-in");
    },
  });

  const [reply, setReply] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messages = ticket.messages;
  console.log(messages);

  useEffect(() => {
    // Scroll to the last message element
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  const handleDownload = (file: any) => {
    if (file.id !== undefined) {
      const downloadLink = document.createElement("a");
      downloadLink.href = `/api/tickets/download/${file.id}`; // Replace with your download API endpoint
      downloadLink.target = "_blank";
      downloadLink.download = file.id;
      downloadLink.click();
    }
    // Trigger a download for the selected payslip
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create a FormData object and append the form data (reply, file)
    if (reply.trim() !== "") {
      const formData = new FormData();
      formData.append("reply", reply);
      formData.append("ticketId", ticket.id);
      if (file) {
        formData.append("file", file);
      }

      // Send a POST request to your API endpoint (e.g., /api/tickets/reply) with formData
      const response = await toast.promise(
        fetch("/api/tickets/reply", {
          method: "POST",
          body: formData,
        }),
        {
          pending: "در حال ارسال",
          success: "پاسخ شما ارسال شد",
          error: "پاسخ ارسال نشد!",
        }
      );

      // Handle the response and display a success message or error
      if (response.ok) {
        setReply("");
        fetchTickets();
      }
    } else {
      toast.warn("متن پاسخ را وارد کنید", {
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
  const chat = messages.map((message) => (
    <div
      key={message.id}
      className={`flex-col flex-wrap text-white justify-center py-2 px-3 ${
        message.user.id === session?.user.id
          ? style.ownMessage
          : style.hisMessage
      }`}
    >
      <div className="flex break-words">
        <img
          src={message.user.image || "/assets/img/avatar.png"}
          alt={message.user.name || message.user.id}
          className={`h-10 w-10 ${
            message.user.id === session?.user.id ? "ml-3" : "mr-3"
          } rounded-full object-cover`}
        />
        <div
          className={`${
            message.user.id === session?.user.id
              ? "bg-[#044b47] rounded-e-xl"
              : "bg-gray-900 rounded-s-xl"
          } p-4 max-w-[70%] mt-3 rounded-b-xl right-dir`}
        >
          <div className="text-xs mb-4 text-gray-400">{message.user.name}:</div>
          <div className="text-xs mb-4">{message.body}</div>
          <div className="flex flex-wrap justify-between items-center">
            <div className="text-[10px] text-gray-400 ">
              {moment(message.createdAt).format("jYYYY-jMM-jDD HH:mm:ss")}
            </div>
          </div>
        </div>
      </div>
      {message.file[0] && (
        <button
          onClick={() => handleDownload(message.file[0])}
          className="text-gray-300 border-[1px] border- p-2 rounded-lg text-center text-xs mx-14 mt-4 hover:bg-gray-900 transition ease-in-out"
        >
          فایل ضمیمه
        </button>
      )}
    </div>
  ));
  return (
    <div className="flex-col bg-gray-800 rounded">
      <div className="text-white right-dir border-b-2 font-IranSansBold border-nsgsco py-5 pr-4">
        {ticket.title}
      </div>
      <div
        className="flex-col overflow-y-scroll my-4 h-72"
        ref={chatContainerRef}
      >
        {chat}
      </div>
      <div>
        <form className="flex-col" dir="rtl" onSubmit={handleSubmit}>
          <textarea
            className="text-white bg-transparent rounded-lg focus:outline-none border-[1px] border-nsgsco w-full p-3 "
            placeholder="پاسخ شما"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div className="flex items-center justify-between py-4">
            <button
              className="text-white py-3 px-7 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
              type="submit"
            >
              ارسال پاسخ
            </button>
            <label className="flex items-center " htmlFor="file">
              <span className="text-gray-400 text-sm ml-3">پیوست</span>
              <svg
                className="w-6 h-6 text-white cursor-pointer hover:text-nsgsco transition ease-in-out"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m14.707 4.793-4-4a1 1 0 0 0-1.416 0l-4 4a1 1 0 1 0 1.416 1.414L9 3.914V12.5a1 1 0 0 0 2 0V3.914l2.293 2.293a1 1 0 0 0 1.414-1.414Z" />
                <path d="M18 12h-5v.5a3 3 0 0 1-6 0V12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
              </svg>
            </label>
            <input
              hidden
              id="file"
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
