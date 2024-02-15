import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather, Fontisto, Ionicons } from "@expo/vector-icons";
import { styles } from "../../Styles/ContactScreenStyles/SupportContactScreen.styles";
import {
  useFonts,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";

const SupportContact = () => {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { fontFamily: "Raleway_700Bold" }]}>
        Contact de soutien
      </Text>

      <TouchableOpacity style={styles.section}>
        <View style={styles.iconText}>
          <Feather name="phone-call" size={18} color={"#72DE95"} />
          <Text style={[styles.label, { fontFamily: "Nunito_600SemiBold" }]}>
            Téléphone
          </Text>
        </View>
        <Text style={[styles.info, { fontFamily: "Nunito_400Regular" }]}>
          Mobile: (+88) 872-670-780
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <View style={styles.iconText}>
          <Fontisto name="email" size={18} color={"#72DE95"} />
          <Text style={[styles.label, { fontFamily: "Raleway_600SemiBold" }]}>
            Email
          </Text>
        </View>
        <Text style={[styles.info, { fontFamily: "Nunito_400Regular" }]}>
          Info@example.com
        </Text>
        <Text style={[styles.info, { fontFamily: "Nunito_400Regular" }]}>
          Contact@example.com
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SupportContact;
