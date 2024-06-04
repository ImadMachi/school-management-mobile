import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, TextInput, ScrollView } from "react-native";
import { styles } from "../../Styles/SettingsScreenStyles/SettingsScreen.styles";
import AnimatedLoading from "../../Shared/AnimatedLoading/AnimatedLoading";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../../Context/AuthProvider";
import { BASE_URL } from "../../Utils/BASE_URL";
import CustomBackHeader from "../../Custom/CustomBackHeader";

const Setting = () => {
  const { user, isLoading } = useContext(AuthContext);
  const [profileInfo, setProfileInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    if (user?.profileImage) {
      setImagePath(`${BASE_URL}/uploads/${user.profileImage}`);
    }
  }, [user]);

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
          <CustomBackHeader to="Profile">Détails du Profile</CustomBackHeader>
          <ScrollView>
            <View style={styles.container}>
              <Image
                source={
                  imagePath
                    ? {
                        uri: `${BASE_URL}/uploads/${user.profileImage}`,
                      }
                    : require("../../../../assets/avatar.png")
                }
                onError={() => setImagePath("")}
                style={styles.profileImage}
              />
              <View style={{ width: "100%" }}>
                <Text style={styles.inputLabel}>Nom</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Doe"
                  placeholderTextColor="#888"
                  keyboardType="default"
                  value={profileInfo.lastName}
                  editable={false}
                />
                <Text style={styles.inputLabel}>Prénom</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="John"
                  placeholderTextColor="#888"
                  keyboardType="default"
                  value={profileInfo.firstName}
                  editable={false}
                />
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  keyboardType="default"
                  value={profileInfo.email}
                  editable={false}
                />
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      )}
    </>
  );
};

export default Setting;
