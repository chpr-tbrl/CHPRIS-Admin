import React, { Fragment } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Layout, DashLayout } from "components";
import { Toaster } from "react-hot-toast";
import Login from "pages/login";
import NotFound from "./pages/not-found";
import Users from "pages/users";

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

          <Route path="/dashboard" element={<DashLayout />}>
            <Route index element={<Navigate to="users" />} />
            <Route path="users">
              <Route index element={<Users />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
