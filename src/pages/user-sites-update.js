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
  Dropdown,
  TableHead,
  TableRow,
  TableBody,
  TableToolbar,
  DataTableSkeleton,
  DropdownSkeleton,
  TableHeader,
  TableContainer,
  TableToolbarContent,
  TableToolbarSearch,
  ModalBody,
  ModalFooter,
  MultiSelect,
  ComposedModal,
  ModalHeader,
  InlineLoading,
} from "@carbon/react";

import { Renew, Location, Add, TrashCan } from "@carbon/icons-react";
import { useGetUserProfileQuery, useAddUserSiteMutation } from "services";
import { USER_SITES_UPDATE } from "schemas";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRegionsAndSites } from "hooks";
import { handleSetValue } from "utils";
import toast from "react-hot-toast";

const Sites = () => {
  const [open, setOpen] = useState(false);
  //region id and name
  const { id, name } = useParams();
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetUserProfileQuery(id);

  const rows = useMemo(() => {
    return data.map((item) => {
      return {
        ...item,
        region: item.region.name,
        action: (
          <Button
            renderIcon={TrashCan}
            kind="danger--ghost"
            onClick={() => alert("delete button")}
          >
            Delete
          </Button>
        ),
      };
    });
  }, [data]);

  const [addUserSite, { isLoading: isUpdating }] = useAddUserSiteMutation();

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { regions, sites, selectRegion, loadingRegions, loadingSites } =
    useRegionsAndSites(setValue);

  const updatedSites = useMemo(() => {
    return sites.map((item) => {
      return {
        ...item,
        id: item.id.toString(),
      };
    });
  }, [sites]);

  function closeActions() {
    setOpen(false);
  }

  async function handleAddSite({ site }) {
    let request = {
      id,
      site,
    };
    try {
      await addUserSite(request).unwrap();
      toast.success("Site created");
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
        <DataTable rows={rows} headers={USER_SITES_UPDATE} radio>
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
        <ComposedModal size="sm" open={open} preventCloseOnClickOutside>
          <ModalHeader
            title="Add site"
            label="Site management"
            buttonOnClick={() => closeActions()}
          />
          <Form onSubmit={handleSubmit(handleAddSite)}>
            <ModalBody aria-label="create new sites" hasScrollingContent>
              <Stack gap={7}>
                <Fragment>
                  {!loadingRegions ? (
                    <Dropdown
                      id="region"
                      titleText="Region"
                      label="Select region"
                      items={regions}
                      itemToString={(item) => item.name}
                      invalid={errors.region_id ? true : false}
                      invalidText={errors.region_id?.message}
                      onChange={(evt) => selectRegion(evt.selectedItem.id)}
                    />
                  ) : (
                    <DropdownSkeleton />
                  )}
                </Fragment>

                <Fragment>
                  {!loadingSites ? (
                    <MultiSelect
                      label="Select sites"
                      titleText="Sites"
                      helperText="Multiple items can be selected"
                      id="sites"
                      itemToString={(item) => (item ? item.name : "")}
                      items={updatedSites}
                      invalid={errors.site ? true : false}
                      invalidText={errors.site?.message}
                      onChange={({ selectedItems }) => {
                        selectedItems?.forEach((item, index) => {
                          handleSetValue(
                            `site.${index}`,
                            parseInt(item.id),
                            setValue
                          );
                        });
                      }}
                    />
                  ) : (
                    <DropdownSkeleton />
                  )}
                </Fragment>
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

export default Sites;
