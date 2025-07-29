"use client";
import AddUserManual from "@/components/AddUserManual";
import { UserContext } from "@/context/UserContext";
import { useParams } from "next/navigation";
import React, { useContext } from "react";
const Page = () => {
  const departments = useContext(UserContext).departments;
  const id = useParams().id;
  const department = departments.find((department) => department.id === id);
  return <>{department && <AddUserManual department={department} />}</>;
};

export default Page;
