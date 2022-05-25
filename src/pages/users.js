import React, { useState, Fragment } from "react";
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
  DataTableSkeleton,
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
import { useGetUsersQuery } from "services";

const Records = () => {
  const [open, setOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const {
    data: rows = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetUsersQuery();

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
      key: "type_of_user",
      header: "Type",
    },
    {
      key: "region",
      header: "Region",
    },
    {
      key: "site",
      header: "Site",
    },
    {
      key: "state",
      header: "State",
    },
  ];

  function handleRowSelection(row) {
    setShowActions(true);
    let user = rows.find((user) => user.id === row.cells[0]?.value);
    setSelectedRow(user);
  }

  function closeActions() {
    setShowActions(false);
    setSelectedRow({});
  }

  return (
    <FlexGrid fullWidth className="page">
      <PageHeader
        title="Users"
        description="Manage and update all available users"
        renderIcon={<Account size={42} />}
      />
      <Spacer h={7} />

      {isLoading || isFetching ? (
        <DataTableSkeleton columnCount={10} />
      ) : (
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
                title=""
                description=""
                {...getTableContainerProps()}
              >
                <TableToolbar {...getToolbarProps()}>
                  <TableBatchActions
                    shouldShowBatchActions={showActions}
                    onCancel={() => closeActions()}
                    totalSelected={1}
                  >
                    <TableBatchAction
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? 0 : -1
                      }
                      renderIcon={TrashCan}
                      onClick={() => console.log(selectedRows)}
                    >
                      Delete
                    </TableBatchAction>
                    <TableBatchAction
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? 0 : -1
                      }
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
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? -1 : 0
                      }
                      onChange={onInputChange}
                    />
                    <Button
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? -1 : 0
                      }
                      onClick={() => refetch()}
                      renderIcon={Renew}
                      iconDescription="refresh"
                    >
                      Refresh
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
                {rows.length ? (
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
                ) : (
                  <Fragment>
                    <Spacer h={5} />
                    <h4
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No available users
                    </h4>
                    <Spacer h={5} />
                  </Fragment>
                )}
              </TableContainer>
            );
          }}
        </DataTable>
      )}

      <Spacer h={7} />
      {rows.length && (
        <Pagination
          pageSizes={[10, 20, 30, 40, 50]}
          totalItems={rows.length || 0}
        />
      )}
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
