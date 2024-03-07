import { Toast } from "react-native-toast-notifications";
import { BASE_URL } from "../Components/Utils/BASE_URL";
import axios from "axios";

export async function getCategories() {
  try {
    const { data } = await axios.get(`${BASE_URL}/message-categories`);

    return data;
  } catch (error) {
    Toast.show("Erreur lors de la récupération des catégories", {
      type: "danger",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "red",
    });
  }
}
