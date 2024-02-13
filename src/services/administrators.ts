import axios from "axios";
import { BASE_URL } from "../Components/Utils/BASE_URL";
import { Toast } from "react-native-toast-notifications";

// export async function getAdministrators(folder: string) {
//   try {
//     const { data } = await axios.get(`${BASE_URL}/administrators`);
//     return data;
//   } catch (error) {
//     Toast.show(
//       "Erreur lors de la récupération de la liste des administrations",
//       {
//         type: "danger",
//         placement: "bottom",
//         duration: 2000,
//         animationType: "zoom-in",
//         successColor: "red",
//       }
//     );
//   }
// }
