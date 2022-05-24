import React, { isValidElement } from "react";
import PropTypes from "prop-types";
import { ClickableTile, Stack } from "@carbon/react";
import { ArrowRight } from "@carbon/icons-react";
import { Link } from "react-router-dom";
export const RecordCard = ({ id, sex, date, updated, name, ...rest }) => {
  return (
    <ClickableTile className="record--card" {...rest}>
      <Stack gap={4}>
        <small>ID-{id}</small>
        <h3>{name}</h3>
        <p>Sex: {sex}</p>
        <p>created: {new Date(date).toLocaleString()}</p>
        <p>Last updated: {new Date(updated).toLocaleString()}</p>
        <ArrowRight size={20} className="record--card__icon" />
      </Stack>
    </ClickableTile>
  );
};

RecordCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  sex: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
};

export const ActionCard = ({ label, path, renderIcon, ...rest }) => {
  return (
    <Link to={path} className="action--card">
      <div className="action--card__content" {...rest}>
        {isValidElement(renderIcon) && renderIcon}
        <h4>{label}</h4>
        <ArrowRight size={24} className="action--card__icon" />
      </div>
    </Link>
  );
};

ActionCard.propTypes = {
  name: PropTypes.string,
  path: PropTypes.string,
  renderIcon: PropTypes.node,
};
