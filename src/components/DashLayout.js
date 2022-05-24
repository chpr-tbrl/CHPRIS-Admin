import React, { Fragment } from "react";
import { DashNavbar } from "./DashNavbar";
import { Outlet } from "react-router-dom";

export const DashLayout = () => {
  return (
    <Fragment>
      <DashNavbar />
      <div className="layout">
        <Outlet />
      </div>
    </Fragment>
  );
};
