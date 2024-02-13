import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../../Styles/ContactScreenStyles/ContactFormScreen.stylex";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular } from "@expo-google-fonts/nunito";
import { getAdministratorUsers } from "../../../services/users";
import { Administrator } from "../../../Constants/userRoles";
import { ActivityIndicator } from "react-native-paper";
import { sendMessage } from "../../../services/messages";

const ContactForm = () => {
  const [contactInfo, setContactInfo] = useState({
    subject: "",
    message: "",
    recipient: "option1",
  });
  const [error, setError] = useState("");
  const [administratorsList, setAdministratorsList] = useState([]);
  const [buttonSpinner, setButtonSpinner] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getAdministratorUsers(Administrator);
      if (data) {
        setAdministratorsList(data);
        setContactInfo({ ...contactInfo, recipient: data[0].id });
      }
    })();
  }, []);

  const handleContactSubmit = async () => {
    const message = contactInfo.message;
    const subject = contactInfo.subject;
    const recipient = contactInfo.recipient;

    if (subject && message && recipient) {
      setError("");
      setButtonSpinner(true);
      await sendMessage({ message, subject, recipient });
      setContactInfo({ ...contactInfo, subject: "", message: "" });
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

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontFamily: "Raleway_700Bold" }]}>
        Contactez l'administration
      </Text>

      {error && (
        <View style={styles.errorContainer}>
          <FontAwesome name="close" size={18} color={"red"} />
          <Text style={[styles.errorText, { fontFamily: "Nunito_400Regula" }]}>
            {error}
          </Text>
        </View>
      )}

      <View style={styles.inputContainer}></View>

      <Picker
        selectedValue={contactInfo.recipient}
        onValueChange={(value, index) =>
          setContactInfo({ ...contactInfo, recipient: value })
        }
        style={styles.recipientPicker}
      >
        {administratorsList.map((administratorUser) => (
          <Picker.Item
            key={administratorUser.id}
            label={`${administratorUser?.administrator?.firstName} ${administratorUser?.administrator?.lastName}`}
            value={administratorUser.id}
          />
        ))}
      </Picker>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Objet"
          placeholderTextColor="#888"
          value={contactInfo.subject}
          onChangeText={(value) =>
            setContactInfo({ ...contactInfo, subject: value })
          }
        />
      </View>
      <TextInput
        style={styles.textArea}
        placeholder="Message"
        placeholderTextColor="#888"
        multiline={true}
        numberOfLines={4}
        fontSize={16}
        value={contactInfo.message}
        onChangeText={(value) =>
          setContactInfo({ ...contactInfo, message: value })
        }
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
