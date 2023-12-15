"use client";
import AddUserGroup from "@/components/AddUserGroup";
import { UserContext } from "@/context/UserContext";
import { useParams } from "next/navigation";
import React, { useContext } from "react";
const page = () => {
  const departments = useContext(UserContext).departments;
  const id = useParams().id;
  const department = departments.find((department) => department.id === id);
  return <>{department && <AddUserGroup department={department} />}</>;
};

export default page;
