import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "../../Styles/SettingsScreenStyles/SettingsScreen.styles";
import AnimatedLoading from "../../Shared/AnimatedLoading/AnimatedLoading";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import CustomDrawerHeader from "../../Custom/CustomDrawerHeader";
import { AuthContext } from "../../../Context/AuthProvider";
import { Toast } from "react-native-toast-notifications";

const Setting = () => {
  const { user, isLoading } = useContext(AuthContext);
  const [profileInfo, setProfileInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [error, setError] = useState("");

  const handleProfileInfo = () => {
    const firstName = profileInfo.firstName;
    const lastName = profileInfo.lastName;
    const email = profileInfo.email;
    if (firstName && lastName && email) {
      setError("");
      Toast.show("Modifications suggérées avec succès", {
        position: "bottom",
        type: "success",
        duration: 3000,
      });
    } else {
      setError("Veuillez remplir tous les champs requis");
    }
  };

  useEffect(() => {
    setProfileInfo({
      firstName: user?.userData?.firstName,
      lastName: user?.userData?.lastName,
      email: user?.email,
    });
  }, [user]);

  return (
    <>
      {isLoading ? (
        <AnimatedLoading />
      ) : (
        <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={styles.mainContainer}
        >
          <CustomDrawerHeader>Voir les détails</CustomDrawerHeader>
          <ScrollView>
            <View style={styles.container}>
              <Image
                source={require("../../../../assets/Images/student-avatar.png")}
                style={styles.profileImage}
              />
              <Text style={styles.title}>Editer le profil</Text>
              {error && (
                <View style={styles.errorContainer}>
                  <FontAwesome name="close" size={20} color={"red"} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              <TextInput
                style={styles.textInput}
                placeholder="John"
                placeholderTextColor="#888"
                keyboardType="default"
                onChangeText={(value) =>
                  setProfileInfo({ ...profileInfo, firstName: value })
                }
                value={profileInfo.firstName}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Doe"
                placeholderTextColor="#888"
                keyboardType="default"
                onChangeText={(value) =>
                  setProfileInfo({ ...profileInfo, lastName: value })
                }
                value={profileInfo.lastName}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="default"
                onChangeText={(value) =>
                  setProfileInfo({ ...profileInfo, email: value })
                }
                value={profileInfo.email}
              />
              {/* <TextInput
                style={styles.textInput}
                placeholder="Melbon, Australia"
                placeholderTextColor="#888"
                keyboardType="default"
                onChangeText={(value) =>
                  setProfileInfo({ ...profileInfo, address: value })
                }
              /> */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleProfileInfo}
              >
                <Text style={styles.saveButtonText}>
                  Suggérer les modifications
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      )}
    </>
  );
};

export default Setting;
