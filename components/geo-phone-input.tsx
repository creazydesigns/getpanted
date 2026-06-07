"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ComponentType,
  type ElementType,
} from "react";
import PhoneInput, {
  type Country,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";

const COUNTRY_LABELS = Object.fromEntries(
  getCountries().map((country) => {
    const name = en[country as keyof typeof en] ?? country;
    return [country, `${name} (+${getCountryCallingCode(country)})`];
  })
);

type CountrySelectOption = {
  value?: Country;
  label: string;
  divider?: boolean;
};

type WaitlistCountrySelectProps = {
  value?: Country;
  onChange: (value?: Country) => void;
  options: CountrySelectOption[];
  disabled?: boolean;
  readOnly?: boolean;
  iconComponent: ElementType<{
    country?: Country;
    label?: string;
    "aria-hidden"?: boolean;
  }>;
};

function WaitlistCountrySelect({
  value,
  onChange,
  options,
  disabled,
  readOnly,
  iconComponent: Icon,
}: WaitlistCountrySelectProps) {
  const onChangeSelect = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const next = event.target.value;
      onChange(next === "ZZ" ? undefined : (next as Country));
    },
    [onChange]
  );

  const selectedOption = useMemo(
    () => options.find((option) => !option.divider && option.value === value),
    [options, value]
  );

  const callingCode = value
    ? getCountryCallingCode(value)
    : getCountryCallingCode("NG");

  return (
    <div className="PhoneInputCountry waitlist-phone-country">
      <select
        disabled={disabled || readOnly}
        value={value || "ZZ"}
        onChange={onChangeSelect}
        className="PhoneInputCountrySelect"
        aria-label="Country"
      >
        {options.map((option) => (
          <option
            key={option.divider ? "|" : option.value || "ZZ"}
            value={option.divider ? "|" : option.value || "ZZ"}
            disabled={option.divider}
          >
            {option.label}
          </option>
        ))}
      </select>
      {value && selectedOption && (
        <Icon aria-hidden country={value} label={selectedOption.label} />
      )}
      <span className="waitlist-phone-dial" aria-hidden="true">
        +{callingCode}
      </span>
      <div className="PhoneInputCountrySelectArrow" />
    </div>
  );
}

type GeoPhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
  placeholder?: string;
};

export function GeoPhoneInput({
  value,
  onChange,
  className,
  id,
  placeholder = "WhatsApp Number",
}: GeoPhoneInputProps) {
  const [defaultCountry, setDefaultCountry] = useState<Country>("NG");
  const [country, setCountry] = useState<Country>("NG");
  const [geoReady, setGeoReady] = useState(false);

  useEffect(() => {
    fetch("/api/geo")
      .then((r) => r.json())
      .then((d: { country?: string }) => {
        const code = d.country?.toUpperCase();
        if (code?.length === 2) {
          setDefaultCountry(code as Country);
          setCountry(code as Country);
        }
      })
      .finally(() => setGeoReady(true));
  }, []);

  return (
    <PhoneInput
      key={geoReady ? defaultCountry : "init"}
      id={id}
      international={false}
      country={country}
      defaultCountry={defaultCountry}
      onCountryChange={(c) => {
        if (c) setCountry(c);
      }}
      countryCallingCodeEditable={false}
      countrySelectComponent={
        WaitlistCountrySelect as ComponentType<Record<string, unknown>>
      }
      labels={COUNTRY_LABELS}
      placeholder={placeholder}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      className={className}
    />
  );
}

export { isValidPhoneNumber };
