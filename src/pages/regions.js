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

import { Renew, Location, UpdateNow, Add } from "@carbon/icons-react";
import {
  useGetRegionsQuery,
  useNewRegionMutation,
  useUpdateRegionMutation,
} from "services";
import { REGIONS_TABLE_HEADERS } from "schemas";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Regions = () => {
  const [open, setOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);

  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetRegionsQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const [newRegion, { isLoading: isCreating }] = useNewRegionMutation();
  const [updateRegion, { isLoading: isUpdating }] = useUpdateRegionMutation();

  const rows = useMemo(() => {
    return data.map((item) => {
      return {
        ...item,
        sites: (
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
  } = useForm({
    defaultValues: {
      name: "",
      id: "",
    },
  });

  function handleRowSelection(row) {
    setShowActions(true);
    let region = rows.find((item) => item.id === row.id);
    reset({
      id: region.id,
      name: region.name,
    });
    setIsUpdate(true);
    setSelectedRow(region);
  }

  function closeActions() {
    setShowActions(false);
    setIsUpdate(false);
    setSelectedRow({});
    setOpen(false);
    reset({
      id: "",
      name: "",
    });
  }

  async function handleCreateRegion(data) {
    try {
      await newRegion(data).unwrap();
      toast.success("region created");
      closeActions();
      refetch();
    } catch (error) {
      // we handle errors with middleware
    }
  }

  async function handleRegionUpdate(data) {
    try {
      await updateRegion(data).unwrap();
      toast.success("region updated");
      closeActions();
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
                      renderIcon={UpdateNow}
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
                        <TableRow
                          key={i}
                          {...getRowProps({ row })}
                          onClick={() => handleRowSelection(row)}
                        >
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
        <ComposedModal  size= "sm" open={open}>
          <ModalHeader
            title={isUpdate ? "Update region" : "Add region"}
            label="Region management"
            buttonOnClick={() => closeActions()}
          />
          <Form
            onSubmit={
              isUpdate
                ? handleSubmit(handleRegionUpdate)
                : handleSubmit(handleCreateRegion)
            }
          >
            <ModalBody
              aria-label={isUpdate ? "Update a region" : "Create new regions"}
            >
              <Stack gap={7}>
                {!isUpdate && <p>Create a new region</p>}
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
              {!isUpdating || !isCreating ? (
                <Button type="submit">{isUpdate ? "Update" : "Save"}</Button>
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
