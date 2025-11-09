import React from "react";
import { Outlet } from "react-router-dom";
import { Nav, Footer } from "./Components/index";
import Layout from "./Layout/Layout";
const App = () => {
  return (
    <>
      <Nav />
      <Layout>
        <Outlet />
      </Layout>
      <Footer />
    </>
  );
};

export default App;
