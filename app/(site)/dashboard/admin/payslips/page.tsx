import PayslipList from "@/components/PayslipList";
import UploadForm from "@/components/UploadForm";
const Page = () => {
  return (
    <div className="flex flex-col justify-center gap-12">
      <UploadForm />
      <div className="bg-gray-600 w-full h-[1px]"></div>
      <PayslipList />
    </div>
  );
};

export default Page;
