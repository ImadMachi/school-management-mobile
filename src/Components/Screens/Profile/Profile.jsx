import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import {
  MaterialCommunityIcons,
  AntDesign,
  SimpleLineIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../Styles/ProfileScreenStyles/ProfileScreen.styles";
import AnimatedLoading from "../../Shared/AnimatedLoading/AnimatedLoading";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import CustomDrawerHeader from "../../Custom/CustomDrawerHeader";
import { AuthContext } from "../../../Context/AuthProvider";
import { Student, Teacher } from "../../../Constants/userRoles";
import { BASE_URL } from "../../Utils/BASE_URL";
import mapUserRole from "../../../Utils/mapUserRole";

const Profile = () => {
  const navigation = useNavigation();

  const { user, isLoading } = useContext(AuthContext);

  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      {isLoading ? (
        <AnimatedLoading />
      ) : (
        <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={styles.container}
        >
          <CustomDrawerHeader>Profile</CustomDrawerHeader>

          <ScrollView>
            <LinearGradient
              colors={["#72DE95", "#8af2ac"]}
              end={{ x: 1, y: 0.9 }}
              style={styles.mainBannerContainer}
            >
              <View style={styles.bannerContainer}>
                <View style={styles.userImageBorder}>
                  <Image
                    style={styles.userImage}
                    source={
                      user.profileImage
                        ? {
                            uri: `${BASE_URL}/uploads/${user.profileImage}`,
                          }
                        : require("../../../../assets/Images/student-avatar.png")
                    }
                  />
                </View>
                <View style={styles.userNameSection}>
                  <Text
                    style={[
                      styles.userNameText,
                      { fontFamily: "Raleway_600SemiBold" },
                    ]}
                  >
                    {user?.userData?.firstName} {user?.userData?.lastName}
                  </Text>
                  <Text
                    style={[
                      styles.userNameBottomText,
                      { fontFamily: "Nunito_400Regular" },
                    ]}
                  >
                    {mapUserRole(user.role)}
                  </Text>
                </View>
              </View>

              <View style={styles.achiveContainer}>
                {user?.userData?.sex && (
                  <View style={styles.achiveWrapper}>
                    <FontAwesome name="venus-mars" size={20} color={"white"} />
                    <Text
                      style={[
                        styles.achiveText,
                        { fontFamily: "Nunito_600SemiBold" },
                      ]}
                    >
                      {user?.userData?.sex}
                    </Text>
                  </View>
                )}
                {!!user?.userData?.dateOfBirth && (
                  <View style={styles.achiveWrapper}>
                    <FontAwesome
                      name="birthday-cake"
                      size={20}
                      color={"white"}
                    />
                    <Text
                      style={[
                        styles.achiveText,
                        { fontFamily: "Nunito_600SemiBold" },
                      ]}
                    >
                      {format(user?.userData?.dateOfBirth, "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </Text>
                  </View>
                )}
                {user?.userData?.classe === Student && (
                  <View style={styles.achiveWrapper}>
                    <SimpleLineIcons
                      name="book-open"
                      size={18}
                      color={"white"}
                    />
                    <Text
                      style={[
                        styles.achiveText,
                        { fontFamily: "Nunito_600SemiBold" },
                      ]}
                    >
                      {user?.userData?.classe?.name}
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>

            <View style={styles.accountDetailsContainer}>
              <Text
                style={[
                  [styles.accountText, { fontFamily: "Raleway_700Bold" }],
                ]}
              >
                Détails du compte
              </Text>
              <TouchableOpacity
                style={styles.detailWrapper}
                onPress={() => navigation.navigate("Settings")}
              >
                <View style={styles.detailLeftSection}>
                  <View style={styles.detailUserIcon}>
                    <FontAwesome
                      style={styles.iconCenter}
                      name="user-o"
                      size={20}
                      color={"black"}
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.boldText,
                        { fontFamily: "Nunito_700Bold" },
                      ]}
                    >
                      Détails du profil
                    </Text>
                    <Text
                      style={[
                        styles.regularText,
                        { fontFamily: "Nunito_400Regular" },
                      ]}
                    >
                      Voir les informations de compte
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Settings")}
                >
                  <AntDesign name="right" size={26} color={"#CBD5E0"} />
                </TouchableOpacity>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.detailWrapper}
                onPress={() => navigation.navigate("Contact")}
              >
                <View style={styles.detailLeftSection}>
                  <View style={styles.detailUserIcon}>
                    <AntDesign
                      style={styles.iconCenter}
                      name="mail"
                      size={20}
                      color={"black"}
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.boldText,
                        { fontFamily: "Nunito_700Bold" },
                      ]}
                    >
                      Contacter l'administration
                    </Text>
                    <Text
                      style={[
                        styles.regularText,
                        { fontFamily: "Nunito_400Regular" },
                      ]}
                    >
                      Contactez l'administration
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Contact")}
                >
                  <AntDesign name="right" size={26} color={"#CBD5E0"} />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      )}
    </>
  );
};

export default Profile;
