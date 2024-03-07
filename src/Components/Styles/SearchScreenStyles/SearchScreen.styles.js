import { StyleSheet } from "react-native";
import Colors from "../../Utils/Color";

export const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  container: {
    flex: 1,
  },
  filteringContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },

  searchIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: Colors.PRIMARY.PRIMARY_RETRO_BLUE,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "black",
    paddingVertical: 10,
    width: 271,
    height: 48,
  },

  filterButton: {
    padding: 10,
    backgroundColor: Colors.NEUTRAL.NEUTRAL_WHITE,
    borderRadius: 4,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.NEUTRAL.NEUTRAL_WHITE,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  messageImage: {
    width: 80,
    height: 60,
    borderRadius: 4,
  },
  sendernameWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  senderName: {
    fontSize: 16,
  },
  timeDate: {
    fontSize: 12,
  },
  messageDetails: {
    flex: 1,
    marginHorizontal: 8,
  },

  messageSubject: {
    fontSize: 13,
  },
  messageMetadata: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metadataText: { color: "#808080", fontSize: 15, marginLeft: 1 },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    rowGap: 10,
  },
  metaDataText2: {
    color: "#808080",
    fontSize: 13,
    marginTop: 3,
    marginLeft: 1,
  },

  modalContentTitle: {
    fontSize: 18,
    marginBottom: 6,
    fontWeight: "bold",
  },

  modalContentButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F8F9FC",
    borderRadius: 10,
    paddingHorizontal: 10,
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  modalClose: { position: "relative", alignSelf: "center", marginVertical: 50 },

  noMessagesContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  noMessagesText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
  },
  noMessagesImage: {
    width: 200,
    height: 150,
    objectFit: "contain",
    marginTop: 20,
  },
});
