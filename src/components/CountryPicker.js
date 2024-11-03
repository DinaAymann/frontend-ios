import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { AsYouType, getExampleNumber } from "libphonenumber-js";
import countries from "../constants/countries.json"; // This is where data comes from
import { useTranslation } from "react-i18next";
import colors from "../styles/colors";
import Typography from "./Typography";

const CountryPicker = ({
  phoneNumber,
  setPhoneNumber,
  setCallingCode,
  dropdownVisible,
  setDropdownVisible,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [maxLen, setMaxLen] = useState(10);
  const { t } = useTranslation();
  const placeholderText = t("placeholder.title");

  // Preprocess the country names and store them in an array
  const translatedCountries = countries.map((country, index) => ({
    ...country,
    translatedName: t(`countries.list.${index}.name`),
  }));

  const handleSelectCountry = (item) => {
    setSelectedCountry(item);
    setCallingCode(item.dial_code);
    setPhoneNumber("");
    setDropdownVisible(false);

    const exampleNumber = getExampleNumber(item.code);
    if (exampleNumber) {
      setMaxLen(exampleNumber.number.replace(/\D/g, "").length);
    } else {
      setMaxLen(10);
    }
  };

  const handlePhoneNumberChange = (input) => {
    if (input.replace(/\D/g, "").length <= maxLen) {
      let formattedInput = input;

      const needsZero = selectedCountry.needsLeadingZero;
      if (needsZero && !input.startsWith("0") && input.length > 0) {
        formattedInput = "0" + input;
      }

      const formatter = new AsYouType(selectedCountry.code);
      let formattedPhoneNumber = formatter.input(formattedInput);

      if (needsZero && !input.startsWith("0")) {
        formattedPhoneNumber = formattedPhoneNumber.slice(1);
      }

      setPhoneNumber(formattedPhoneNumber);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdownOnFocus = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleSelectCountry(item)}
    >
      <Text style={styles.countryText}>
        {`${item.flag} ${item.translatedName} (${item.dial_code})`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.column}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.countryPicker} onPress={toggleDropdown}>
          <Typography
            text={`${selectedCountry.flag} ${selectedCountry.dial_code}`}
            style={styles.selectedCountryText}
          />
        </TouchableOpacity>

        <TextInput
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          onFocus={closeDropdownOnFocus}
          style={styles.phoneInput}
          placeholder={placeholderText}
          keyboardType="phone-pad"
          maxLength={maxLen + (selectedCountry.needsLeadingZero ? 1 : 0)}
        />
      </View>

      {dropdownVisible && (
        <FlatList
          data={translatedCountries}
          keyExtractor={(item) => item.code}
          renderItem={renderCountryItem}
          style={styles.flatList}
        />
      )}
    </View>
  );
};

export default CountryPicker;

const styles = StyleSheet.create({
  column: {
    flex: 1,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.darkGrey,
    borderRadius: 5,
    padding: 15,
  },
  countryPicker: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: colors.lightGrey,
    marginRight: 10,
  },
  selectedCountryText: {
    fontSize: 20,
  },
  flatList: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 5,
  },
  countryItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    height: 50,
  },
  phoneInput: {
    width: "100%",
    fontSize: 20,
  },
});
