import React, { useContext, useEffect, useRef, useState } from "react";
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
  markMessageAsRead,
} from "../../../services/messages";
import { folders } from "../../../Constants/folders";
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from "../../../Utils/notifications";
import { getCategories } from "../../../services/categories";
import { Agent, Parent, Teacher } from "../../../Constants/userRoles";
import { ActivityIndicator } from "react-native";
import MessageItem from "./Parts/MessageItem";
import useInterval from "../../../hooks/useInterval";
import { Toast } from "react-native-toast-notifications";
import mapFolderName from "../../../Utils/mapFolderName";
import { getStudentsByParent } from "../../../services/students";
import { getGroupsByUser } from "../../../services/groups";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Home = () => {
  // ** States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categries, setCategries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [children, setChildren] = useState([]);
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [filterText, setFilterText] = useState("");
  const [activeChild, setActiveChild] = useState({
    id: 0,
    student: { firstName: "Moi" },
  });
  const [activeGroup, setActiveGroup] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeFolder, setActiveFolder] = useState(folders.INBOX);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // ** Refs
  const notificationListener = useRef();
  const responseListener = useRef();

  const navigation = useNavigation();

  const { user, isLoading: isLoadingAuthUser } = useContext(AuthContext);

  const searchFilter = async ({
    text,
    categoryId,
    childUserId,
    folder,
    offset,
    groupId,
  }) => {
    setIsFiltering(true);
    const filteredMessages = await getMessages({
      folder,
      text,
      categoryId,
      userId: childUserId,
      offset,
      groupId,
    });
    setMessages(filteredMessages);
    setIsFiltering(false);
  };

  const loadMoreMessages = async () => {
    setIsLoadingMore(true);
    const newMessages = await getMessages({
      folder: activeFolder,
      offset: messages.length,
      categoryId: selectedCategory,
      text: filterText,
      userId: activeChild.id,
      groupId: activeGroup?.id ? activeGroup.id : 0,
    });
    if (newMessages.length > 0) {
      setMessages([...messages, ...newMessages]);
    } else {
      Toast.show("Il n'y a plus de messages à charger", {
        type: "info",
        position: "bottom",
      });
    }
    setIsLoadingMore(false);
  };

  const handleMessageDetails = async (messageDetails) => {
    navigation.navigate("Message Details", {
      messageDetails,
    });

    if (!messageDetails.isRead) {
      await markMessageAsRead(messageDetails.id);
      const updatedMessages = messages.map((message) => {
        if (message.id === messageDetails.id) {
          return { ...message, isRead: true };
        }
        return message;
      });
      setMessages(updatedMessages);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handeChangeFolder = (folder) => {
    setActiveGroup(null);
    setActiveFolder(folder);
  };

  const handleChildChipPress = (child) => {
    setActiveChild(child);
  };

  const handleGroupChipPress = (group) => {
    setActiveFolder(undefined);
    setActiveGroup(group);
    if (group.unReadMessagesCount > 0) {
      markMessageAsRead(group.id);
      const updatedGroups = groups.map((g) => {
        if (g.id === group.id) {
          return { ...g, unReadMessagesCount: 0 };
        }
        return g;
      });
      setGroups(updatedGroups);
    }
  };

  useEffect(() => {
    (async () => {
      const messageData = await getMessages({ folder: folders.INBOX });
      if (messageData) {
        setMessages(messageData);
      }

      const categoryData = await getCategories();
      if (categoryData) {
        setCategries(categoryData);
      }

      const groupData = await getGroupsByUser(user.id);
      if (groupData) {
        setGroups(groupData);
      }

      if (user.role == Parent) {
        const childrenData = await getStudentsByParent(user.userData.id);
        setChildren(childrenData);
      }
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    searchFilter({
      text: filterText,
      categoryId: selectedCategory,
      folder: activeFolder,
      childUserId: activeChild.id,
      groupId: activeGroup?.id ? activeGroup.id : 0,
    });
  }, [selectedCategory, filterText, activeFolder, activeChild, activeGroup]);

  useInterval(async () => {
    let newMessages = (await getNewMessages(timestamp)) || [];
    setTimestamp(new Date(Date.now() - 10000).toISOString());
    if (newMessages.length > 0) {
      for (let message of newMessages) {
        const fullName =
          message.sender.senderData.firstName +
          " " +
          message.sender.senderData.lastName;
        schedulePushNotification(fullName, message.subject);
      }
      setMessages([...newMessages, ...messages]);
      searchFilter({
        text: filterText,
        categoryId: selectedCategory,
        folder: activeFolder,
        childUserId: activeChild.id,
      });
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
      Notifications.addNotificationResponseReceivedListener((response) => {});

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
      {isLoading || isLoadingAuthUser ? (
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
                {selectedCategory !== 0 && <View style={styles.badge}></View>}
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: 16,
                paddingBottom:
                  user.role == Parent || groups.length > 0 ? 200 : 150,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginHorizontal: 16,
                  flexWrap: "wrap",
                }}
              >
                {[folders.INBOX, folders.SENT].map((folder) => (
                  <TouchableOpacity
                    style={[
                      childrenSliderStyles.categorySlideContainer,
                      {
                        backgroundColor:
                          activeFolder === folder
                            ? "rgba(160, 250, 236, 0.15)"
                            : "white",
                      },
                    ]}
                    onPress={() => handeChangeFolder(folder)}
                    key={folder}
                  >
                    <Text
                      style={[
                        childrenSliderStyles.categoryText,
                        {
                          color:
                            activeFolder === folder
                              ? Colors.PRIMARY.PRIMARY_RETRO_BLUE
                              : "black",
                          fontFamily: "Nunito_500Medium",
                        },
                      ]}
                    >
                      {mapFolderName(folder)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View>
                {user.role == Parent && (
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={[
                      { id: 0, student: { firstName: "Moi" } },
                      ...children.map((child) => ({
                        id: child.userId,
                        student: child,
                      })),
                    ]}
                    keyExtractor={(item) => item.id.toString()}
                    style={{ marginHorizontal: 16 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          childrenSliderStyles.categorySlideContainer,
                          {
                            backgroundColor:
                              activeChild.student.firstName ===
                              item.student.firstName
                                ? "rgba(160, 250, 236, 0.15)"
                                : "white",
                          },
                        ]}
                        onPress={() => handleChildChipPress(item)}
                      >
                        <Text
                          style={[
                            childrenSliderStyles.categoryText,
                            {
                              color:
                                activeChild.student.firstName ===
                                item.student.firstName
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
                {(user.role == Teacher || user.role == Agent) && (
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={groups}
                    keyExtractor={(item) => item.id.toString()}
                    style={{ marginHorizontal: 16 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          childrenSliderStyles.categorySlideContainer,
                          {
                            backgroundColor:
                              activeGroup?.id === item.id
                                ? "rgba(160, 250, 236, 0.15)"
                                : "white",
                            position: "relative",
                            borderTopEndRadius:
                              item.unReadMessagesCount > 0 ? 0 : 50,
                          },
                        ]}
                        onPress={() => handleGroupChipPress(item)}
                      >
                        <Text
                          style={[
                            childrenSliderStyles.categoryText,
                            {
                              color:
                                activeGroup?.id === item.id
                                  ? Colors.PRIMARY.PRIMARY_RETRO_BLUE
                                  : "black",
                              fontFamily: "Nunito_500Medium",
                            },
                          ]}
                        >
                          {item.name}
                        </Text>
                        {item.unReadMessagesCount > 0 && (
                          <Text style={styles.countBadge}>
                            {item.unReadMessagesCount}
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
              {isFiltering ? (
                <ActivityIndicator size="large" style={{ marginTop: 30 }} />
              ) : (
                <>
                  <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={() => loadMoreMessages()}
                    renderItem={({ item }) => (
                      <MessageItem
                        item={item}
                        key={item.id}
                        handleMessageDetails={handleMessageDetails}
                        folder={activeFolder}
                      />
                    )}
                  />
                </>
              )}

              {messages?.length === 0 && !isLoading && (
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
                    if (selectedCategory == category.id) {
                      setSelectedCategory(0);
                    } else {
                      setSelectedCategory(category.id);
                    }
                    toggleModal();
                  }}
                  key={category.id}
                >
                  <Text>{category.name}</Text>
                  <RadioButton
                    onPress={() => {
                      if (selectedCategory == category.id) {
                        setSelectedCategory(0);
                      } else {
                        setSelectedCategory(category.id);
                      }
                      toggleModal();
                    }}
                    value="Sort By Name"
                    status={
                      selectedCategory == category.id ? "checked" : "unchecked"
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
          {isLoadingMore && (
            <ActivityIndicator
              size="large"
              style={{
                marginTop: 30,
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: [{ translateX: -20 }],
              }}
            />
          )}
        </LinearGradient>
      )}
    </>
  );
};

export default Home;
