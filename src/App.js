import React, { Fragment } from "react";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Layout, DashLayout, RequireAuth } from "components";
import { Toaster } from "react-hot-toast";
import Login from "pages/login";
import NotFound from "./pages/not-found";
import Users from "pages/users";
import Regions from "pages/regions";
import Sites from "pages/sites";
import Account from "pages/account";
import PendingUsers from "pages/pending-users";
import UserSitesUpdate from "pages/user-sites-update";

function App() {
  return (
    <Fragment>
      <Toaster
        position="top-right"
        containerClassName="toast--container"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="login" />} />
            <Route path="login" element={<Login />} />
          </Route>

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="users" />} />
            <Route path="account" element={<Account />} />
            <Route path="users" element={<Outlet />}>
              <Route index element={<Users />} />
              <Route path="sites/:id/:name" element={<UserSitesUpdate />} />
            </Route>
            <Route path="pending" element={<PendingUsers />} />
            <Route path="regions" element={<Regions />} />
            <Route path="sites/:id/:name" element={<Sites />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
