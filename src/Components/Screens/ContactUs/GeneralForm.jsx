import { FontAwesome } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../Styles/ContactScreenStyles/ContactFormScreen.stylex";
import { useState } from "react";
import { useFonts } from "@expo-google-fonts/nunito";
import {
  contactGroupAdministrator,
  sendMessage,
} from "../../../services/messages";

export default function GeneralForm({
  selectedRecipient,
  setSelectedRecipient,
}) {
  // ** States
  const [contactInfo, setContactInfo] = useState({
    subject: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [buttonSpinner, setButtonSpinner] = useState(false);

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

  return (
    <>
      {error && (
        <View style={styles.errorContainer}>
          <FontAwesome name="close" size={18} color={"red"} />
          <Text style={[styles.errorText]}>{error}</Text>
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
          <Text style={[styles.submitButtonText]}>Envoyer</Text>
        )}
      </TouchableOpacity>
    </>
  );
}
