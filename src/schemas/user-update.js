import * as yup from "yup";

export const USER_UPDATE_SCHEMA = yup.object({
  id: yup.number().required("field is required"),
  phone_number: yup.string().required("field is required"),
  name: yup.string().required("field is required"),
  email: yup.string().required("field is required"),
  password: yup.string(),
  occupation: yup.string().required("field is required"),
  site_id: yup.string().required("field is required"),
  region_id: yup.string().required("field is required"),
  state: yup.string().required("field is required"),
  type_of_export: yup.string().required("field is required").default(null),
  type_of_user: yup.string().required("field is required"),
  exportable_range: yup.string().required("field is required"),
});
