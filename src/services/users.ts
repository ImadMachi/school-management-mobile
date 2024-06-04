import { Toast } from "react-native-toast-notifications";
import { BASE_URL } from "../Components/Utils/BASE_URL";
import axios from "axios";
import {
  Administrator,
  Agent,
  Director,
  Parent,
  Student,
  Teacher,
} from "../Constants/userRoles";

function mapUserData(user: any) {
  if (user.role == Director) {
    user.userData = user.director;
    delete user.director;
  } else if (user.role == Administrator) {
    user.userData = user.administrator;
    delete user.administrator;
  } else if (user.role == Teacher) {
    user.userData = user.teacher;
    delete user.teacher;
  } else if (user.role == Agent) {
    user.userData = user.agent;
    delete user.agent;
  } else if (user.role == Parent) {
    user.userData = user.parent;
    delete user.parent;
  } else if (user.role == Student) {
    user.userData = user.student;
    delete user.student;
  }
}

export async function getUsers() {
  try {
    const { data } = await axios.get(`${BASE_URL}/users`);
    data.forEach((user) => {
      mapUserData(user);
    });

    return data;
  } catch (error) {
    Toast.show("Erreur lors de la récupération des utilisateurs", {
      type: "danger",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "red",
    });
  }
}

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

interface ChangePasswordProps {
  oldPassword: string;
  newPassword: string;
}
export async function changePassword({
  oldPassword,
  newPassword,
}: ChangePasswordProps) {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/change-password`, {
      oldPassword,
      newPassword,
    });

    Toast.show("Mot de passe modifié avec succès", {
      type: "success",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "green",
    });

    return data;
  } catch (error) {
    let message = "Erreur lors de la modification du mot de passe";

    if (error?.response?.status === 421) {
      message = "Ancien mot de passe incorrect";
    }

    Toast.show(message, {
      type: "danger",
      placement: "bottom",
      duration: 2000,
      animationType: "zoom-in",
      successColor: "red",
    });
  }
}
