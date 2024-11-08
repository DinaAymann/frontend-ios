import React, { useState , useEffect} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { AsYouType, getExampleNumber } from "libphonenumber-js";
import countries from "../constants/countries.json";
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
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [maxLen, setMaxLen] = useState(10);
  const [isPhoneInputFocused, setIsPhoneInputFocused] = useState(false);
  const [isCountryPickerActive, setIsCountryPickerActive] = useState(false);
  const { t } = useTranslation();
  const placeholderText = t("placeholder.title");

  const translatedCountries = countries.map((country, index) => ({
    ...country,
    translatedName: t(`countries.list.${index}.name`),
  }));

  const handleSelectCountry = (item) => {
    setSelectedCountry(item);
    setCallingCode(item.dial_code);
    setPhoneNumber("");
    setDropdownVisible(false);
    setIsCountryPickerActive(false);

    const exampleNumber = getExampleNumber(item.code);
    if (exampleNumber) {
      setMaxLen(exampleNumber.number.replace(/\D/g, "").length);
    } else {
      setMaxLen(10);
    }
  };
  useEffect(() => {
    if (!dropdownVisible) {
      setIsCountryPickerActive(false);
    }
  }, [dropdownVisible]);
  const handlePhoneNumberChange = (input) => {
    if (!selectedCountry) return;
    
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
    const newDropdownState = !dropdownVisible;
    setDropdownVisible(newDropdownState);
    setIsCountryPickerActive(newDropdownState);
  };

  const closeDropdownOnFocus = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
      setIsCountryPickerActive(false);
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

  const getCountryDisplayText = () => {
    if (!selectedCountry) {
      return "Select country";
    }
    return `${selectedCountry.flag} ${selectedCountry.translatedName}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity 
          style={[
            styles.countryPickerRow,
            isCountryPickerActive && styles.activeBorder
          ]} 
          onPress={toggleDropdown}
        >
          <Text style={styles.dropdownArrow}>▼</Text>
          <Typography
            text={getCountryDisplayText()}
            style={styles.selectedCountryText}
          />
        </TouchableOpacity>

        <View style={styles.phoneInputRow}>
          <View style={[
            styles.phoneInputContainer,
            isPhoneInputFocused && styles.activeBorder
          ]}>
            <TextInput
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              onFocus={() => {
                setIsPhoneInputFocused(true);
                closeDropdownOnFocus();
              }}
              onBlur={() => setIsPhoneInputFocused(false)}
              style={styles.phoneInput}
              placeholder={selectedCountry ? placeholderText : "Select country first"}
              keyboardType="phone-pad"
              maxLength={maxLen + (selectedCountry?.needsLeadingZero ? 1 : 0)}
              editable={!!selectedCountry}
            />
          </View>
          <View style={[
            styles.dialCodeContainer,
            isPhoneInputFocused && styles.activeBorder
          ]}>
            <Typography
              text={selectedCountry ? selectedCountry.dial_code : "-"}
              style={styles.dialCodeText}
            />
          </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    width: '80%',
  },
  countryPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    borderWidth: 1,
    borderColor: '#00000099',
    borderRadius: 10,
    marginBottom: 20,
  },
  activeBorder: {
    borderWidth: 3,
    borderColor: '#00000090', 
  },
  dropdownArrow: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  selectedCountryText: {
    fontSize: 18,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, 
  },
  dialCodeContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#00000099',
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  dialCodeText: {
    fontSize: 18,
    color: colors.darkGrey,
  },
  phoneInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#00000099',
    borderRadius: 10,    
  },
  phoneInput: {
    padding: 15,
    fontSize: 18,
  },
  flatList: {
    position: 'absolute',
    top: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    backgroundColor: 'white',
    zIndex: 1000,
    maxHeight: 200,
  },
  countryItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  countryText: {
    fontSize: 16,
  },
});

export default CountryPicker;