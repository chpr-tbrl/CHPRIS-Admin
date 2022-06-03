import React, { useState, useMemo, Fragment } from "react";
import { PageHeader, Spacer } from "components";
import {
  Row,
  Form,
  Stack,
  Button,
  Column,
  Dropdown,
  FlexGrid,
  FormGroup,
  Checkbox,
  DataTable,
  Pagination,
  Table,
  Loading,
  TableCell,
  FormLabel,
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

import { Renew, Account, TrashCan, Save } from "@carbon/icons-react";
import { useGetUsersQuery, useUpdateUserMutation } from "services";
import {
  ROLES,
  SITES,
  REGIONS,
  EXPORT_RANGE,
  USER_UPDATE_SCHEMA,
  USERS_TABLE_HEADERS,
} from "schemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetRegionsQuery, useGetSitesQuery } from "services";

import { getRegionName, getSiteName, getExportableRangeInMonths } from "utils";
import toast from "react-hot-toast";

const Users = () => {
  const [open, setOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const {
    data: users = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetUsersQuery();

  const { data: regions = [], isLoading: loadingRegions } =
    useGetRegionsQuery();

  const { data: sites = [], isLoading: loadingSites } = useGetSitesQuery(null, {
    skip: true,
    refetchOnMountOrArgChange: true,
  });

  const rows = useMemo(() => {
    return users.map((item) => {
      return {
        ...item,
        type_of_export: item.type_of_export ? item.type_of_export : "N/A",
        region_id: getRegionName(item.region_id, regions),
        site_id: getSiteName(item.site_id, sites),
        exportable_range: getExportableRangeInMonths(item.exportable_range),
      };
    });
  }, [users, regions, sites]);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(USER_UPDATE_SCHEMA),
  });

  function handleRowSelection(row) {
    setShowActions(true);
    let user = rows.find((user) => user.id === row.cells[0]?.value);
    reset(user);
    setSelectedRow(user);
  }

  function closeActions() {
    setShowActions(false);
    setSelectedRow({});
    setOpen(false);
    reset();
  }

  async function handleUserUpdate(data) {
    try {
      await updateUser(data).unwrap();
      toast.success("user updated");
      closeActions();
      refetch();
    } catch (error) {
      // we handle errors with middleware
    }
  }

  if (loadingRegions || loadingSites) return <Loading />;
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
        <DataTable rows={rows} headers={USERS_TABLE_HEADERS} radio>
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
        <Pagination pageSizes={[10, 20, 30, 40, 50]} totalItems={rows.length} />
      )}
      <ComposedModal open={open}>
        <ModalHeader
          title="Update User"
          label="User management"
          buttonOnClick={() => closeActions()}
        />
        <Form onSubmit={handleSubmit(handleUserUpdate)}>
          <ModalBody hasForm aria-label="User update modal">
            <Stack orientation="horizontal" gap={10}>
              <div>
                <FormLabel>ID</FormLabel>
                <p>{selectedRow?.id || "N/A"}</p>
              </div>
              <div>
                <FormLabel>Patient's name</FormLabel>
                <p>{selectedRow?.name || "N/A"}</p>
              </div>
            </Stack>
            <Spacer h={5} />
            <Stack gap={7}>
              <Dropdown
                id="roles"
                titleText="Role"
                label="Select role"
                items={ROLES}
                itemToString={(item) => item.text}
                invalid={errors.type_of_user ? true : false}
                invalidText={errors.type_of_user?.message}
                initialSelectedItem={selectedRow?.type_of_user}
                onChange={(evt) =>
                  setValue("type_of_user", evt.selectedItem.id, {
                    shouldValidate: true,
                  })
                }
              />

              <Row>
                <Column>
                  <Dropdown
                    id="region"
                    titleText="Region"
                    label="Select region"
                    items={REGIONS}
                    itemToString={(item) => item.text}
                    invalid={errors.region_id ? true : false}
                    invalidText={errors.region_id?.message}
                    initialSelectedItem={selectedRow?.region_id}
                    onChange={(evt) =>
                      setValue("region_id", evt.selectedItem.id, {
                        shouldValidate: true,
                      })
                    }
                  />
                </Column>
                <Column>
                  <Dropdown
                    id="site"
                    titleText="Site"
                    label="Select site"
                    items={SITES}
                    itemToString={(item) => item.text}
                    invalid={errors.site_id ? true : false}
                    invalidText={errors.site_id?.message}
                    initialSelectedItem={selectedRow?.site_id}
                    onChange={(evt) =>
                      setValue("site_id", evt.selectedItem.id, {
                        shouldValidate: true,
                      })
                    }
                  />
                </Column>
              </Row>

              <Row>
                <Column>
                  <Dropdown
                    id="duration"
                    titleText="Data acquistion duration"
                    label="Select range"
                    direction="top"
                    items={EXPORT_RANGE}
                    itemToString={(item) => item.text}
                    invalid={errors.exportable_range ? true : false}
                    invalidText={errors.exportable_range?.message}
                    initialSelectedItem={selectedRow?.exportable_range}
                    onChange={(evt) =>
                      setValue("exportable_range", evt.selectedItem.id, {
                        shouldValidate: true,
                      })
                    }
                  />
                </Column>
                <Column>
                  <FormGroup legendText="Export permission">
                    <Checkbox
                      labelText="CSV"
                      id="export-type-csv"
                      onChange={() =>
                        setValue("type_of_export", "csv", {
                          shouldValidate: true,
                        })
                      }
                    />
                    <Checkbox
                      labelText="PDF"
                      value="pdf"
                      id="export-type-pdf"
                      onChange={() =>
                        setValue("type_of_export", "pdf", {
                          shouldValidate: true,
                        })
                      }
                    />
                  </FormGroup>
                </Column>
              </Row>
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

export default Users;
