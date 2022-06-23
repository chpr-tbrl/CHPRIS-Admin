import React, { useState, useMemo, useRef, Fragment } from "react";
import toast from "react-hot-toast";
import { PageHeader, Spacer } from "components";
import {
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
  ComposedModal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  TableToolbar,
  TableHeader,
  TableContainer,
  TableBatchAction,
  TableSelectRow,
  DataTableSkeleton,
  TableToolbarContent,
  TableBatchActions,
  TableToolbarSearch,
  InlineLoading,
  Link,
} from "@carbon/react";

import { Renew, Account, GroupSecurity, Location } from "@carbon/icons-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useGetSitesQuery,
  useGetUsersQuery,
  useGetRegionsQuery,
  useUpdateUserMutation,
} from "services";
import {
  findItemIndex,
  getRegionName,
  getSiteName,
  getUserType,
  getExportTypes,
  handleSetValue,
  getExportRangeInMonths,
} from "utils";
import {
  ROLES,
  ADMIN,
  MINIMAL_ROLES,
  SUPER_ADMIN,
  EXPORT_RANGE,
  ACCOUNT_STATUS,
  MINIMAL_ACCOUNT_STATUS,
  USERS_TABLE_HEADERS,
  USER_PERMISSION_UPDATE_SCHEMA,
} from "schemas";
import { authSelector } from "features";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useProfile } from "hooks";

const Users = () => {
  const auth = useSelector(authSelector);
  const { account, fetchingProfile } = useProfile(auth.uid);
  const [open, setOpen] = useState(false);
  const submitBtnRef = useRef(null);
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  // conditional permission checks and approvals
  const canApproveAccounts = account.permitted_approve_accounts;
  const isAdmin = account.account_type === ADMIN;
  const PERMITTED_ROLES = isAdmin ? MINIMAL_ROLES : ROLES;
  const PERMITTED_STATUS = canApproveAccounts
    ? ACCOUNT_STATUS
    : MINIMAL_ACCOUNT_STATUS;

  const {
    data: users = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetUsersQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const { data: regions = [], isLoading: loadingRegions } =
    useGetRegionsQuery();

  const { data: sites = [], isLoading: loadingSites } = useGetSitesQuery(null, {
    skip: true,
    refetchOnMountOrArgChange: true,
  });

  const rows = useMemo(() => {
    return users
      .filter(({ id }) => id !== auth.uid)
      .filter(({ account_type }) => {
        return (
          account_type !== SUPER_ADMIN && account_type !== auth.account_type
        );
      })
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
    resolver: yupResolver(USER_PERMISSION_UPDATE_SCHEMA),
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

  if (fetchingProfile || loadingRegions || loadingSites) return <Loading />;

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
                      renderIcon={Location}
                      onClick={() =>
                        navigate(
                          `sites/${selectedRow?.id}/${selectedRow?.name}`
                        )
                      }
                    >
                      Update Sites
                    </TableBatchAction>
                    <TableBatchAction
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? 0 : -1
                      }
                      renderIcon={GroupSecurity}
                      onClick={() => setOpen(true)}
                    >
                      Update permissions
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

      {open && (
        <ComposedModal size="lg" open={open} preventCloseOnClickOutside>
          <ModalHeader
            title="Update User"
            label="User management"
            buttonOnClick={() => closeActions()}
          />
          <ModalBody hasForm hasScrollingContent aria-label="User update modal">
            <Form onSubmit={handleSubmit(handleUserUpdate)}>
              <Stack orientation="horizontal" gap={10}>
                <div>
                  <FormLabel>ID</FormLabel>
                  <p>{selectedRow?.id || "N/A"}</p>
                </div>
                <div>
                  <FormLabel>Name</FormLabel>
                  <p>{selectedRow?.name || "N/A"}</p>
                </div>
              </Stack>
              <Spacer h={5} />
              <Stack gap={7}>
                <Dropdown
                  id="roles"
                  titleText="Role"
                  label="Select role"
                  items={PERMITTED_ROLES}
                  itemToString={(item) => item.name}
                  invalid={errors.account_type ? true : false}
                  invalidText={errors.account_type?.message}
                  initialSelectedItem={findItemIndex(
                    selectedRow?.account_type,
                    PERMITTED_ROLES
                  )}
                  onChange={(evt) => {
                    handleSetValue(
                      "account_type",
                      evt.selectedItem.id,
                      setValue
                    );
                  }}
                />

                <Dropdown
                  id="status"
                  titleText="Account status"
                  label="select status"
                  items={PERMITTED_STATUS}
                  itemToString={(item) => item}
                  invalid={errors.account_type ? true : false}
                  invalidText={errors.account_type?.message}
                  initialSelectedItem={findItemIndex(
                    selectedRow?.account_status,
                    PERMITTED_STATUS
                  )}
                  onChange={(evt) => {
                    handleSetValue(
                      "account_status",
                      evt.selectedItem,
                      setValue
                    );
                  }}
                />

                <Dropdown
                  id="duration"
                  titleText="Data acquistion duration"
                  label="Select range"
                  items={EXPORT_RANGE}
                  itemToString={(item) => item.name}
                  invalid={errors.permitted_export_range ? true : false}
                  invalidText={errors.permitted_export_range?.message}
                  initialSelectedItem={findItemIndex(
                    selectedRow?.permitted_export_range,
                    EXPORT_RANGE
                  )}
                  onChange={(evt) => {
                    handleSetValue(
                      "permitted_export_range",
                      evt.selectedItem.id,
                      setValue
                    );
                  }}
                />

                <FormGroup legendText="">
                  <Stack gap={3}>
                    <Checkbox
                      labelText="Can see decrypted data"
                      id="permitted_decrypted_data"
                      {...register("permitted_decrypted_data")}
                    />
                    <Checkbox
                      labelText="Can approve accounts"
                      id="permitted_approve_accounts"
                      {...register("permitted_approve_accounts")}
                    />
                    <Link href="https://gdpr-info.eu/" target="_blank">
                      GDPR policy
                    </Link>
                  </Stack>
                </FormGroup>

                <FormGroup legendText="Can export data in">
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
              </Stack>
              <button
                type="submit"
                ref={submitBtnRef}
                hidden
                aria-label="submit"
              ></button>
            </Form>
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
              <Button onClick={() => submitBtnRef.current.click()}>Save</Button>
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
        </ComposedModal>
      )}
    </FlexGrid>
  );
};

export default Users;
