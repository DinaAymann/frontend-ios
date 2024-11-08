import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const Checkbox = ({
  onPress,
  isChecked,
  containerStyle,
  checkboxStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.checkbox,
          isChecked && styles.checkboxSelected,
          checkboxStyle,
        ]}
      >
        {isChecked && (
          <Entypo name="check" size={18} color="purple" /> 
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  checkbox: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    height: 20,
    width: 20, 
  },
});

export default Checkbox;
