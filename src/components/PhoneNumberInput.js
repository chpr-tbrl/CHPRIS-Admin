import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { TextInput, FormLabel, FormGroup } from "@carbon/react";
import { useController } from "react-hook-form";

export const PhoneNumberInput = ({ control, id, labelText, ...rest }) => {
  const {
    field: { onChange, onBlur, value, ref },
  } = useController({
    name: id,
    control,
    rules: { required: true },
    defaultValue: "",
  });

  return (
    <FormGroup legendText="">
      <FormLabel htmlFor={id}>{labelText}</FormLabel>
      <PhoneInput
        ref={ref}
        flags={flags}
        international
        inputComponent={TextInput}
        countryCallingCodeEditable={false}
        placeholder="65xxxxxxxx"
        defaultCountry="CM"
        value={value}
        name={id}
        id={id}
        onChange={onChange}
        onBlur={onBlur}
        labelText=""
        {...rest}
      />
    </FormGroup>
  );
};
