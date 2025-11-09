import React from "react";
import { AdminNav, UserNav, ViewersNav } from "../../index";
const GeneralNav = () => {
  // INFO: This is a Dumyy test for the nav bar
  const showNavAccordingToUser = (user = "") => {
    if (user === "admin") return <AdminNav />;
    if (user === "user") return <UserNav />;
    return <ViewersNav />;
  };

  return showNavAccordingToUser();
};

export default GeneralNav;