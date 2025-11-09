import React from "react";
import { AdminNav, UserNav } from "../../index";
const GeneralNav = () => {
  // INFO: This is a Dumyy test for the nav bar
  const showNavAccordingToUser = (user = "user") => {
    if (user === "admin") return <AdminNav />;
    if (user === "user") return <UserNav />;
    return null;
  };

  return (
    <>
      <h1>Header</h1>
      {showNavAccordingToUser()}
    </>
  );
};

export default GeneralNav;
