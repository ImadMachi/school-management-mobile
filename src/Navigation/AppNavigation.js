import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { AuthContext } from "../Context/AuthProvider";
import AppStack from "./AppStack";

const AppNavigation = () => {
  const { token, user } = useContext(AuthContext);
  return (
    <NavigationContainer>
      {token !== null ? <AppStack userRole={user?.role} /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;
