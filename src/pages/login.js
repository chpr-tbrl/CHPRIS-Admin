import React from "react";
import {
  Grid,
  Form,
  Stack,
  Column,
  Button,
  TextInput,
  PasswordInput,
  InlineLoading,
} from "@carbon/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LOGIN_SCHEMA } from "schemas";
import { useLoginMutation } from "services";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LOGIN_SCHEMA),
  });

  async function handleLogin(data) {
    try {
      await login(data).unwrap();
      toast.success("login successful");
      navigate("/dashboard");
    } catch (error) {
      // we handle errors with middleware
    }
  }

  return (
    <Grid fullWidth>
      <Column sm={0} md={4} lg={8} className="page--article">
        <div className="page--article__content">
          <h2>Lorem ipsum</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis
            debitis voluptate voluptatum, exercitationem reiciendis dolores
            voluptatibus, tempora amet delectus magnam accusantium quibusdam
            temporibus. Iste nisi nihil cum consequatur delectus eius?
          </p>
        </div>
      </Column>
      <Column sm={4} md={4} lg={8} className="page--form">
        <Stack gap={7}>
          <h1>
            Login to CHPRIS <span className="cds--type-semibold">Admin</span>
          </h1>
          <Form onSubmit={handleSubmit(handleLogin)}>
            <Stack gap={7}>
              <TextInput
                id="email"
                labelText="Email"
                type="email"
                {...register("email")}
                invalid={errors.email ? true : false}
                invalidText={errors.email?.message}
              />
              <PasswordInput
                id="password"
                labelText="Password"
                {...register("password")}
                invalid={errors.password ? true : false}
                invalidText={errors.password?.message}
              />

              {!isLoading ? (
                <Button type="submit">Continue</Button>
              ) : (
                <InlineLoading
                  status="active"
                  iconDescription="Active loading indicator"
                  description="Loading data..."
                />
              )}
            </Stack>
          </Form>
        </Stack>
      </Column>
    </Grid>
  );
};

export default Login;
