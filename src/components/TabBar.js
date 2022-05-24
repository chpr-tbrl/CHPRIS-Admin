import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Stack } from "@carbon/react";
import { ArrowLeft } from "@carbon/icons-react";

export const TabBar = () => {
  const navigate = useNavigate();
  return (
    <Stack gap={7}>
      <Button
        size="sm"
        kind="tertiary"
        renderIcon={ArrowLeft}
        iconDescription="Go back"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <br />
    </Stack>
  );
};
