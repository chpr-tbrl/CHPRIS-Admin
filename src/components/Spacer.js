import React from "react";
import PropTypes from "prop-types";
import { spacing } from "@carbon/layout";

/* spacer component for layouts based on carbon spacing */
const mappedSpacing = spacing.map((key, index) => index + 1);

export const Spacer = ({ h }) => {
  return (
    <div
      style={{
        height: spacing[h - 1],
      }}
    />
  );
};

Spacer.propTypes = {
  h: PropTypes.oneOf(mappedSpacing),
};
