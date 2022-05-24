import React from "react";
import { Stack, Button } from "@carbon/react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <section className="page">
      <Stack gap={7}>
        <h1>Page not found</h1>
        <p>Sorry this page is currently unavailable</p>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Stack>
    </section>
  );
};

export default NotFound;
