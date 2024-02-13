import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 30,
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  recipientPicker: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: "white",
    width: "100%",
    fontSize: 16,
  },
  inputPhone: {
    flex: 1,
    height: 50,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  textArea: {
    height: 120,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 16,
    backgroundColor: "white",
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 4,
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  boxStyle: {
    borderWidth: 0,
    borderRadius: 5,
    borderColor: "#ccc",
    backgroundColor: "#F8F8F9",
    paddingVertical: 8,
    marginHorizontal: 16,
    fontSize: 16,
    flex: 1,
    width: 172,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
  errorText: { color: "red" },
});
