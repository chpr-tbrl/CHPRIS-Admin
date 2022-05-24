import React, { useState } from "react";
import { PageHeader, ActionCard, Spacer } from "components";
import {
  Row,
  Button,
  Modal,
  Column,
  FlexGrid,
  Pagination,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from "@carbon/react";

import {
  Add,
  User,
  Renew,
  Person,
  Account,
  PillsAdd,
} from "@carbon/icons-react";

const Records = () => {
  const [open, setOpen] = useState(false);

  return (
    <FlexGrid fullWidth className="page">
      <PageHeader
        title="Users"
        description="Manage and update all available users"
        renderIcon={<Account size={42} />}
      />
      <Row>
        <Column sm={0} md={8}>
          <Spacer h={5} />
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch expanded />
              <Button
                kind="tertiary"
                renderIcon={Renew}
                iconDescription="refresh"
                onClick={() => alert("button click")}
              >
                Refresh
              </Button>
              <Button
                to="new"
                renderIcon={Add}
                iconDescription="New user"
                onClick={() => alert("button click")}
              >
                New user
              </Button>
            </TableToolbarContent>
          </TableToolbar>
        </Column>
        <Column sm={4} md={0}>
          <Spacer h={5} />
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch expanded />
              <Button
                hasIconOnly
                kind="tertiary"
                renderIcon={Renew}
                iconDescription="refresh"
                onClick={() => alert("button clicked")}
              />
              <Button
                hasIconOnly
                renderIcon={Add}
                iconDescription="new user"
                onClick={() => alert("data")}
              />
            </TableToolbarContent>
          </TableToolbar>
        </Column>
      </Row>
      <Spacer h={7} />
      <Row>
        <Column sm={4} md={4} lg={4} className="record--card__container">
          record
        </Column>

        <Column>
          <Spacer h={5} />
          <h4
            style={{
              textAlign: "center",
            }}
          >
            No available records
          </h4>
          <Spacer h={5} />
        </Column>
      </Row>

      <Spacer h={7} />
      <Pagination pageSizes={[10, 20, 30, 40, 50]} totalItems={200} />

      <Modal
        open={open}
        passiveModal
        modalHeading="Available actions"
        modalLabel="Record details"
        aria-label="Available actions"
        onRequestClose={() => setOpen(false)}
      >
        <FlexGrid fullWidth>
          <PageHeader
            title="User name"
            description={`Manage and update records for user`}
            renderIcon={<User size={42} />}
          />
          <Row>
            <Column sm={4} md={4} lg={8} className="record--card__container">
              <ActionCard
                renderIcon={<Person size={32} />}
                label="Information"
                path="details"
              />
            </Column>
            <Column sm={4} md={4} lg={8} className="record--card__container">
              <ActionCard
                renderIcon={<PillsAdd size={32} />}
                label="Collect specimens"
                path="specimen-collection"
              />
            </Column>
          </Row>
        </FlexGrid>
      </Modal>
    </FlexGrid>
  );
};

export default Records;
