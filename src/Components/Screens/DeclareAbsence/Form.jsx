import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { styles } from "../../Styles/ContactScreenStyles/ContactFormScreen.stylex";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular } from "@expo-google-fonts/nunito";
import { ActivityIndicator } from "react-native-paper";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { sendMessage } from "../../../services/messages";
import { set } from "date-fns";

const ContactForm = () => {
  const [formInfo, setFormInfo] = useState({
    datedebut: new Date(),
    datefin: new Date(),
    reason: "",
  });
  const [error, setError] = useState("");
  const [buttonSpinner, setButtonSpinner] = useState(false);

  const handleContactSubmit = async () => {
    const message = formInfo.reason;

    if (message) {
      setError("");
      setButtonSpinner(true);
      await sendMessage({ body: message });
      setFormInfo({ ...formInfo, message: "" });
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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setFormInfo({ ...formInfo, datedebut: currentDate });
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: formInfo.datedebut,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
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
      <Text style={{ color: "gray", marginBottom: 5 }}>Date de début:</Text>
      <View style={{ display: "flex", flexDirection: "row" }}>
        {/* <Button onPress={showTimepicker} title="Show time picker!" /> */}
        <TextInput
          style={[styles.input, { marginVertical: 5, marginRight: 2 }]}
          value={formInfo.datedebut}
        />
        <TextInput
          placeholder={`${formInfo.datedebut}`}
          style={[styles.input, { marginVertical: 5, marginLeft: 2 }]}
          value={formInfo.datedebut}
        />
      </View>
      <TextInput
        style={styles.textArea}
        placeholder="Message"
        placeholderTextColor="#888"
        multiline={true}
        numberOfLines={4}
        fontSize={16}
        value={formInfo.reason}
        onChangeText={(value) => setFormInfo({ ...formInfo, message: value })}
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
