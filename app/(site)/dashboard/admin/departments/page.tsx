"use client";
import DepartmentList from "@/components/DepartmentList";
import NewDepartment from "@/components/NewDepartment";
import { UserContext } from "@/context/UserContext";
import { DepartmentModel } from "@/types/prisma";
import { useContext, useEffect, useState } from "react";

const Page = () => {
  const deps = useContext(UserContext).departments;
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  useEffect(() => {
    setDepartments(deps);
  }, [deps]);
  return (
    <div className="flex flex-col justify-center gap-12">
      <div dir="rtl">
        <NewDepartment
          departments={departments}
          setDepartments={setDepartments}
        />
      </div>
      <DepartmentList
        departments={departments}
        setDepartments={setDepartments}
      />
    </div>
  );
};

export default Page;
