import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../Components/Utils/BASE_URL";
import { Toast } from "react-native-toast-notifications";
import { Parent, Student } from "../Constants/userRoles";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.role !== Student && response.data.role !== Parent) {
        throw new Error("Invalid user role");
      }
      const userData = modifyUserData(response.data);

      setUser(userData);
      setToken(token);

      await AsyncStorage.multiSet([
        ["user", JSON.stringify(userData)],
        ["accessToken", token],
      ]);
    } catch (error) {
      Toast.show("Erreur d'identification", {
        type: "warning",
        placement: "bottom",
        duration: 2000,
        animationType: "zoom-in",
        successColor: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("accessToken");
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem("user");
      let userToken = await AsyncStorage.getItem("accessToken");
      userInfo = JSON.parse(userInfo);
      if (userInfo) {
        setToken(userToken);
        setUser(userInfo);
      }
      setIsLoading(false);
    } catch (e) {
      Toast.show("Erreur d'identification", {
        type: "warning",
        placement: "bottom",
        duration: 2000,
        animationType: "zoom-in",
        successColor: "red",
      });
    }
  };

  const modifyUserData = (data) => {
    if (data.role === Student) {
      data.userData = JSON.parse(JSON.stringify(data.student));
      delete data.student;
    } else if (data.role === Parent) {
      data.userData = JSON.parse(JSON.stringify(data.parent));
      delete data.parent;
    }
    return data;
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, isLoading, setIsLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
