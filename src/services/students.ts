import axios from "axios";
import { BASE_URL } from "../Components/Utils/BASE_URL";
import { Toast } from "react-native-toast-notifications";

export async function getStudentsByParent(parentId: number) {
  try {
    const { data } = await axios.get(`${BASE_URL}/students/parent/${parentId}`);
    return data;
  } catch (error) {
    Toast.show("Erreur lors de la récupération de la liste des enfants", {
      type: "danger",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "red",
    });
  }
}
