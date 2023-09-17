import Link from "next/link";
import { Route } from "@/components/sidebar/routes";

const DashboardCards = (props: Route) => {
  return (
    <Link href={props.link} className="w-full md:w-4/12" key={props.title}>
      <div className="p-2">
        <div className="rounded-3xl p-4 bg-gray-700 hover:bg-nsgsco hover:scale-105 shadow-md hover:shadow-[#102524] cursor-pointer transition ease-in-out duration-300">
          <div className="mb-4 mt-5 text-center">
            <p className="inline-block">{props.icon}</p>
            <p className="mt-2 text-sm">{props.title}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DashboardCards;
