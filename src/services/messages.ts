import axios from "axios";
import { Toast } from "react-native-toast-notifications";
import { BASE_URL } from "../Components/Utils/BASE_URL";
import { Administrator, Director, Teacher } from "../Constants/userRoles";
import { Message } from "../models/Message";

function mapUserData(data: any) {
  for (const message of data) {
    if (message?.sender?.role == Director) {
      message.sender.senderData = message.sender.director;
    } else if (message?.sender?.role == Teacher) {
      message.sender.senderData = message.sender.teacher;
    } else if (message?.sender?.role == Administrator) {
      message.sender.senderData = message.sender.administrator;
    } else if (message?.sender?.role == Director) {
      message.sender.senderData = message.sender.administrator;
    }
  }
}

export async function getMessages(folder: string) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/messages/auth?folder=${folder}`
    );

    mapUserData(data);

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

interface sendMessageProps {
  message: string;
  subject: string;
  recipient: number;
}
export async function sendMessage(data: sendMessageProps) {
  try {
    const formData = new FormData();
    formData.append("subject", data.subject);
    formData.append("body", data.message);
    formData.append(`recipients[0][id]`, data.recipient.toString());
    formData.append("categoryId", `1`);

    const response = await axios.post(`${BASE_URL}/messages`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    Toast.show("message envoyé avec succès", {
      type: "success",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
    });
  } catch (error) {
    Toast.show("Erreur lors de l'envoi du message", {
      type: "danger",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "red",
    });
  }
}

export async function getNewMessages(timestamp: string) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/messages/new?timestamp=${timestamp}`
    );

    mapUserData(data);

    return data as Message[];
  } catch (error) {
    Toast.show("Erreur lors de la récupération des nouveaux messages", {
      type: "warning",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "red",
    });
  }
}
