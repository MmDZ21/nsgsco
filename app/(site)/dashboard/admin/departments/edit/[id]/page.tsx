"use client";
import EditDepartment from "@/components/EditDepartment";
import { UserContext } from "@/context/UserContext";
import { useParams } from "next/navigation";
import React, { useContext } from "react";
const page = () => {
  const departments = useContext(UserContext).departments;
  const id = useParams().id;
  const department = departments.find((department) => department.id === id);
  return (
    <div className="flex flex-col justify-center gap-12">
      {department && <EditDepartment department={department} />}
    </div>
  );
};

export default page;
