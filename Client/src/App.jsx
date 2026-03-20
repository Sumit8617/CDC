import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "./Layout/Layout";
import MaintenancePage from "./Pages/Maintainance";
const App = () => {
  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
      {/* <MaintenancePage /> */}
    </>
  );
};

export default App;
