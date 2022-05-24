import React, { isValidElement } from "react";
import PropTypes from "prop-types";
import { Stack } from "@carbon/react";

export const PageHeader = ({ title, description, renderIcon }) => {
  return (
    <header className="page--header">
      <Stack gap={3}>
        <h1 className="page--header__title">
          {isValidElement(renderIcon) && (
            <span className="page--header__icon">{renderIcon}</span>
          )}
          <span>{title}</span>
        </h1>
        <p>{description}</p>
      </Stack>
    </header>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  renderIcon: PropTypes.node,
};
