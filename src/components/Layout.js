import React, { Fragment } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <Fragment>
      <Navbar />
      <div className="layout">
        <Outlet />
      </div>
      <Footer />
    </Fragment>
  );
};
