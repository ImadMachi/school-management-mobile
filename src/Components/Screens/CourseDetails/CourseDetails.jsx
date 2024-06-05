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
import { Audio } from "expo-av";
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

import CustomBackHeader from "../../Custom/CustomBackHeader";
import { BASE_URL } from "../../Utils/BASE_URL";
import { set } from "date-fns";
import { Parent } from "../../../Constants/userRoles";

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

const AUDIO_EXTENSIONS = ["wav"];

downloadFile = async (filepath, filename) => {
  const url = `${BASE_URL}/uploads/attachments/${filepath}`;
  Linking.openURL(url);
};

const MessageDetails = () => {
  const [activeButton, setActiveButton] = useState("Message");
  const [currentAudio, setCurrentAudio] = useState(null);

  const router = useRoute();
  const { messageDetails } = router.params;

  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
  };

  const navigation = useNavigation();

  const playAudio = async (attachment) => {
    if (currentAudio?.filename == attachment.filename && currentAudio?.sound) {
      if (JSON.parse(currentAudio.sound?._lastStatusUpdate)?.isPlaying) {
        await currentAudio.sound.pauseAsync();
        setCurrentAudio({ ...currentAudio, isPlaying: false });
        return;
      } else {
        await currentAudio.sound.playAsync();
        setCurrentAudio({ ...currentAudio, isPlaying: true });
        return;
      }
    }
    await currentAudio?.sound?.pauseAsync();
    await currentAudio?.sound?.unloadAsync();
    setCurrentAudio(null);
    const audioFile = `${BASE_URL}/uploads/attachments/${attachment.filepath}`;
    const { sound } = await Audio.Sound.createAsync({ uri: audioFile });
    setCurrentAudio({
      filename: attachment.filename,
      sound,
      isPlaying: true,
    });
    sound.playAsync().then((playbackStatus) => {
      sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        const durationMillis = playbackStatus.durationMillis;
        const durationSeconds = durationMillis / 1000;
        const durationMinutes = Math.floor(durationSeconds / 60);
        const remainingSeconds = Math.floor(durationSeconds % 60);

        const positionMillis = playbackStatus.positionMillis;
        const positionSeconds = positionMillis / 1000;
        const positionMinutes = Math.floor(positionSeconds / 60);
        const positionRemainingSeconds = Math.floor(positionSeconds % 60);
        setCurrentAudio((curr) => ({
          ...curr,
          duration: {
            minutes: durationMinutes,
            seconds: remainingSeconds,
          },
          position: {
            minutes: positionMinutes,
            seconds: positionRemainingSeconds,
          },
        }));
        if (playbackStatus.didJustFinish) {
          setCurrentAudio(null);
        }
      });
    });
  };
  useEffect(() => {
    if (currentAudio?.sound) {
      currentAudio.sound.pauseAsync();
      currentAudio.sound.unloadAsync();
      setCurrentAudio(null);
    }
  }, []);

  useEffect(() => {
    if (messageDetails.attachments.length == 0) {
      setActiveButton("Message");
    }
  }, [messageDetails.attachments.length]);

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
                {messageDetails.sender.role == Parent
                  ? `${messageDetails.sender.senderData.fatherFirstName} ${messageDetails.sender.senderData.fatherLastName} - ${messageDetails.sender.senderData.motherFirstName} ${messageDetails.sender.senderData.motherLastName}`
                  : `${messageDetails.sender.senderData.firstName} ${messageDetails.sender.senderData.lastName}`}
              </Text>
            </View>
            <View style={styles.instructorNameWrap}>
              <TouchableOpacity
                style={{ display: "flex", flexDirection: "row" }}
                onPress={() => {
                  navigation.navigate("ReplyToMessage", {
                    replyData: {
                      recipientName:
                        messageDetails.sender.role == Parent
                          ? messageDetails.sender.senderData.fatherFirstName +
                            " " +
                            messageDetails.sender.senderData.fatherLastName +
                            " - " +
                            messageDetails.sender.senderData.motherFirstName +
                            " " +
                            messageDetails.sender.senderData.motherLastName
                          : messageDetails.sender.senderData.firstName +
                            " " +
                            messageDetails.sender.senderData.lastName,
                      parentMessageId: messageDetails.id,
                      categoryId: messageDetails.category.id,
                      recipientId: messageDetails.sender.senderData.id,
                    },
                  });
                }}
              >
                <FontAwesome name="reply" size={18} color={"#8A8A8A"} />
                <Text
                  style={[
                    styles.instructorNameText,
                    { fontFamily: "Nunito_500Medium", marginLeft: 5 },
                  ]}
                >
                  Répondre
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {messageDetails.attachments.length == 0 && (
            <View style={styles.divider} />
          )}

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
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 15,
                  flexWrap: "wrap",
                }}
              >
                {messageDetails.attachments.map((attachment) => {
                  const fileExtension = attachment.filepath
                    .split(".")
                    .pop()
                    ?.toLowerCase();

                  if (AUDIO_EXTENSIONS.includes(fileExtension)) {
                    return (
                      <TouchableOpacity
                        key={attachment.id}
                        onPress={() => {
                          playAudio(attachment);
                        }}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "rgba(0,0,0,0.1)",
                          margin: 5,
                          paddingVertical: 2,
                          paddingHorizontal: 7,
                          borderRadius: 5,
                        }}
                      >
                        {currentAudio?.filename == attachment.filename &&
                        currentAudio?.isPlaying ? (
                          <Entypo
                            name="controller-paus"
                            size={24}
                            color={"gray"}
                            style={{ marginRight: 10 }}
                          />
                        ) : (
                          <Entypo
                            name="controller-play"
                            size={30}
                            color={"gray"}
                            style={{ marginRight: 10 }}
                          />
                        )}
                        {currentAudio?.filename == attachment.filename && (
                          <Text>
                            {currentAudio?.position?.minutes}:
                            {currentAudio?.position?.seconds} /{" "}
                            {currentAudio?.duration?.minutes}:
                            {currentAudio?.duration?.seconds}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  } else {
                    return;
                  }
                })}
              </View>
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

                  if (AUDIO_EXTENSIONS.includes(fileExtension)) {
                    return;
                  } else if (IMAGE_EXTENSIONS.includes(fileExtension)) {
                    return (
                      <TouchableOpacity
                        key={attachment.id}
                        onPress={() =>
                          downloadFile(attachment.filepath, attachment.filename)
                        }
                      >
                        <View style={styles.attachmentLinkWrapper}>
                          <Entypo
                            name="image-inverted"
                            size={16}
                            color={"gray"}
                          />
                          <Text style={styles.attachmentLink}>
                            {attachment.filename}
                          </Text>
                        </View>
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
