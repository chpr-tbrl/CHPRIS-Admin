// helper utils

// use to register custom fields with react-hook-form
export function handleSetValue(key, value, cb) {
  cb(key, value, {
    shouldValidate: true,
  });
}
