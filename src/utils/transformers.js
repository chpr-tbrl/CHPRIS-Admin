// utilities for transforming data

export function formatUTCDate(date) {
  return new Date(date).toLocaleString();
}

export function getExportableRangeInMonths(range) {
  if (range === null) {
    return "N/A";
  }
  return range > 1 ? range + " months" : range + " month";
}

export function getRegionName(id, regions) {
  return regions[id]?.name ? regions[id]?.name : "N/A";
}
export function getSiteName(id, sites) {
  return sites[id]?.name ? sites[id]?.name : "N/A";
}
