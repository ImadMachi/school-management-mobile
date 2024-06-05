import { FontAwesome } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../Styles/ContactScreenStyles/ContactFormScreen.stylex";
import { useContext, useEffect, useState } from "react";
import { sendMessage } from "../../../services/messages";
import { Dropdown } from "react-native-element-dropdown";
import { AuthContext } from "../../../Context/AuthProvider";
import { getStudentsByParent } from "../../../services/students";
import { Parent } from "../../../Constants/userRoles";

const reclamationTemplates = [
  { name: "Template 1", id: 1 },
  { name: "Template 2", id: 2 },
];

export default function ParentForm({
  selectedRecipient,
  setSelectedRecipient,
}) {
  // ** States
  const [error, setError] = useState("");
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [reclamationTemplate, setReclamationTemplate] = useState();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState();

  const { user, isLoading } = useContext(AuthContext);

  const handleContactSubmit = async () => {
    if (reclamationTemplate && selectedChild && selectedRecipient) {
      setError("");
      setButtonSpinner(true);
      if (selectedRecipient.name == "Administration") {
        const subject = reclamationTemplate.name;
        const body = `Réclamation concernant l'enfant ${selectedChild.firstName} ${selectedChild.lastName}`;
        await sendMessage({ body, subject });
      }
      setSelectedRecipient(null);
      setReclamationTemplate(null);
      setSelectedChild(null);
      setButtonSpinner(false);
    } else {
      setError("Veuillez remplir tous les champs requis");
      setButtonSpinner(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (user.role == Parent) {
        const childrenData = await getStudentsByParent(user.userData.id);
        setChildren(childrenData);
      }
    })();
  }, []);

  return (
    <>
      {error && (
        <View style={styles.errorContainer}>
          <FontAwesome name="close" size={18} color={"red"} />
          <Text style={[styles.errorText]}>{error}</Text>
        </View>
      )}
      <View style={{ marginBottom: 16 }}>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={reclamationTemplates}
          maxHeight={300}
          labelField="name"
          valueField="id"
          placeholder={
            <Text style={{ color: "#888" }}>
              Sélectionner le type de réclamation
            </Text>
          }
          value={reclamationTemplate}
          onChange={(item) => {
            setReclamationTemplate(item);
          }}
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={children}
          maxHeight={300}
          labelField="firstName"
          valueField="id"
          placeholder={
            <Text style={{ color: "#888" }}>
              Sélectionner l'enfant concerné
            </Text>
          }
          value={selectedChild}
          onChange={(item) => {
            setSelectedChild(item);
          }}
        />
      </View>

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
