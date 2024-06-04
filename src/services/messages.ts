import axios from "axios";
import { Toast } from "react-native-toast-notifications";
import { BASE_URL } from "../Components/Utils/BASE_URL";
import {
  Administrator,
  Agent,
  Director,
  Parent,
  Student,
  Teacher,
} from "../Constants/userRoles";
import { Message } from "../models/Message";
import { folders } from "../Constants/folders";

function mapUserData(data: any) {
  for (const message of data) {
    if (message?.sender?.role == Director) {
      message.sender.senderData = message.sender.director;
      delete message.sender.director;
    } else if (message?.sender?.role == Administrator) {
      message.sender.senderData = message.sender.administrator;
      delete message.sender.administrator;
    } else if (message?.sender?.role == Teacher) {
      message.sender.senderData = message.sender.teacher;
      delete message.sender.teacher;
    } else if (message?.sender?.role == Agent) {
      message.sender.senderData = message.sender.agent;
      delete message.sender.agent;
    } else if (message?.sender?.role == Parent) {
      message.sender.senderData = message.sender.parent;
      delete message.sender.administrator;
    } else if (message?.sender.role == Student) {
      message.sender.senderData = message.sender.student;
      delete message.sender.student;
    }
  }
}

interface getMessagesProps {
  folder: string;
  offset?: number;
  categoryId?: number;
  text?: string;
  userId?: number;
  groupId?: number;
}
export async function getMessages(props: getMessagesProps) {
  const {
    folder = folders.INBOX,
    offset = 0,
    categoryId = 0,
    text = "",
    userId = 0,
    groupId = 0,
  } = props;

  try {
    const { data } = await axios.get(
      `${BASE_URL}/messages/auth?folder=${folder}&offset=${offset}&categoryId=${categoryId}&text=${text}&userId=${userId}&groupId=${groupId}`
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

export async function getStudentMessagesByParentId(parentId: number) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/messages/parent/${parentId}/students`
    );

    for (const studentData of data) {
      mapUserData(studentData.messages);
    }
    return data as Message[];
  } catch (error) {
    Toast.show("Erreur lors de la récupération des messages", {
      type: "danger",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "red",
    });
  }
}

interface sendMessageProps {
  subject: string;
  body: string;
}
export async function sendMessage(data: sendMessageProps) {
  try {
    await axios.post(`${BASE_URL}/messages/contact-administration`, data);

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

interface ContactGroupAdministratorProps {
  subject: string;
  body: string;
  categoryId: number;
}
export async function contactGroupAdministrator(
  data: ContactGroupAdministratorProps
) {
  try {
    await axios.post(`${BASE_URL}/messages/contact-group-administrator`, data);

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

interface sendMailProps {
  subject: string;
  body: string;
  recipients: { id: number }[];
  categoryId: number;
}
export async function sendMail(data: sendMailProps) {
  try {
    await axios.post(`${BASE_URL}/messages`, data);

    Toast.show("message envoyé avec succès", {
      type: "success",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
    });
  } catch (error) {
    console.log(error);

    Toast.show("Erreur lors de l'envoi du message", {
      type: "danger",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "red",
    });
  }
}

interface ReplayToMessageProps {
  subject: string;
  body: string;
  recipient: number;
  parentMessageId: number;
  categoryId: number;
}
export async function replayToMessage(data: ReplayToMessageProps) {
  try {
    const formData = new FormData();
    formData.append("subject", data.subject);
    formData.append("body", data.body);
    formData.append("recipients[0][id]", data.recipient.toString());
    formData.append("parentMessage[id]", data.parentMessageId.toString());
    formData.append("categoryId", data.categoryId.toString());

    await axios.post(`${BASE_URL}/messages`, formData, {
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

export async function markMessageAsRead(messageId: number) {
  try {
    await axios.post(`${BASE_URL}/messages/${messageId}/read`);

    return true;
  } catch (error) {
    Toast.show("Erreur lors de la mise à jour du message", {
      type: "warning",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "red",
    });
  }
}
