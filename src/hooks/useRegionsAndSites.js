import { useState } from "react";
import PropTypes from "prop-types";
import { useGetRegionsQuery, useGetSitesQuery } from "services";

// setValue is passed in from react-hook-form declaration

export const useRegionsAndSites = (setValue) => {
  const [regionId, setRegionId] = useState(null);
  const { data: regions = [], isFetching: loadingRegions } = useGetRegionsQuery(
    null,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: sites = [], isFetching: loadingSites } = useGetSitesQuery(
    regionId,
    {
      skip: !regionId || regionId === "all" ? true : false,
      refetchOnMountOrArgChange: true,
    }
  );
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

  return {
    regionId,
    regions,
    sites,
    loadingRegions,
    loadingSites,
    setRegionId,
    selectRegion,
    selectSite,
  };
};

useRegionsAndSites.propTypes = {
  setValue: PropTypes.func.isRequired,
};
