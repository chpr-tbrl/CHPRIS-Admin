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
  TableBatchActions,
  TableBatchAction,
  TableToolbarContent,
  TableToolbarSearch,
  TableSelectRow,
  ModalBody,
  ModalFooter,
  ComposedModal,
  ModalHeader,
  InlineLoading,
} from "@carbon/react";

import { Renew, Location, Add, UpdateNow } from "@carbon/icons-react";
import {
  useGetSitesQuery,
  useNewSiteMutation,
  useUpdateSiteMutation,
} from "services";
import { SITES_TABLE_HEADERS } from "schemas";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Sites = () => {
  const [open, setOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);

  //region id and name
  const { id, name } = useParams();

  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetSitesQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const rows = useMemo(() => {
    return data.map((item) => {
      return {
        ...item,
        code: item.site_code,
      };
    });
  }, [data]);

  const [newSite, { isLoading: isCreating }] = useNewSiteMutation();
  const [updateSite, { isLoading: isUpdating }] = useUpdateSiteMutation();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: id,
      name: "",
      site_code: "",
    },
  });

  function handleRowSelection(row) {
    setShowActions(true);
    let site = rows.find((item) => item.id === row.id);
    reset({
      id: site.id,
      name: site.name,
      site_code: site.site_code,
    });
    setIsUpdate(true);
    setSelectedRow(site);
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

  async function handleSiteUpdate(data) {
    try {
      await updateSite(data).unwrap();
      toast.success("Site updated");
      closeActions();
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
                      renderIcon={UpdateNow}
                      onClick={() => setOpen(true)}
                    >
                      Update
                    </TableBatchAction>
                  </TableBatchActions>
                  <TableToolbarContent aria-hidden={false}>
                    <TableToolbarSearch
                      persistent
                      tabIndex={-1}
                      onChange={onInputChange}
                    />
                    <Button
                      tabIndex={-1}
                      kind="ghost"
                      hasIconOnly
                      onClick={() => refetch()}
                      renderIcon={Renew}
                      iconDescription="refresh"
                    />
                    <Button
                      tabIndex={-1}
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

      {open && (
        <ComposedModal open={open}>
          <ModalHeader
            title={isUpdate ? "Update site" : "Add site"}
            label="Site management"
            buttonOnClick={() => closeActions()}
          />
          <Form
            onSubmit={
              isUpdate
                ? handleSubmit(handleSiteUpdate)
                : handleSubmit(handleCreateSite)
            }
          >
            <ModalBody aria-label="create new sites">
              <Stack gap={7}>
                {!isUpdate && <p>Create a new site</p>}
                <TextInput
                  id="name"
                  labelText="Site name"
                  {...register("name", { required: "Please enter a site" })}
                  invalid={errors.name ? true : false}
                  invalidText={errors.name?.message}
                />

                <TextInput
                  id="site_code"
                  labelText="Site code"
                  {...register("site_code", {
                    required: "Please enter a site code",
                  })}
                  invalid={errors.site_code ? true : false}
                  invalidText={errors.site_code?.message}
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

export default Sites;
