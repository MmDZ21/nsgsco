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
          src={
            message.user.image
              ? `/api/images/${message.user.id}`
              : "/assets/img/avatar.png"
          }
          alt={message.user.name || message.user.id}
          className={`h-10 w-10 ${
            message.user.id === session?.user.id ? "ml-3" : "mr-3"
          } rounded-full object-cover`}
        />
        <div
          className={`${
            message.user.id === session?.user.id
              ? "bg-[#044b47] bg-opacity-40 rounded-e-xl"
              : "bg-gray-950 bg-opacity-40 rounded-s-xl"
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
    <div className="flex-col rounded">
      <div className="text-white flex justify-between right-dir border-b-2 font-IranSansBold border-nsgsco py-5 pr-4">
        <div>{ticket.title}</div>
        <div>{session?.user.role === "ADMIN" ? ticket.user.name : ""}</div>
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
            <input
              id="file"
              type="file"
              accept=".pdf,.jpg,.png"
              className="my-5 border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
