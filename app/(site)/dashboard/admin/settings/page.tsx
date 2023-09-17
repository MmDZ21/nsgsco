import ChangeAvatar from "@/components/ChangeAvatar";
import ChangePassword from "@/components/ChangePassword";

const page = () => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-900 md:justify-evenly gap-16 items-center md:items-start p-16 rounded-xl">
      <ChangeAvatar />
      <div className="bg-gray-600 h-[1px] w-56 lg:h-80 lg:w-[1px] lg:block md:hidden "></div>
      <ChangePassword />
    </div>
  );
};

export default page;
