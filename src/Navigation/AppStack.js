import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigation from "./BottomTabNavigation";
import AboutUs from "../Components/Screens/AboutUs/AboutUs";
import Setting from "../Components/Screens/Setting/Setting";
import CustomDrawer from "../Components/Custom/CustomDrawer";
import { Ionicons, MaterialIcons, Entypo, Fontisto } from "@expo/vector-icons";
import BlogNavigation from "./BlogNavigation";
import ContactUs from "../Components/Screens/ContactUs/ContactUs";
import EventNavigation from "./EventNavigation";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import {
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import CourseDetails from "../Components/Screens/CourseDetails/CourseDetails";
import HomeNavigation from "./HomeNavigation";
import Profile from "../Components/Screens/Profile/Profile";
import Home from "../Components/Screens/Home/Home";

const Drawer = createDrawerNavigator();

const AppStack = () => {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home Page"
        component={Home}
        options={{
          drawerIcon: () => <Entypo name="home" size={22} color={"gray"} />,
          drawerLabelStyle: {
            fontFamily: "Nunito_600SemiBold",
            marginLeft: -20,
          },
          title: "Accueil",
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: () => <Entypo name="user" size={22} color={"gray"} />,
          drawerLabelStyle: {
            fontFamily: "Nunito_600SemiBold",
            marginLeft: -20,
          },
          title: "Profile",
        }}
      />
      <Drawer.Screen
        name="Contact"
        component={ContactUs}
        options={{
          drawerIcon: () => (
            <MaterialIcons name="contact-page" size={22} color={"gray"} />
          ),
          drawerLabelStyle: {
            fontFamily: "Nunito_600SemiBold",
            marginLeft: -20,
          },
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={Setting}
        options={{
          headerShown: false,
          title: "Details",
          drawerLabel: () => null,
          drawerItemStyle: { height: 0 },
          display: "none",
        }}
      />

      <Drawer.Screen
        name="Message Details"
        component={CourseDetails}
        options={{
          headerShown: false,
          title: "Details",
          drawerLabel: () => null,
          drawerItemStyle: { height: 0 },
          display: "none",
        }}
      />

      {/* <Drawer.Screen
        name="About"
        component={AboutUs}
        options={{
          drawerIcon: () => (
            <MaterialIcons name="error" size={22} color={"gray"} />
          ),
          drawerLabelStyle: {
            fontFamily: "Nunito_600SemiBold",
            marginLeft: -20,
          },
        }}
      />
      <Drawer.Screen
        name="Blogs"
        component={BlogNavigation}
        options={{
          drawerIcon: () => (
            <Fontisto name="blogger" size={21} color={"gray"} />
          ),
          drawerLabelStyle: {
            fontFamily: "Nunito_600SemiBold",
            marginLeft: -20,
          },
        }}
      />
      <Drawer.Screen
        name="Events"
        component={EventNavigation}
        options={{
          drawerIcon: () => (
            <MaterialIcons name="event" size={24} color={"gray"} />
          ),
          drawerLabelStyle: {
            fontFamily: "Nunito_600SemiBold",
            marginLeft: -20,
          },
        }}
      />
      
       */}
    </Drawer.Navigator>
  );
};

export default AppStack;
