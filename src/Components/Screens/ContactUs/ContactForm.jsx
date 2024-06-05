import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { styles } from "../../Styles/ContactScreenStyles/ContactFormScreen.stylex";

import { Dropdown } from "react-native-element-dropdown";
import { getGroupsByUser } from "../../../services/groups";
import GeneralForm from "./GeneralForm";
import { AuthContext } from "../../../Context/AuthProvider";
import { Parent } from "../../../Constants/userRoles";
import ParentForm from "./ParentForm";

const ContactForm = () => {
  // ** Context
  const { user, isLoading } = useContext(AuthContext);

  // ** States
  const [selectedRecipient, setSelectedRecipient] = useState();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    (async () => {
      if (user && user.role !== Parent) {
        const groups = await getGroupsByUser(user.id);
        if (groups) {
          setGroups(groups);
        }
      }
    })();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 16 }}>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={[{ name: "Administration", id: 0 }, ...groups]}
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

      {!!selectedRecipient &&
        (user.role == Parent ? (
          <ParentForm
            selectedRecipient={selectedRecipient}
            setSelectedRecipient={setSelectedRecipient}
          />
        ) : (
          <GeneralForm
            selectedRecipient={selectedRecipient}
            setSelectedRecipient={setSelectedRecipient}
          />
        ))}
    </View>
  );
};

export default ContactForm;
