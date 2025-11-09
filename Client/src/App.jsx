import React from "react";
import { Outlet } from "react-router-dom";
import { GeneralNav, Footer } from "./Components/index";
import Layout from "./Layout/Layout";
const App = () => {
  return (
    <>
      <Layout>
        <GeneralNav />
        <Outlet />
        <Footer />
      </Layout>
    </>
  );
};

export default App;
