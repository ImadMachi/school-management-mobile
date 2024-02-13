import { Toast } from "react-native-toast-notifications";
import { BASE_URL } from "../Components/Utils/BASE_URL";
import axios from "axios";

export async function getAdministratorUsers(role: string) {
  try {
    const { data } = await axios.get(`${BASE_URL}/users?role=${role}`);

    return data;
  } catch (error) {
    Toast.show(
      "Erreur lors de la récupération de la liste des administrations",
      {
        type: "danger",
        placement: "bottom",
        duration: 2000,
        animationType: "zoom-in",
        successColor: "red",
      }
    );
  }
}
