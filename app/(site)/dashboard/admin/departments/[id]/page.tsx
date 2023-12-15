"use client";
import DepartmentDetails from "@/components/DepartmentDetails";
import { UserContext } from "@/context/UserContext";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
const page = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const { departments } = useContext(UserContext);
  const { id } = useParams();
  const department = departments.find((department) => department.id === id);
  return <>{department && <DepartmentDetails department={department} />}</>;
};

export default page;
