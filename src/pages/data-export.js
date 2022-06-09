import React, { useRef, Fragment } from "react";
import { PageHeader, Spacer } from "components";
import {
  Row,
  Form,
  Stack,
  Button,
  Column,
  FlexGrid,
  Dropdown,
  FormGroup,
  DatePicker,
  InlineLoading,
  DatePickerInput,
  DropdownSkeleton,
} from "@carbon/react";

import { WatsonHealthDownloadStudy } from "@carbon/icons-react";
import { DATA_EXPORT_SCHEMA } from "schemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDataExportMutation } from "services";
import { sub, format } from "date-fns";
import { useSelector } from "react-redux";
import { accountSelector } from "features";
import { useRegionsAndSites } from "hooks";
import { handleSetValue } from "utils";

import toast from "react-hot-toast";

const DataExport = () => {
  const downloadRef = useRef(null);
  const account = useSelector(accountSelector);
  const [dataExport, { isLoading: isExporting }] = useDataExportMutation();

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(DATA_EXPORT_SCHEMA),
  });

  const {
    sites,
    regions,
    regionId,
    selectSite,
    selectRegion,
    loadingRegions,
    loadingSites,
  } = useRegionsAndSites(setValue);

  function getExportRange() {
    const { permitted_export_range } = account;
    if (permitted_export_range) {
      return permitted_export_range > 4
        ? permitted_export_range - 1
        : permitted_export_range;
    }
    return null;
  }

  async function handleDataExport(data) {
    const API_URL = process.env.REACT_APP_API_URL;
    const request = {
      ...data,
      start_date: format(new Date(data.start_date), "yyyy-MM-dd"),
      end_date: format(new Date(data.end_date), "yyyy-MM-dd"),
    };
    try {
      const response = await dataExport(request).unwrap();
      downloadRef.current.href = API_URL + response;
      downloadRef.current.click();
      toast.success("Data export ready");
      downloadRef.current.href = "empty";
    } catch (error) {
      // we handle errors with middleware
    }
  }

  return (
    <FlexGrid fullWidth className="page">
      <PageHeader
        title="Data export"
        description="Export records for a select timeframe"
        renderIcon={<WatsonHealthDownloadStudy size={42} />}
      />
      <Spacer h={7} />

      <Form onSubmit={handleSubmit(handleDataExport)}>
        <Spacer h={5} />
        <Stack gap={7}>
          <FormGroup legendText="Region">
            {!loadingRegions ? (
              <Dropdown
                id="region"
                titleText=""
                label="Select region"
                items={[
                  {
                    id: "all",
                    name: "all",
                  },
                  ...regions,
                ]}
                itemToString={(item) => item.name}
                invalid={errors.region_id ? true : false}
                invalidText={errors.region_id?.message}
                onChange={(evt) => selectRegion(evt.selectedItem.id)}
              />
            ) : (
              <DropdownSkeleton />
            )}
          </FormGroup>

          <FormGroup legendText="Site">
            {!loadingSites ? (
              <Dropdown
                id="site"
                titleText=""
                label={
                  sites.length && regionId !== "all"
                    ? "Select site"
                    : regionId === "all"
                    ? "Exporting for all sites"
                    : "No available sites"
                }
                items={[
                  {
                    id: "all",
                    name: "all",
                  },
                  ...sites,
                ]}
                itemToString={(item) => item.name}
                invalid={errors.site_id ? true : false}
                invalidText={errors.site_id?.message}
                onChange={(evt) => selectSite(evt.selectedItem.id)}
              />
            ) : (
              <DropdownSkeleton />
            )}
          </FormGroup>

          <Row>
            <Column>
              <DatePicker
                datePickerType="single"
                maxDate={new Date()}
                minDate={sub(new Date(), { months: getExportRange() })}
                onChange={(evt) => {
                  handleSetValue("start_date", evt[0], setValue);
                }}
              >
                <DatePickerInput
                  id="start_date"
                  placeholder="mm/dd/yyyy"
                  labelText="Start date"
                  invalid={errors.start_date ? true : false}
                  invalidText={errors.start_date?.message}
                />
              </DatePicker>
              <Spacer h={7} />
            </Column>
            <Column>
              <DatePicker
                datePickerType="single"
                maxDate={new Date()}
                minDate={sub(new Date(), { months: getExportRange() })}
                onChange={(evt) => {
                  handleSetValue("end_date", evt[0], setValue);
                }}
              >
                <DatePickerInput
                  id="end_date"
                  placeholder="mm/dd/yyyy"
                  labelText="End date"
                  invalid={errors.end_date ? true : false}
                  invalidText={errors.end_date?.message}
                />
              </DatePicker>
              <Spacer h={7} />
            </Column>
          </Row>

          <Dropdown
            id="format"
            titleText="Export format"
            label="Select format"
            items={["csv", "pdf"]}
            itemToString={(item) => item}
            invalid={errors.format ? true : false}
            invalidText={errors.format?.message}
            onChange={(evt) => {
              handleSetValue("format", evt.selectedItem, setValue);
            }}
          />

          {isExporting ? (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="processing ..."
            />
          ) : (
            <Fragment>
              <Button type="submit">Query and download</Button>
              <a
                ref={downloadRef}
                href="empty"
                aria-label="download link"
                download
                hidden
              >
                download
              </a>
            </Fragment>
          )}
        </Stack>
      </Form>
    </FlexGrid>
  );
};

export default DataExport;
