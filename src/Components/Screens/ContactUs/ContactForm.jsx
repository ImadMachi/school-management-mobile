import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../../Styles/ContactScreenStyles/ContactFormScreen.stylex";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular } from "@expo-google-fonts/nunito";
import { ActivityIndicator } from "react-native-paper";
import {
  contactGroupAdministrator,
  sendMessage,
} from "../../../services/messages";
import { Dropdown } from "react-native-element-dropdown";
import { AuthContext } from "../../../Context/AuthProvider";
import { getGroupsByUser } from "../../../services/groups";

const ContactForm = () => {
  // ** Context
  const { user, isLoading } = useContext(AuthContext);

  // ** States
  const [contactInfo, setContactInfo] = useState({
    subject: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState();

  const handleContactSubmit = async () => {
    const message = contactInfo.message;
    const subject = contactInfo.subject;

    if (subject && message && selectedRecipient) {
      setError("");
      setButtonSpinner(true);
      if (selectedRecipient.name == "Administration") {
        await sendMessage({ body: message, subject });
      } else {
        await contactGroupAdministrator({
          body: message,
          subject,
          groupId: selectedRecipient.id,
        });
      }
      setContactInfo({ ...contactInfo, subject: "", message: "" });
      setSelectedRecipient(null);
      setButtonSpinner(false);
    } else {
      setError("Veuillez remplir tous les champs requis");
      setButtonSpinner(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (user) {
        const groups = await getGroupsByUser(user.id);
        if (groups) {
          setGroups(groups);
        }
      }
    })();
  }, [user]);

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 16 }}>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={[{ name: "Administration", id: 1 }, ...groups]}
          maxHeight={300}
          labelField="name"
          valueField="id"
          placeholder={
            <Text style={{ color: "#888" }}>Sélectionner le destinataire</Text>
          }
          value={selectedRecipient}
          onChange={(item) => {
            setSelectedRecipient(item);
          }}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <FontAwesome name="close" size={18} color={"red"} />
          <Text style={[styles.errorText, { fontFamily: "Nunito_400Regula" }]}>
            {error}
          </Text>
        </View>
      )}

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
