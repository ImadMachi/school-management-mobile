import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { styles } from "../../Styles/SettingsScreenStyles/SettingsScreen.styles";
import AnimatedLoading from "../../Shared/AnimatedLoading/AnimatedLoading";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../../Context/AuthProvider";
import { BASE_URL } from "../../Utils/BASE_URL";
import CustomBackHeader from "../../Custom/CustomBackHeader";
import { changePassword } from "../../../services/users";

const ChangePassword = () => {
  const { user, isLoading } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Tous les champs sont requis");
      return;
    } else if (newPassword !== confirmPassword) {
      setError(
        "Le nouveau mot de passe et la confirmation ne correspondent pas"
      );
      return;
    } else {
      setButtonSpinner(true);
      setError("");
      const response = await changePassword({ oldPassword, newPassword });
      if (response) {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
      setButtonSpinner(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <AnimatedLoading />
      ) : (
        <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={styles.mainContainer}
        >
          <CustomBackHeader to="Profile">
            Changer le mot de passe
          </CustomBackHeader>
          <ScrollView>
            <View style={styles.container}>
              <View style={{ width: "100%" }}>
                {!!error && (
                  <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
                )}
                <Text style={styles.inputLabel}>Ancien mot de passe</Text>
                <TextInput
                  style={styles.textInput}
                  placeholderTextColor="#888"
                  value={oldPassword}
                  onChangeText={(value) => setOldPassword(value)}
                  secureTextEntry={true}
                />
                <Text style={styles.inputLabel}>Nouveau mot de passe</Text>
                <TextInput
                  style={styles.textInput}
                  placeholderTextColor="#888"
                  keyboardType="default"
                  value={newPassword}
                  onChangeText={(value) => setNewPassword(value)}
                  secureTextEntry={true}
                />
                <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
                <TextInput
                  style={styles.textInput}
                  placeholderTextColor="#888"
                  keyboardType="default"
                  value={confirmPassword}
                  onChangeText={(value) => setConfirmPassword(value)}
                  secureTextEntry={true}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  {buttonSpinner ? (
                    <ActivityIndicator size={"small"} color={"white"} />
                  ) : (
                    <Text style={[styles.submitButtonText]}>Soumettre</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      )}
    </>
  );
};

export default ChangePassword;
