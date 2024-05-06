import axios from "axios";
import { BASE_URL } from "../Components/Utils/BASE_URL";
import { Toast } from "react-native-toast-notifications";

interface declareAbsenceProps {
  startDate: string;
  endDate: string;
  reason: string;
  userId: { id: number };
}

export async function declareAbsence(props: declareAbsenceProps) {
  try {
    const { data } = await axios.post(`${BASE_URL}/absences`, props);
    Toast.show("Absence déclarée avec succès", {
      type: "success",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "green",
    });
  } catch (error) {
    Toast.show("Erreur lors de la déclaration de l'absence", {
      type: "warning",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "red",
    });
  }
}
