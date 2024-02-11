import axios from "axios";
import { Toast } from "react-native-toast-notifications";
import { BASE_URL } from "../Components/Utils/BASE_URL";
import { Administrator, Director, Teacher } from "../Constants/userRoles";
import { Message } from "../models/Message";

export async function getMessages(folder: string) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/messages/auth?folder=${folder}`
    );

    for (const message of data) {
      if (message?.sender?.role == Teacher) {
        message.sender.senderData = message.sender.teacher;
      } else if (message?.sender?.role == Administrator) {
        message.sender.senderData = message.sender.administrator;
      } else if (message?.sender?.role == Director) {
        message.sender.senderData = message.sender.administrator;
      }
    }

    return data as Message[];
  } catch (error) {
    Toast.show("Erreur lors de la récupération des messages", {
      type: "warning",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "red",
    });
  }
}
