import React, { Fragment } from "react";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <Fragment>
      <Navbar />
      <div className="layout">
        <Outlet />
      </div>
    </Fragment>
  );
};
