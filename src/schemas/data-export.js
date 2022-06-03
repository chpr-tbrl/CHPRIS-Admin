import * as yup from "yup";

export const DATA_EXPORT_SCHEMA = yup.object({
  region_id: yup.string().required("field is required"),
  site_id: yup.string().required("field is required"),
  start_date: yup.date().required("Field is required"),
  end_date: yup.date().required("Field is required"),
  format: yup.string().required("field is required")
});
