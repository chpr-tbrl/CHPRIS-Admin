import React, { useState, Fragment } from "react";
import { PageHeader, Spacer } from "components";
import {
  Form,
  Stack,
  Button,
  Column,
  FlexGrid,
  DataTable,
  Pagination,
  Table,
  TableCell,
  TextInput,
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
  ModalBody,
  ModalFooter,
  ComposedModal,
  ModalHeader,
  InlineLoading,
} from "@carbon/react";

import { Renew, Location, TrashCan, Save, Add } from "@carbon/icons-react";
import { useGetSitesQuery, useNewSiteMutation } from "services";
import { SITES_TABLE_HEADERS } from "schemas";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Sites = () => {
  const [open, setOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  //region id and name
  const { id, name } = useParams();

  const {
    data: rows = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetSitesQuery(id);

  const [newSite, { isLoading: isUpdating }] = useNewSiteMutation();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function closeActions() {
    setShowActions(false);
    setSelectedRow({});
    setOpen(false);
  }

  async function handleCreateSite(data) {
    let request = {
      id,
      ...data,
    };
    try {
      await newSite(request).unwrap();
      toast.success("Site created");
      closeActions();
      reset();
      refetch();
    } catch (error) {
      // we handle errors with middleware
    }
  }

  return (
    <FlexGrid fullWidth className="page">
      <PageHeader
        title={`Sites for ${name} region`}
        description="Manage and update all available sites"
        renderIcon={<Location size={42} />}
      />
      <Spacer h={7} />
      {isLoading || isFetching ? (
        <DataTableSkeleton columnCount={10} />
      ) : (
        <DataTable rows={rows} headers={SITES_TABLE_HEADERS} radio>
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getToolbarProps,
            getBatchActionProps,
            onInputChange,
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
                      onClick={() => alert("delete acton")}
                    >
                      Delete
                    </TableBatchAction>
                    <TableBatchAction
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? 0 : -1
                      }
                      renderIcon={Save}
                      onClick={() => setOpen(true)}
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
                      kind="ghost"
                      hasIconOnly
                      onClick={() => refetch()}
                      renderIcon={Renew}
                      iconDescription="refresh"
                    />
                    <Button
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? -1 : 0
                      }
                      onClick={() => setOpen(true)}
                      renderIcon={Add}
                      iconDescription="add site"
                    >
                      Add site
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
                        <TableRow key={i} {...getRowProps({ row })}>
                          <TableSelectRow
                            {...getSelectionProps({ row })}
                            checked={selectedRow?.id === row.id}
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
                      No available sites
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
      {rows.length > 0 && (
        <Pagination pageSizes={[10, 20, 30, 40, 50]} totalItems={rows.length} />
      )}
      <ComposedModal open={open}>
        <ModalHeader
          title="Add site"
          label="Site management"
          buttonOnClick={() => closeActions()}
        />
        <Form onSubmit={handleSubmit(handleCreateSite)}>
          <ModalBody aria-label="create new sites">
            <Stack gap={7}>
              <p>Create a new site</p>
              <TextInput
                id="name"
                labelText="site"
                {...register("name", { required: "Please enter a site" })}
                invalid={errors.name ? true : false}
                invalidText={errors.name?.message}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              kind="secondary"
              type="button"
              onClick={() => closeActions()}
            >
              Cancel
            </Button>
            {!isUpdating ? (
              <Button type="submit">Save</Button>
            ) : (
              <Column>
                <InlineLoading
                  status="active"
                  iconDescription="Active loading indicator"
                  description="processing ..."
                />
              </Column>
            )}
          </ModalFooter>
        </Form>
      </ComposedModal>
    </FlexGrid>
  );
};

export default Sites;
