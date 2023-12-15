import Image from "next/image";
import logo from "@/public/assets/img/logo-sm.png";
export function SidebarHeader() {
  return (
    <div className="sticky top-0 z-10 mb-6 flex flex-col items-center justify-center bg-gray-900 pb-6 pt-3">
      <Image src={logo} width={60} alt="Enoch Ndika" />
      <p className="font-BTitr pt-2 text-[11px]">نیرو صنعت گستر شرق</p>
      <p className="font-Mt pt-2 text-xs tracking-widest">N.S.G.S.CO</p>
    </div>
  );
}
