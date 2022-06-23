import PropTypes from "prop-types";
import { useGetProfileQuery } from "services";

export const useProfile = (id) => {
  const {
    data: account = {},
    isFetching: fetchingProfile,
    refetch,
  } = useGetProfileQuery(id, {
    skip: !id ? true : false,
    refetchOnMountOrArgChange: true,
  });

  return {
    account,
    fetchingProfile,
    reloadProfile: refetch,
  };
};

useProfile.propTypes = {
  id: PropTypes.number.isRequired,
};
