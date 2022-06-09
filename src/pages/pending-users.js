import React, { useMemo, Fragment, useCallback } from "react";
import { PageHeader, Spacer } from "components";
import {
  Button,
  FlexGrid,
  DataTable,
  Pagination,
  Table,
  Loading,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableToolbar,
  DataTableSkeleton,
  TableHeader,
  TableContainer,
  TableToolbarContent,
  TableToolbarSearch,
} from "@carbon/react";

import { Renew, UserMultiple } from "@carbon/icons-react";

import {
  useGetRegionsQuery,
  useGetSitesQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "services";

import {
  getRegionName,
  getSiteName,
  getUserType,
  getExportTypes,
  getExportRangeInMonths,
} from "utils";
import { PENDING_TABLE_HEADERS } from "schemas";
import { authSelector } from "features";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const PendingUsers = () => {
  const auth = useSelector(authSelector);
  const {
    data: users = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetUsersQuery({ account_status: "pending" });

  const { data: regions = [], isLoading: loadingRegions } =
    useGetRegionsQuery();

  const { data: sites = [], isLoading: loadingSites } = useGetSitesQuery(null, {
    skip: true,
    refetchOnMountOrArgChange: true,
  });
  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  const handleUserApproval = useCallback(
    async (id) => {
      const request = {
        id,
        account_status: "approved",
      };
      try {
        await updateUserStatus(request).unwrap();
        toast.success("user updated");
        refetch();
      } catch (error) {
        // we handle errors with middleware
      }
    },
    [refetch, updateUserStatus]
  );

  const rows = useMemo(() => {
    return users
      .filter((user) => user.id !== auth.uid)
      .map((item) => {
        return {
          ...item,
          export_types: getExportTypes(item.permitted_export_types),
          region: getRegionName(item.region_id, regions),
          site: getSiteName(item.site_id, sites),
          type: getUserType(item.UserMultiple_type),
          export_range: getExportRangeInMonths(item.permitted_export_range),
          action: (
            <Button kind="ghost" onClick={() => handleUserApproval(item.id)}>
              approve
            </Button>
          ),
        };
      });
  }, [users, regions, sites, auth, handleUserApproval]);

  if (loadingRegions || loadingSites || isUpdating) return <Loading />;
  return (
    <FlexGrid fullWidth className="page">
      <PageHeader
        title="Pending users"
        description="Manage and update all newly created users"
        renderIcon={<UserMultiple size={42} />}
      />
      <Spacer h={7} />
      {isLoading || isFetching ? (
        <DataTableSkeleton columnCount={10} />
      ) : (
        <DataTable rows={rows} headers={PENDING_TABLE_HEADERS} radio>
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getToolbarProps,
            onInputChange,
            getTableProps,
            getTableContainerProps,
          }) => {
            return (
              <TableContainer
                title=""
                description=""
                {...getTableContainerProps()}
              >
                <TableToolbar {...getToolbarProps()}>
                  <TableToolbarContent>
                    <TableToolbarSearch persistent onChange={onInputChange} />
                    <Button
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
                      No pending accounts
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
    </FlexGrid>
  );
};

export default PendingUsers;
