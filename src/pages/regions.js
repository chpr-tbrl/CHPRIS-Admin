import React, { useState, useMemo, Fragment } from "react";
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
import { useGetRegionsQuery, useNewRegionMutation } from "services";
import { REGIONS_TABLE_HEADERS } from "schemas";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Regions = () => {
  const [open, setOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetRegionsQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const [newRegion, { isLoading: isUpdating }] = useNewRegionMutation();

  const rows = useMemo(() => {
    return data.map((item) => {
      return {
        ...item,
        action: (
          <Link className="cds--link" to={`../sites/${item.id}/${item.name}`}>
            view sites
          </Link>
        ),
      };
    });
  }, [data]);

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

  async function handleCreateRegion(data) {
    try {
      await newRegion(data).unwrap();
      toast.success("region created");
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
        title="Regions"
        description="Manage and update all available regions"
        renderIcon={<Location size={42} />}
      />
      <Spacer h={7} />
      {isLoading || isFetching ? (
        <DataTableSkeleton columnCount={10} />
      ) : (
        <DataTable rows={rows} headers={REGIONS_TABLE_HEADERS} radio>
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
                      iconDescription="add region"
                    >
                      Add region
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
                      No available regions
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

      {open && (
        <ComposedModal open={open}>
          <ModalHeader
            title="Add region"
            label="Region management"
            buttonOnClick={() => closeActions()}
          />
          <Form onSubmit={handleSubmit(handleCreateRegion)}>
            <ModalBody aria-label="create new regions">
              <Stack gap={7}>
                <p>Create a new region</p>
                <TextInput
                  id="name"
                  labelText="Region"
                  {...register("name", { required: "Please enter a region" })}
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
      )}
    </FlexGrid>
  );
};

export default Regions;
