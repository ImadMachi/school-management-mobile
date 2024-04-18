import { memo } from "react";
import { Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BASE_URL } from "../../../Utils/BASE_URL";
import { styles } from "../../../Styles/SearchScreenStyles/SearchScreen.styles";
import { formatMessageDate } from "../../../../Utils/format-message-date";
import { Message } from "../../../../models/Message";
import { folders } from "../../../../Constants/folders";

interface MessageItemProps {
  item: Message;
  handleMessageDetails: (item: any) => void;
  folder: string;
}
const MessageItem = memo(
  ({ item, handleMessageDetails, folder }: MessageItemProps) => {
    return (
      <TouchableOpacity
        style={[styles.messageItem]}
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
            <Text
              style={[
                styles.senderName,
                {
                  fontFamily:
                    item.isRead || folder === folders.SENT
                      ? ""
                      : "Raleway_700Bold",
                  color:
                    item.isRead || folder === folders.SENT ? "#555" : "black",
                },
              ]}
            >
              {`${item.sender.senderData.firstName} ${item.sender.senderData.lastName}`}
            </Text>
            <Text
              style={[
                styles.timeDate,
                {
                  fontFamily:
                    item.isRead || folder === folders.SENT
                      ? ""
                      : "Nunito_700Bold",
                  color:
                    item.isRead || folder === folders.SENT ? "#555" : "black",
                },
              ]}
            >
              {formatMessageDate(item.createdAt)}
            </Text>
          </View>

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.messageSubject,
              {
                fontFamily:
                  item.isRead || folder === folders.SENT
                    ? ""
                    : "Nunito_700Bold",
                color:
                  item.isRead || folder === folders.SENT ? "#555" : "black",
                fontSize: item.isRead || folder === folders.SENT ? 13 : 14,
              },
            ]}
          >
            {item.subject}
          </Text>

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              {
                fontFamily:
                  item.isRead || folder === folders.SENT
                    ? ""
                    : "Nunito_700Bold",
                color:
                  item.isRead || folder === folders.SENT ? "#555" : "black",
                fontSize: item.isRead || folder === folders.SENT ? 12 : 13,
              },
            ]}
          >
            {item.body}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);

export default MessageItem;
