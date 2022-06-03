import React, { useState, useRef } from "react";
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
import {
  useGetRegionsQuery,
  useGetSitesQuery,
  useDataExportMutation,
} from "services";
import toast from "react-hot-toast";
import { sub, format } from "date-fns";
import { useSelector } from "react-redux";
import { authSelector } from "features";

const DataExport = () => {
  const btnRef = useRef(null);
  const auth = useSelector(authSelector);
  const [regionId, setRegionId] = useState(null);
  const [download, setDownload] = useState("");

  const { data: regions = [], isLoading: loadingRegions } =
    useGetRegionsQuery();

  const { data: sites = [], isLoading: loadingSites } = useGetSitesQuery(
    regionId,
    {
      skip: !regionId || regionId === "all" ? true : false,
      refetchOnMountOrArgChange: true,
    }
  );

  const [dataExport, { isLoading: isExporting }] = useDataExportMutation();

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(DATA_EXPORT_SCHEMA),
  });

  function selectRegion(id) {
    setRegionId(id);
    setValue("region_id", id, {
      shouldValidate: true,
    });
    if (id === "all") selectSite(id);
  }

  function selectSite(id) {
    setValue("site_id", id, {
      shouldValidate: true,
    });
  }

  function selectFormat(format) {
    setValue("format", format, {
      shouldValidate: true,
    });
  }

  function setStartDate(date) {
    setValue("start_date", date[0], {
      shouldValidate: true,
    });
  }
  function setEndDate(date) {
    setValue("end_date", date[0], {
      shouldValidate: true,
    });
  }

  async function handleDataExport(data) {
    const API_URL = process.env.REACT_APP_API_URL;
    const request = {
      ...auth,
      ...data,
      start_date: format(new Date(data.start_date), "yyyy-MM-dd"),
      end_date: format(new Date(data.end_date), "yyyy-MM-dd"),
    };
    try {
      const response = await dataExport(request).unwrap();
      setDownload(API_URL + response);
      btnRef.current.click();
      toast.success("Data export ready, please download");
    } catch (error) {
      // we handle errors with middleware
    }
  }

  return (
    <FlexGrid fullWidth className="page">
      <PageHeader
        title="Data Export"
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
                minDate={sub(new Date(), { months: 5 })}
                onChange={(evt) => setStartDate(evt)}
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
                minDate={sub(new Date(), { months: 5 })}
                onChange={(evt) => setEndDate(evt)}
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
            onChange={(evt) => selectFormat(evt.selectedItem)}
          />

          {isExporting ? (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="processing ..."
            />
          ) : (
            <Button ref={btnRef} href={download} type="submit">
              Query and download
            </Button>
          )}
        </Stack>
      </Form>
    </FlexGrid>
  );
};

export default DataExport;
