import * as yup from "yup";

export const LOGIN_SCHEMA = yup.object({
  email: yup.string().email().required("please enter your email"),
  password: yup.string().required("please enter your password"),
});
