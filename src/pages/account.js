import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader, Spacer, TabBar, PhoneNumberInput } from "components";
import {
  Button,
  FormLabel,
  FlexGrid,
  Row,
  Form,
  Column,
  Stack,
  TextInput,
  ModalBody,
  ModalFooter,
  ComposedModal,
  RadioButton,
  RadioButtonGroup,
  UnorderedList,
  PasswordInput,
  ListItem,
  ModalHeader,
  InlineLoading,
  Loading,
} from "@carbon/react";
import { User } from "@carbon/icons-react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authSelector, logout } from "features";
import { useSelector, useDispatch } from "react-redux";
import { ACCOUNT_UPDATE_SCHEMA } from "schemas";
import { useProfile, useDeviceDetection } from "hooks";
import { useUpdateProfileMutation } from "services";

const Account = () => {
  const submitBtnRef = useRef(null);
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const { account, fetchingProfile, reloadProfile } = useProfile(auth.uid);
  const isMobile = useDeviceDetection();
  const [modal, showModal] = useState(false);
  const [modalTwo, showModalTwo] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  function togglePasswordModal() {
    showModal(!modal);
  }

  function toggleAccountModal() {
    showModalTwo(!modalTwo);
  }

  function preLoadForm() {
    const {
      name,
      occupation,
      phone_number,
      sms_notifications,
      sms_notifications_type,
    } = account;
    reset({
      name,
      occupation,
      phone_number,
      sms_notifications,
      sms_notifications_type,
    });
    toggleAccountModal();
  }

  const {
    reset,
    setValue,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ACCOUNT_UPDATE_SCHEMA),
  });

  async function handleUpdate(data) {
    const request = {
      ...data,
      method: modal ? "POST" : "PUT",
    };
    try {
      await updateProfile(request).unwrap();
      if (modal) {
        toast.success("Password updated");
        toast.success("Please login");
        dispatch(logout());
        togglePasswordModal();
      }
      toast.success("Account updated");
      reloadProfile();
      toggleAccountModal();
    } catch (error) {
      // we handle errors with middleware
    }
  }

  if (fetchingProfile) return <Loading />;

  return (
    <FlexGrid fullWidth className="page">
      {isMobile && <TabBar />}
      <PageHeader
        title="Account"
        description="Your account information"
        renderIcon={<User size={42} />}
      />

      <Row>
        <Column>
          <Stack orientation="horizontal" gap={12}>
            <div>
              <FormLabel>ID</FormLabel>
              <p>{account?.id || "N/A"}</p>
            </div>
            <div>
              <FormLabel>Name</FormLabel>
              <p>{account?.name || "N/A"}</p>
            </div>
          </Stack>
          <Spacer h={5} />
          <FormLabel>Role</FormLabel>
          <p>{account?.account_type || "N/A"}</p>
          <Spacer h={5} />
          <FormLabel>Export Type(s)</FormLabel>
          <p>{account?.permitted_export_types.toString() || "N/A"}</p>
          <Spacer h={5} />

          <FormLabel>Occupation</FormLabel>
          <p>{account?.occupation || "N/A"}</p>
          <Spacer h={5} />

          <FormLabel>Email</FormLabel>
          <p>{account?.email || "N/A"}</p>
          <Spacer h={5} />

          <FormLabel>Phone number</FormLabel>
          <p>{account?.phone_number || "N/A"}</p>
          <Spacer h={5} />

          <FormLabel>SMS notifications</FormLabel>
          <p>{account?.sms_notifications + "" || "N/A"}</p>
          <Spacer h={5} />

          <FormLabel>SMS notification type</FormLabel>
          <p>{account?.sms_notifications_type + "" || "N/A"}</p>
          <Spacer h={5} />

          <FormLabel>Sites</FormLabel>
          {account?.users_sites?.map((site, idx) => (
            <UnorderedList key={idx}>
              <ListItem key={site.region.id}>{site.region.name}</ListItem>
              <UnorderedList nested key={site.name}>
                <ListItem key={site.site_code}>{site.name}</ListItem>
              </UnorderedList>
            </UnorderedList>
          ))}
          <Spacer h={5} />
        </Column>
      </Row>

      <Spacer h={5} />

      <Button kind="secondary" onClick={() => togglePasswordModal()}>
        Change password
      </Button>

      <Button type="button" onClick={() => preLoadForm()}>
        Update account
      </Button>

      {modal && (
        <ComposedModal
          size="sm"
          open={modal}
          onRequestClose={() => togglePasswordModal()}
          preventCloseOnClickOutside
        >
          <ModalHeader
            title="Password update"
            buttonOnClick={() => togglePasswordModal()}
          />
          <ModalBody aria-label="create new password">
            <Form onSubmit={handleSubmit(handleUpdate)}>
              <Stack gap={7}>
                <p>Create a new password</p>
                <PasswordInput
                  required
                  id="current_password"
                  labelText="Enter old password"
                  {...register("current_password")}
                  invalid={errors.current_password ? true : false}
                  invalidText={errors.current_password?.message}
                />
                <PasswordInput
                  id="new_password"
                  labelText="Enter new password"
                  {...register("new_password")}
                  invalid={errors.new_password ? true : false}
                  invalidText={errors.new_password?.message}
                />
                <PasswordInput
                  id="confirmPassword"
                  labelText="Confirm new password"
                  {...register("confirmPassword")}
                  invalid={errors.confirmPassword ? true : false}
                  invalidText={errors.confirmPassword?.message}
                />
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
            {!isLoading ? (
              <Button
                type="button"
                onClick={() => submitBtnRef.current.click()}
              >
                Save
              </Button>
            ) : (
              <InlineLoading
                status="active"
                iconDescription="Active loading indicator"
                description="processing ..."
                style={{ justifyContent: "end", paddingRight: "20px" }}
              />
            )}
          </ModalFooter>
        </ComposedModal>
      )}

      {modalTwo && (
        <ComposedModal
          size="sm"
          open={modalTwo}
          onRequestClose={() => toggleAccountModal()}
          preventCloseOnClickOutside
        >
          <ModalHeader
            title="Password update"
            buttonOnClick={() => toggleAccountModal()}
          />

          <ModalBody aria-label="update account information">
            <Form onSubmit={handleSubmit(handleUpdate)}>
              <Stack gap={7}>
                <p>Change account information</p>

                <TextInput
                  id="name"
                  labelText="Name"
                  {...register("name")}
                  invalid={errors.name ? true : false}
                  invalidText={errors.name?.message}
                />

                <PhoneNumberInput
                  control={control}
                  id="phone_number"
                  labelText="Phone number"
                  invalid={errors.phone_number ? true : false}
                  invalidText={errors.phone_number?.message}
                />
                <TextInput
                  id="occupation"
                  labelText="Occupation"
                  {...register("occupation")}
                  invalid={errors.occupation ? true : false}
                  invalidText={errors.occupation?.message}
                />

                <RadioButtonGroup
                  legendText="SMS notification type"
                  name="sms_notifications_type"
                  defaultSelected={account?.sms_notifications_type}
                  onChange={(evt) =>
                    setValue("sms_notifications_type", evt, {
                      shouldValidate: true,
                    })
                  }
                >
                  <RadioButton
                    labelText="Positive"
                    value="positive"
                    id="positive"
                  />
                  <RadioButton labelText="All" value="all" id="all" />
                </RadioButtonGroup>
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
            {!isLoading ? (
              <Button
                type="button"
                onClick={() => submitBtnRef.current.click()}
              >
                Save
              </Button>
            ) : (
              <InlineLoading
                status="active"
                iconDescription="Active loading indicator"
                description="processing ..."
                style={{ justifyContent: "end", paddingRight: "20px" }}
              />
            )}
          </ModalFooter>
        </ComposedModal>
      )}
    </FlexGrid>
  );
};

export default Account;
