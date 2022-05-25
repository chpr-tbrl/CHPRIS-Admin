import React, { useState } from "react";
import { PageHeader, ActionCard, Spacer } from "components";
import {
  Row,
  Button,
  Modal,
  Column,
  FlexGrid,
  DataTable,
  Pagination,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableToolbar,
  TableHeader,
  TableContainer,
  TableBatchAction,
  TableSelectRow,
  TableToolbarContent,
  TableBatchActions,
  TableToolbarSearch,
} from "@carbon/react";

import {
  User,
  Renew,
  Person,
  Account,
  PillsAdd,
  TrashCan,
  Save,
} from "@carbon/icons-react";

const Records = () => {
  const [open, setOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const headers = [
    {
      key: "id",
      header: "User ID",
    },
    {
      key: "name",
      header: "Name",
    },
    {
      key: "role",
      header: "Role",
    },
    {
      key: "region",
      header: "Region",
    },
    {
      key: "site",
      header: "Site",
    },
  ];

  const rows = [
    {
      id: "1",
      name: "Person one",
      role: "Data-collector",
      region: "North-West",
      site: "Regional Hospital",
    },
    {
      id: "2",
      name: "Person two",
      role: "Admin",
      region: "North-West",
      site: "Regional Hospital",
    },
    {
      id: "3",
      name: "Person three",
      role: "Data-collector",
      region: "North-West",
      site: "Regional Hospital",
    },
    {
      id: "4",
      name: "Person four",
      role: "Data-collector",
      region: "North-West",
      site: "Regional Hospital",
    },
  ];

  function handleRowSelection(row) {
    setShowActions(true);

    let user = rows.find((user) => user.id === row.cells[0]?.value);
    setSelectedRow(user);
  }

  return (
    <FlexGrid fullWidth className="page">
      <PageHeader
        title="Users"
        description="Manage and update all available users"
        renderIcon={<Account size={42} />}
      />
      <Spacer h={7} />

      <DataTable rows={rows} headers={headers} radio>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getToolbarProps,
          getBatchActionProps,
          onInputChange,
          selectedRows,
          getTableProps,
          getSelectionProps,
          getTableContainerProps,
        }) => {
          const batchActionProps = getBatchActionProps();

          return (
            <TableContainer
              title="DataTable"
              description="With batch actions"
              {...getTableContainerProps()}
            >
              <TableToolbar {...getToolbarProps()}>
                <TableBatchActions
                  shouldShowBatchActions={showActions}
                  onCancel={() => setShowActions(false)}
                  totalSelected={1}
                >
                  <TableBatchAction
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                    renderIcon={TrashCan}
                    onClick={() => console.log(selectedRows)}
                  >
                    Delete
                  </TableBatchAction>
                  <TableBatchAction
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                    renderIcon={Save}
                    onClick={() => console.log(selectedRows)}
                  >
                    Update
                  </TableBatchAction>
                </TableBatchActions>
                <TableToolbarContent
                  aria-hidden={batchActionProps.shouldShowBatchActions}
                >
                  <TableToolbarSearch
                    persistent
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    onChange={onInputChange}
                  />
                  <Button
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    onClick={() => alert("Add new row")}
                    renderIcon={Renew}
                    iconDescription="refresh"
                  >
                    Refresh
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <th scope="col" />
                    {headers.map((header, i) => (
                      <TableHeader key={i} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow
                      key={i}
                      {...getRowProps({ row })}
                      onClick={() => handleRowSelection(row)}
                    >
                      <TableSelectRow
                        {...getSelectionProps({ row })}
                        checked={selectedRow.id === row.id}
                      />
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          );
        }}
      </DataTable>

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
