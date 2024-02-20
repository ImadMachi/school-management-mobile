import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Link, useNavigation, useRoute } from "@react-navigation/native";
import {
  FontAwesome,
  Entypo,
  Fontisto,
  Feather,
  AntDesign,
} from "@expo/vector-icons";

import { styles } from "../../Styles/CoursesScreenStyles/CourseDetailsScreen.styles";
import { LinearGradient } from "expo-linear-gradient";

import {
  useFonts,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
  SemiBold,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import CustomBackHeader from "../../Custom/CustomBackHeader";
import { BASE_URL } from "../../Utils/BASE_URL";
import { Toast } from "react-native-toast-notifications";

const IMAGE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "bmp",
  "gif",
  "webp",
  "psd",
  "svg",
  "tiff",
];

downloadFile = async (filepath, filename) => {
  const url = `${BASE_URL}/uploads/attachments/${filepath}`;
  Linking.openURL(url);
};

// async function downloadFile(filepath, filename) {
//   const url = `${BASE_URL}/uploads/attachments/${filepath}`;
//   try {
//     const dirInfo = await FileSystem.getInfoAsync(
//       FileSystem.documentDirectory + "Arganier/"
//     );
//     if (!dirInfo.exists) {
//       await FileSystem.makeDirectoryAsync(
//         FileSystem.documentDirectory + "Arganier/",
//         { intermediates: true }
//       );
//     }
//     const downloadResumable = FileSystem.createDownloadResumable(
//       url,
//       FileSystem.documentDirectory + "Arganier/" + filename
//     );
//     const { uri } = await downloadResumable.downloadAsync();

//     // ask for permission to access the media library
//     const { granted } = await MediaLibrary.requestPermissionsAsync();

//     await FileSystem.StorageAccessFramework.moveAsync({
//       from: uri,
//       to: FileSystem.documentDirectory + "Arganier/" + filename,
//     });

//     if (!granted) {
//       Toast.show("L'autorisation d'accès au système de fichiers est requise.", {
//         type: "warning",
//         placement: "bottom",
//         duration: 2000,
//         animationType: "zoom-in",
//         successColor: "red",
//       });
//       return;
//     }

//     const asset = await MediaLibrary.createAssetAsync(uri);
//     await MediaLibrary.createAlbumAsync("Arganier", asset, false);
//     await MediaLibrary.getAssetInfoAsync(asset);
//     await MediaLibrary.openAssetAsync(asset);

//     Toast.show("Fichier téléchargé avec succès", {
//       type: "success",
//       placement: "bottom",
//       duration: 2000,
//       animationType: "zoom-in",
//       successColor: "green",
//     });
//   } catch (error) {
//     Toast.show("échec de Téléchargement du fichier", {
//       type: "warning",
//       placement: "bottom",
//       duration: 2000,
//       animationType: "zoom-in",
//       successColor: "red",
//     });
//   }
// }

const MessageDetails = () => {
  const [activeButton, setActiveButton] = useState("Message");
  const router = useRoute();
  const { messageDetails } = router.params;

  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
  };

  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  useEffect(() => {
    if (messageDetails.attachments.length == 0) {
      setActiveButton("Message");
    }
  }, [messageDetails]);

  return (
    <>
      <LinearGradient
        colors={["#E5ECF9", "#F6F7F9"]}
        style={styles.mainContainer}
      >
        <CustomBackHeader>Message</CustomBackHeader>
        <ScrollView>
          <View style={styles.courseImageContainer}>
            <Image
              source={{
                uri: `${BASE_URL}/uploads/categories-images/${messageDetails?.category?.imagepath}`,
              }}
              style={styles.courseImage}
            />
            <View style={styles.categoryWrapper}>
              <Text style={styles.cetagoryText}>
                {messageDetails.category.name}
              </Text>
            </View>
          </View>
          <Text style={[styles.titleText, { fontFamily: "Raleway_700Bold" }]}>
            {messageDetails.subject}
          </Text>
          <View style={styles.instructorContainer}>
            <View style={styles.instructorNameWrap}>
              <Feather name="user" size={20} color={"#8A8A8A"} />
              <Text
                style={[
                  styles.instructorNameText,
                  { fontFamily: "Nunito_500Medium" },
                ]}
              >
                {messageDetails.sender.senderData.firstName}{" "}
                {messageDetails.sender.senderData.lastName}
              </Text>
            </View>
          </View>

          {messageDetails.attachments.length > 0 && (
            <View style={styles.buttonGroupContainer}>
              <TouchableOpacity
                style={[
                  styles.buttonContainer,
                  activeButton === "Message" && styles.activeButton,
                  activeButton === "Message" && styles.activeButtonWrap,
                ]}
                onPress={() => handleButtonPress("Message")}
              >
                <Text
                  style={[
                    { textAlign: "center" },
                    activeButton === "Message" && [
                      styles.activeText,
                      { fontFamily: "Nunito_600SemiBold" },
                    ],
                    { fontFamily: "Nunito_600SemiBold" },
                  ]}
                >
                  Message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.buttonContainer,
                  activeButton === "Attachments" && styles.activeButton,
                  activeButton === "Attachments" && styles.activeButtonWrap,
                ]}
                onPress={() => handleButtonPress("Attachments")}
              >
                <Text
                  style={[
                    { textAlign: "center" },
                    activeButton === "Attachments" && [
                      styles.activeText,
                      { fontFamily: "Nunito_600SemiBold" },
                    ],
                    { fontFamily: "Nunito_600SemiBold" },
                  ]}
                >
                  pièces jointes
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {activeButton === "Message" && (
            <View style={styles.buttonPressedContainer}>
              <Text>{messageDetails.body}</Text>
            </View>
          )}
          {activeButton === "Attachments" && (
            <View style={styles.buttonPressedContainer}>
              <View style={styles.reviewTopWrap}>
                {messageDetails.attachments.map((attachment) => {
                  const fileExtension = attachment.filepath
                    .split(".")
                    .pop()
                    ?.toLowerCase();

                  if (IMAGE_EXTENSIONS.includes(fileExtension)) {
                    return (
                      <TouchableOpacity
                        key={attachment.id}
                        onPress={() =>
                          downloadFile(attachment.filepath, attachment.filename)
                        }
                      >
                        <Image
                          style={styles.attachmentImage}
                          key={attachment.id}
                          source={{
                            uri: `${BASE_URL}/uploads/attachments/${attachment.filepath}`,
                          }}
                        />
                      </TouchableOpacity>
                    );
                  } else {
                    return (
                      <TouchableOpacity
                        key={attachment.id}
                        onPress={() =>
                          downloadFile(attachment.filepath, attachment.filename)
                        }
                      >
                        <View style={styles.attachmentLinkWrapper}>
                          <Entypo
                            name="text-document"
                            size={16}
                            color={"gray"}
                          />
                          <Text style={styles.attachmentLink}>
                            {attachment.filename}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                })}
              </View>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default MessageDetails;
