import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../../Styles/ContactScreenStyles/ContactFormScreen.stylex";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular } from "@expo-google-fonts/nunito";
import { ActivityIndicator } from "react-native-paper";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { getUsers } from "../../../services/users";
import { sendMail } from "../../../services/messages";
import { getCategories } from "../../../services/categories";

const ContactForm = () => {
  // ** States
  const [contactInfo, setContactInfo] = useState({
    subject: "",
    message: "",
    selectedUsers: [],
    selectedCategory: undefined,
  });
  const [error, setError] = useState("");
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  // ** Effects
  useEffect(() => {
    (async () => {
      const data = await getUsers();
      data.forEach((user) => {
        user.fullname = `${user.userData.firstName} ${user.userData.lastName}`;
      });
      setUsers(data);

      const categoryData = await getCategories();
      setCategories(categoryData);
    })();
  }, []);

  // ** Functions
  const handleContactSubmit = async () => {
    const message = contactInfo.message;
    const subject = contactInfo.subject;
    const recipients = contactInfo.selectedUsers.map((i) => ({ id: i }));
    const categoryId = contactInfo.selectedCategory.id;

    if (subject && message && recipients.length > 0 && categoryId) {
      setError("");
      setButtonSpinner(true);
      await sendMail({
        body: message,
        subject,
        recipients,
        categoryId,
      });
      setContactInfo({
        ...contactInfo,
        subject: "",
        message: "",
        selectedUsers: [],
        selectedCategory: undefined,
      });
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
      {error && (
        <View style={styles.errorContainer}>
          <FontAwesome name="close" size={18} color={"red"} />
          <Text style={[styles.errorText, { fontFamily: "Nunito_400Regula" }]}>
            {error}
          </Text>
        </View>
      )}

      <View style={{ marginBottom: 16 }}>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          search
          data={users}
          labelField="fullname"
          valueField="id"
          placeholder={
            <Text style={{ color: "#888" }}>
              Sélectionner les destinataires
            </Text>
          }
          searchPlaceholder="Rechercher"
          value={contactInfo.selectedUsers}
          onChange={(item) => {
            setContactInfo({ ...contactInfo, selectedUsers: item });
          }}
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={categories}
          search
          maxHeight={300}
          labelField="name"
          valueField="id"
          placeholder={
            <Text style={{ color: "#888" }}>Sélectionner la catégorie</Text>
          }
          searchPlaceholder="Rechercher"
          value={contactInfo.selectedCategory}
          onChange={(item) => {
            setContactInfo({ ...contactInfo, selectedCategory: item });
          }}
        />
      </View>

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
