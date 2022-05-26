import React from "react";
import { Stack, Button, FlexGrid } from "@carbon/react";
import { useNavigate } from "react-router-dom";
import { Spacer } from "components";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <FlexGrid className="page">
      <Spacer h={9} />
      <Stack gap={7}>
        <h1>Page not found</h1>
        <p>Sorry this page is currently unavailable</p>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Stack>
    </FlexGrid>
  );
};

export default NotFound;
