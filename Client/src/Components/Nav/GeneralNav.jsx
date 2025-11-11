import React, { useEffect, useState } from "react";
import { AdminNav, UserNav, ViewersNav } from "../../index";

const GeneralNav = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Get role from localStorage (you should set this during login/signup)
    const storedRole = "user";
    setRole(storedRole);
  }, []);

  if (!role) return null; // Prevent flashing while loading role

  if (role === "admin") return <AdminNav />;
  if (role === "user") return <UserNav />;
  return <ViewersNav />;
};

export default GeneralNav;
