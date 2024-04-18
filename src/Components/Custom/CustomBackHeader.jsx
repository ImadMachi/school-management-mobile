import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { styles } from "../Styles/CustomHeaderStyles/CustomBackHeader.styles";

const CustomBackHeader = ({ children, to }) => {
  const navigation = useNavigation();

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleNavigate = () => {
    if (to) {
      navigation.navigate(to);
    } else navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIconWrapper} onPress={handleNavigate}>
        <AntDesign name="left" size={24} color={"black"} />
      </TouchableOpacity>
      <Text style={[styles.text, { fontFamily: "Raleway_700Bold" }]}>
        {children}
      </Text>
      <TouchableOpacity style={styles.backIconWrapper}></TouchableOpacity>
    </View>
  );
};

export default CustomBackHeader;
