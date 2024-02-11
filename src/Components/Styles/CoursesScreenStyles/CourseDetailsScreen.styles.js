import { StyleSheet } from "react-native";
import Colors from "../../Utils/Color";

export const styles = StyleSheet.create({
  mainContainer: { flex: 1 },

  courseImageContainer: { marginHorizontal: 16 },

  courseImage: { width: "100%", height: 230, borderRadius: 6 },

  categoryWrapper: {
    flexDirection: "row",
  },

  cetagoryText: {
    color: "white",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
    fontWeight: "bold",
    backgroundColor: Colors.PRIMARY.PRIMARY_RETRO_BLUE,
  },

  titleText: {
    marginHorizontal: 16,
    marginTop: 8,
    fontSize: 22,
  },

  instructorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginHorizontal: 16,
  },

  instructorNameWrap: { flexDirection: "row", alignItems: "center" },

  instructorNameText: {
    marginLeft: 3,
    color: Colors.NEUTRAL.NEUTRAL_SHADOW_MOUNTAIN,
  },

  buttonGroupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    marginHorizontal: 16,
    backgroundColor: "#E1E9F8",
    borderRadius: 50,
  },

  buttonContainer: {
    width: "50%",
    paddingVertical: 10,
  },

  activeButton: { backgroundColor: Colors.PRIMARY.PRIMARY_RETRO_BLUE },

  activeText: { color: "white" },

  activeButtonWrap: {
    borderRadius: 50,
  },

  buttonPressedContainer: { marginHorizontal: 16, marginVertical: 25 },

  attachmentLinkWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  attachmentLink: {
    color: "#3366CC",
    textDecorationLine: "underline",
    marginVertical: 5,
    marginLeft: 5,
  },

  attachmentImage: { marginVertical: 5, width: 100, height: 100 },
});
