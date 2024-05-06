import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { styles } from "../../Styles/ContactScreenStyles/ContactFormScreen.stylex";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular } from "@expo-google-fonts/nunito";
import { ActivityIndicator } from "react-native-paper";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { sendMessage } from "../../../services/messages";
import { format, set } from "date-fns";
import { AuthContext } from "../../../Context/AuthProvider";
import { declareAbsence } from "../../../services/absence";

const ContactForm = () => {
  const [formInfo, setFormInfo] = useState({
    startDate: new Date(),
    endDate: new Date(),
    reason: "",
  });
  const [error, setError] = useState("");
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const { user } = useContext(AuthContext);

  const handleContactSubmit = async () => {
    const payload = {
      startDate: formInfo.startDate.toLocaleString(),
      endDate: formInfo.endDate.toLocaleString(),
      reason: formInfo.reason,
      absentUser: {
        id: user.id,
      },
    };

    if (payload.reason) {
      setError("");
      setButtonSpinner(true);
      await declareAbsence(payload);
      setFormInfo({ ...formInfo, reason: "" });
      setButtonSpinner(false);
    } else {
      setError("Veuillez remplir tous les champs requis");
      setButtonSpinner(false);
    }
  };

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const showStartMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: formInfo.startDate,
      onChange: (_, startDate) => {
        setFormInfo({ ...formInfo, startDate });
      },
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showEndMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: formInfo.endDate,
      onChange: (_, endDate) => {
        setFormInfo({ ...formInfo, endDate });
      },
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showStartDatepicker = () => {
    showStartMode("date");
  };

  const showEndDatepicker = () => {
    showEndMode("date");
  };

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <FontAwesome name="close" size={18} color={"red"} />
          <Text style={[styles.errorText, { fontFamily: "Nunito_400Regula" }]}>
            {error}
          </Text>
        </View>
      )}
      <Text style={{ color: "gray", marginBottom: 5 }}>Date de début: </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <TextInput
          placeholder={format(new Date(), "dd/MM/yyyy")}
          style={[styles.input, { marginVertical: 5, marginRight: 2 }]}
          value={format(formInfo.startDate, "dd/MM/yyyy")}
          onFocus={showStartDatepicker}
        />
      </View>
      <Text style={{ color: "gray", marginBottom: 5 }}>Date de fin: </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <TextInput
          placeholder={format(new Date(), "dd/MM/yyyy")}
          style={[styles.input, { marginVertical: 5, marginRight: 2 }]}
          value={format(formInfo.endDate, "dd/MM/yyyy")}
          onFocus={showEndDatepicker}
        />
      </View>
      <TextInput
        style={styles.textArea}
        placeholder="Raison de l'absence"
        placeholderTextColor="#888"
        multiline={true}
        numberOfLines={4}
        fontSize={16}
        value={formInfo.reason}
        onChangeText={(value) => setFormInfo({ ...formInfo, reason: value })}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleContactSubmit}
      >
        {buttonSpinner ? (
          <ActivityIndicator size={"small"} color={"white"} />
        ) : (
          <Text
            style={[styles.submitButtonText, { fontFamily: "Raleway_700Bold" }]}
          >
            Envoyer
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ContactForm;
