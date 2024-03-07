import React, { memo, useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { RadioButton } from "react-native-paper";
import { styles } from "../../Styles/SearchScreenStyles/SearchScreen.styles";
import { styles as childrenSliderStyles } from "../../Styles/CourseScreenStyles/CourseScreen.styles";

import AnimatedLoading from "../../Shared/AnimatedLoading/AnimatedLoading";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import * as Notifications from "expo-notifications";

import Colors from "../../Utils/Color";
import CustomDrawerHeader from "../../Custom/CustomDrawerHeader";
import { AuthContext } from "../../../Context/AuthProvider";
import {
  getMessages,
  getNewMessages,
  getStudentMessagesByParentId,
} from "../../../services/messages";
import { folders } from "../../../Constants/folders";
import { BASE_URL } from "../../Utils/BASE_URL";
import { formatMessageDate } from "../../../Utils/format-message-date";
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from "../../../Utils/notifications";
import { getCategories } from "../../../services/categories";
import { Parent } from "../../../Constants/userRoles";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const MessageItem = memo(({ item, handleMessageDetails }) => {
  return (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => handleMessageDetails(item)}
    >
      <Image
        source={{
          uri: `${BASE_URL}/uploads/categories-images/${item?.category?.imagepath}`,
        }}
        style={styles.messageImage}
      />
      <View style={styles.messageDetails}>
        <View style={styles.sendernameWrapper}>
          <Text style={[styles.senderName, { fontFamily: "Raleway_700Bold" }]}>
            {item.sender.senderData.firstName} {item.sender.senderData.lastName}
          </Text>
          <Text style={[styles.timeDate, { fontFamily: "Nunito_600SemiBold" }]}>
            {formatMessageDate(item.createdAt)}
          </Text>
        </View>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.messageSubject, { fontFamily: "Raleway_700Bold" }]}
        >
          {item.subject}
        </Text>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.messageBody, { fontFamily: "Nunito_600SemiBold" }]}
        >
          {item.body}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Home = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categries, setCategries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [childrenMessages, setChildrenMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [filterText, setFilterText] = useState("");
  const [activeChild, setActiveChild] = useState("Moi");

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const navigation = useNavigation();

  const { user, isLoading: isLoadingAuthUser } = useContext(AuthContext);

  const searchFilter = ({ text, category, childName, data = allMessages }) => {
    let searchList = [];
    if (!childName || childName == "Moi") {
      searchList = data;
    } else {
      const child = childrenMessages.find(
        (child) => child.studentData.student.firstName === childName
      );
      searchList = child.messages;
    }

    if (category) {
      searchList = searchList.filter(
        (item) =>
          item.category.slug.toLowerCase().indexOf(category.toLowerCase()) > -1
      );
      setMessages(searchList);
    }
    if (text.trim() === "") {
      setMessages(searchList);
      return;
    }

    searchList = searchList.filter((item) => {
      const matchSender =
        item.sender?.senderData?.firstName
          ?.toLowerCase()
          .indexOf(text.toLowerCase()) > -1 ||
        item.sender?.senderData?.lastName
          ?.toLowerCase()
          .indexOf(text.toLowerCase()) > -1;

      const matchSubject =
        item.subject.toLowerCase().indexOf(text.toLowerCase()) > -1;

      const matchBody =
        item.body.toLowerCase().indexOf(text.toLowerCase()) > -1;

      const matchCategory =
        item.category.name.toLowerCase().indexOf(text.toLowerCase()) > -1;
      return matchSender || matchSubject || matchBody || matchCategory;
    });
    setMessages(searchList);
  };

  const handleMessageDetails = (messageDetails) => {
    navigation.navigate("Message Details", {
      messageDetails,
    });
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleChildChipPress = (childName) => {
    setActiveChild(childName);
    if (childName === "Moi") {
      searchFilter({
        text: filterText,
        category: selectedCategory,
        data: allMessages,
        childName,
      });
    } else {
      const child = childrenMessages.find(
        (child) => child.studentData.student.firstName === childName
      );
      searchFilter({
        text: filterText,
        category: selectedCategory,
        data: child.messages,
        childName,
      });
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getMessages(folders.INBOX);
      if (data) {
        setAllMessages(data);
        setMessages(data);
      }
    })();

    (async () => {
      const data = await getCategories();
      if (data) {
        setCategries(data);
      }
    })();

    (async () => {
      if (user.role == Parent) {
        const data = await getStudentMessagesByParentId(user.userData.id);
        setChildrenMessages(data);
      }
    })();

    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   if (user.role == Parent) {
  //     navigation.navigate("Home Page Parent");
  //   }
  // }, [user]);

  useEffect(() => {
    searchFilter({
      text: filterText,
      category: selectedCategory,
    });
  }, [selectedCategory, filterText]);

  useInterval(async () => {
    let newMessages = (await getNewMessages(timestamp)) || [];
    setTimestamp(new Date(Date.now() - 10000).toISOString());
    if (newMessages.length > 0) {
      const filteredMessages = newMessages.filter(
        (message) =>
          !allMessages.find((oldMessage) => oldMessage.id === message.id)
      );
      setAllMessages([...filteredMessages, ...allMessages]);
      setMessages([...filteredMessages, ...allMessages]);

      for (message of filteredMessages) {
        const fullName =
          message.sender.senderData.firstName +
          " " +
          message.sender.senderData.lastName;
        schedulePushNotification(fullName, message.subject);
      }
    }
    newMessages = [];
  }, 15000);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError && isLoadingAuthUser && isLoading) {
    return null;
  }

  return (
    <>
      {isLoading ? (
        <AnimatedLoading />
      ) : (
        <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={styles.mainContainer}
        >
          <SafeAreaView style={styles.container}>
            <CustomDrawerHeader>Accueil</CustomDrawerHeader>
            <View style={styles.filteringContainer}>
              <TouchableOpacity style={styles.searchContainer}>
                <View style={styles.searchIconContainer}>
                  <AntDesign
                    name="search1"
                    size={20}
                    color={Colors.NEUTRAL.NEUTRAL_WHITE}
                  />
                </View>
                <TextInput
                  style={[styles.input, { fontFamily: "Nunito_700Bold" }]}
                  placeholder="Rechercher"
                  placeholderTextColor={Colors.NEUTRAL.NEUTRAL_SHADOW_MOUNTAIN}
                  onChangeText={(text) => setFilterText(text)}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={toggleModal}
              >
                <Ionicons
                  name="options-outline"
                  size={26}
                  color={Colors.NEUTRAL.NEUTRAL_SHADOW_MOUNTAIN}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 16, paddingBottom: 110 }}>
              {user.role == Parent && (
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={[
                    { id: 0, student: { firstName: "Moi" } },
                    ...childrenMessages.map((child) => child.studentData),
                  ]}
                  keyExtractor={(item) => item.id.toString()}
                  style={{ marginHorizontal: 16 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        childrenSliderStyles.categorySlideContainer,
                        {
                          backgroundColor:
                            activeChild === item.student.firstName
                              ? "rgba(36, 103, 236, 0.15)"
                              : "white",
                        },
                      ]}
                      onPress={() =>
                        handleChildChipPress(item.student.firstName)
                      }
                    >
                      <Text
                        style={[
                          childrenSliderStyles.categoryText,
                          {
                            color:
                              activeChild === item.student.firstName
                                ? Colors.PRIMARY.PRIMARY_RETRO_BLUE
                                : "black",
                            fontFamily: "Nunito_500Medium",
                          },
                        ]}
                      >
                        {item.student.firstName}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 50 }}
                renderItem={({ item }) => (
                  <MessageItem
                    item={item}
                    key={item.id}
                    handleMessageDetails={handleMessageDetails}
                  />
                )}
              />
              {messages.length === 0 && (
                <View style={styles.noMessagesContainer}>
                  <Text style={styles.noMessagesText}>Aucun message</Text>
                  <Image
                    source={require("../../../../assets/Images/empty-inbox.png")}
                    style={styles.noMessagesImage}
                  />
                </View>
              )}
            </View>
          </SafeAreaView>

          <Modal isVisible={isModalVisible} backdropOpacity={0.7}>
            <View style={styles.modalClose}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setIsModalVisible(false)}
              >
                <AntDesign name="closecircleo" size={30} color={"gray"} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalContentTitle}>Trier par catégories</Text>
              {categries.map((category) => (
                <TouchableOpacity
                  style={styles.modalContentButton}
                  onPress={() => {
                    if (selectedCategory == category.slug) {
                      setSelectedCategory("");
                    } else {
                      setSelectedCategory(category.slug);
                    }
                    toggleModal();
                  }}
                >
                  <Text>{category.name}</Text>
                  <RadioButton
                    onPress={() => {
                      if (selectedCategory == category.slug) {
                        setSelectedCategory("");
                      } else {
                        setSelectedCategory(category.slug);
                      }
                      toggleModal();
                    }}
                    value="Sort By Name"
                    status={
                      selectedCategory == category.slug
                        ? "checked"
                        : "unchecked"
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
        </LinearGradient>
      )}
    </>
  );
};

export default Home;
