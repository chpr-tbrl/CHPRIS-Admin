// utilities for transforming data
import { ROLES } from "schemas";

export function formatUTCDate(date) {
  return new Date(date).toLocaleString();
}

export function getExportRangeInMonths(range) {
  if (range === null) {
    return "N/A";
  }
  return range > 1 ? range + " months" : range + " month";
}

export function getRegionName(id, regions) {
  const region = regions.find((region) => region.id === id);
  return region ? region.name : "N/A";
}

export function getSiteName(id, sites) {
  const site = sites.find((site) => site.id === id);
  return site ? site.name : "N/A";
}

export function getUserType(id) {
  const role = ROLES.find((role) => role.id === id);
  return role ? role.name : "N/A";
}

export function getExportTypes(types) {
  return types.length ? types.toString() : "N/A";
}

export function findItemIndex(id, items) {
  let index;
  if (typeof id === "string") {
    index = items.findIndex((item) => item === id);
    if (index !== -1) return [...items[index]];
  }
  index = items.findIndex((item) => item.id === id);
  if (index !== -1) return items[index];
}
