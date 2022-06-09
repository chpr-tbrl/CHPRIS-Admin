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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useGetRegionsQuery,
  useGetSitesQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "services";
import {
  getRegionName,
  getSiteName,
  getUserType,
  getExportTypes,
  getExportRangeInMonths,
} from "utils";
import {
  ROLES,
  EXPORT_RANGE,
  USER_UPDATE_SCHEMA,
  USERS_TABLE_HEADERS,
} from "schemas";
import { authSelector } from "features";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Users = () => {
  const auth = useSelector(authSelector);
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
    return users
      .filter((user) => user.id !== auth.uid)
      .map((item) => {
        return {
          ...item,
          export_types: getExportTypes(item.permitted_export_types),
          region: getRegionName(item.region_id, regions),
          site: getSiteName(item.site_id, sites),
          type: getUserType(item.account_type),
          export_range: getExportRangeInMonths(item.permitted_export_range),
        };
      });
  }, [users, regions, sites, auth]);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    reset,
    setValue,
    register,
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
                      onClick={() => alert("deactivate action")}
                    >
                      Deactivate
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
      {rows.length > 0 && (
        <Pagination pageSizes={[10, 20, 30, 40, 50]} totalItems={rows.length} />
      )}
      <ComposedModal open={open} preventCloseOnClickOutside>
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
                itemToString={(item) => item.name}
                invalid={errors.account_type ? true : false}
                invalidText={errors.account_type?.message}
                onChange={(evt) =>
                  setValue("account_type", evt.selectedItem.id, {
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
                    items={regions}
                    itemToString={(item) => item.name}
                    invalid={errors.region_id ? true : false}
                    invalidText={errors.region_id?.message}
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
                    items={sites}
                    itemToString={(item) => item.name}
                    invalid={errors.site_id ? true : false}
                    invalidText={errors.site_id?.message}
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
                    itemToString={(item) => item.name}
                    invalid={errors.permitted_export_range ? true : false}
                    invalidText={errors.permitted_export_range?.message}
                    onChange={(evt) =>
                      setValue("permitted_export_range", evt.selectedItem.id, {
                        shouldValidate: true,
                      })
                    }
                  />
                </Column>
                <Column>
                  <FormGroup legendText="Export permission">
                    <Checkbox
                      labelText="CSV"
                      value="csv"
                      id="permitted_export_types.0"
                      {...register("permitted_export_types.0")}
                    />
                    <Checkbox
                      labelText="PDF"
                      value="pdf"
                      id="permitted_export_types.1"
                      {...register("permitted_export_types.1")}
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
