import React, { useEffect, useState } from "react";
import { AdminNav, Sidebar, ViewersNav } from "../index";

const GeneralNav = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = "user";
    setRole(storedRole);
  }, []);

  if (!role) return null; // Prevent flashing while loading role

  if (role === "admin") return <AdminNav />;
  if (role === "user") return <Sidebar />;
  return <ViewersNav />;
};

export default GeneralNav;
