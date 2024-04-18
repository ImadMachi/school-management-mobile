import axios from "axios";
import { BASE_URL } from "../Components/Utils/BASE_URL";
import { Toast } from "react-native-toast-notifications";

export async function getGroupsByUser(userId: number) {
  try {
    const { data } = await axios.get(`${BASE_URL}/groups/user/${userId}`);
    return data;
  } catch (error) {
    Toast.show("Erreur lors de la récupération de la liste des groupes", {
      type: "danger",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "red",
    });
  }
}
