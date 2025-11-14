import React from "react";
import { useSelector } from "react-redux";
import { AdminNav, Sidebar, ViewersNav } from "../index";

const GeneralNav = () => {
  const { user } = useSelector((state) => state.auth);

  const role = user?.role || "public";

  if (role === "admin") return <AdminNav />;
  if (role === "user") return <Sidebar />;

  return <ViewersNav />;
};

export default GeneralNav;
