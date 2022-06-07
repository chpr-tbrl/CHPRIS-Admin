import * as yup from "yup";

export const USER_UPDATE_SCHEMA = yup.object({
  id: yup.number().required("field is required"),
  phone_number: yup.string().required("field is required"),
  name: yup.string().required("field is required"),
  email: yup.string().required("field is required"),
  password: yup.string(),
  occupation: yup.string().required("field is required"),
  account_type: yup.string().required("field is required"),
  account_status: yup
    .string()
    .oneOf(["pending", "approved", "suspended"])
    .required("field is required"),
  permitted_export_range: yup.number().required("field is required"),
  permitted_export_types: yup.array().ensure().compact(),
});
