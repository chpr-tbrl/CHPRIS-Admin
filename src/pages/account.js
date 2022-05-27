import React from "react";
import { PageHeader, Spacer } from "components";
import {
  Button,
  FormLabel,
  FlexGrid,
  Row,
  Column,
  Stack,
  Loading,
} from "@carbon/react";
import { User } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import {
  useGetProfileQuery,
  useGetRegionsQuery,
  useGetSitesQuery,
} from "services";
import { authSelector } from "features";
import { useSelector } from "react-redux";

const Account = () => {
  const navigate = useNavigate();
  const auth = useSelector(authSelector);
  const { data: user = {}, isLoading } = useGetProfileQuery(auth.uid);
  const { data: regions, isFulfilled } = useGetRegionsQuery();
  const { data: sites } = useGetSitesQuery(user.region_id, {
    skip: !isFulfilled,
  });

  const getRegion = () => {
    let region = regions?.find((region) => region.id === user.region_id);
    return region ? region.name : "N/A";
  };

  const getSite = () => {
    let site = sites?.find((site) => site.id === user.site_id);
    return site ? site.name : "N/A";
  };

  if (isLoading) return <Loading />;

  return (
    <FlexGrid fullWidth className="page">
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
              <p>{user?.id || "N/A"}</p>
            </div>
            <div>
              <FormLabel>Name</FormLabel>
              <p>{user?.name || "N/A"}</p>
            </div>
          </Stack>
          <Spacer h={5} />
          <FormLabel>Role</FormLabel>
          <p>{user.type_of_user || "N/A"}</p>
          <Spacer h={5} />
          <FormLabel>Export Type(s)</FormLabel>
          <p>{user.type_of_export || "N/A"}</p>
          <Spacer h={5} />

          <FormLabel>Occupation</FormLabel>
          <p>{user.occupation || "N/A"}</p>
          <Spacer h={5} />

          <FormLabel>Email</FormLabel>
          <p>{user.email || "N/A"}</p>
          <Spacer h={5} />

          <FormLabel>Phone number</FormLabel>
          <p>{user.phone_number || "N/A"}</p>
          <Spacer h={5} />
          <Stack orientation="horizontal" gap={12}>
            <div>
              <FormLabel>region</FormLabel>
              <p>{getRegion()}</p>
            </div>
            <div>
              <FormLabel>Site</FormLabel>
              <p>{getSite()}</p>
            </div>
          </Stack>
          <Spacer h={5} />
        </Column>
      </Row>

      <Spacer h={5} />
      <Button kind="secondary" onClick={() => navigate(-1)}>
        Back
      </Button>
    </FlexGrid>
  );
};

export default Account;
