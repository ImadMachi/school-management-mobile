import React, { memo, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons";
import { searchAndFilteringData } from "../../Data/SearchAndFilteringData";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { RadioButton } from "react-native-paper";
import { styles } from "../../Styles/SearchScreenStyles/SearchScreen.styles";
import AnimatedLoading from "../../Shared/AnimatedLoading/AnimatedLoading";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import Colors from "../../Utils/Color";
import CustomDrawerHeader from "../../Custom/CustomDrawerHeader";
import { AuthContext } from "../../../Context/AuthProvider";
import { getMessages } from "../../../services/messages";
import { folders } from "../../../Constants/folders";
import { BASE_URL } from "../../Utils/BASE_URL";
import { formatMessageDate } from "../../../Utils/format-message-date";

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

const Home = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checked, setChecked] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  const { user } = useContext(AuthContext);

  const handlePaymentOptionPress = (value) => {
    setChecked(value);
  };

  const searchFilter = (text) => {
    if (text.trim() === "") {
      setMessages(allMessages);
      return;
    }

    let searchList = allMessages.filter((item) => {
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
    navigation.navigate("Course Details", {
      messageDetails,
    });
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    (async () => {
      const data = await getMessages(folders.INBOX);
      if (data) {
        setAllMessages(data);
        setMessages(data);
      }
      setIsLoading(false);
    })();
  }, []);

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
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
                  onChangeText={(text) => searchFilter(text)}
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
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <MessageItem
                    item={item}
                    handleMessageDetails={handleMessageDetails}
                  />
                )}
              />
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
              <TouchableOpacity
                style={styles.modalContentButton}
                onPress={() => {
                  let tempList = searchAndFilteringData.sort((a, b) =>
                    a.title > b.title ? 1 : -1
                  );
                  setMessages(tempList);
                  handlePaymentOptionPress("Sort By Name"), toggleModal();
                }}
              >
                <Text>Sort By Name</Text>
                <RadioButton
                  onPress={() => {
                    let tempList = searchAndFilteringData.sort((a, b) =>
                      a.title > b.title ? 1 : -1
                    );
                    setMessages(tempList);
                    handlePaymentOptionPress("Sort By Name"), toggleModal();
                  }}
                  value="Sort By Name"
                  status={checked === "Sort By Name" ? "checked" : "unchecked"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalContentButton}
                onPress={() => {
                  let temtList = searchAndFilteringData.sort(
                    (a, b) => a.price - b.price
                  );
                  setMessages(temtList);
                  handlePaymentOptionPress("Low To High Price"), toggleModal();
                }}
              >
                <Text>Low To High Price</Text>
                <RadioButton
                  onPress={() => {
                    let temtList = searchAndFilteringData.sort(
                      (a, b) => a.price - b.price
                    );
                    setMessages(temtList);
                    handlePaymentOptionPress("Low To High Price"),
                      toggleModal();
                  }}
                  value="Low To High Price"
                  status={
                    checked === "Low To High Price" ? "checked" : "unchecked"
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalContentButton}
                onPress={() => {
                  let temtList = searchAndFilteringData.sort(
                    (a, b) => b.price - a.price
                  );
                  setMessages(temtList);
                  handlePaymentOptionPress("High To Low Price"), toggleModal();
                }}
              >
                <Text>High To Low Price</Text>
                <RadioButton
                  onPress={() => {
                    let temtList = searchAndFilteringData.sort(
                      (a, b) => b.price - a.price
                    );
                    setMessages(temtList);
                    handlePaymentOptionPress("High To Low Price"),
                      toggleModal();
                  }}
                  value="High To Low Price"
                  status={
                    checked === "High To Low Price" ? "checked" : "unchecked"
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalContentButton}
                onPress={() => {
                  let temtList = searchAndFilteringData.sort(
                    (a, b) => b.ratingAve - a.ratingAve
                  );
                  setMessages(temtList);
                  handlePaymentOptionPress("Sort By Rating"), toggleModal();
                }}
              >
                <Text>Sort By Rating</Text>
                <RadioButton
                  onPress={() => {
                    let temtList = searchAndFilteringData.sort(
                      (a, b) => b.ratingAve - a.ratingAve
                    );
                    setMessages(temtList);
                    handlePaymentOptionPress("Sort By Rating"), toggleModal();
                  }}
                  value="Sort By Rating"
                  status={
                    checked === "Sort By Rating" ? "checked" : "unchecked"
                  }
                />
              </TouchableOpacity>
            </View>
          </Modal>
        </LinearGradient>
      )}
    </>
  );
};

export default Home;
