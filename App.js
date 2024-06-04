import { ToastProvider } from "react-native-toast-notifications";
import AppNavigation from "./src/Navigation/AppNavigation";
import AuthProvider from "./src/Context/AuthProvider";
import { StatusBar } from "react-native";
import "./src/Config/axios-interceptor";
// import "./background-notifications";

export default function App() {
  return (
    <AuthProvider>
      <StatusBar backgroundColor={"#E5ECF9"} barStyle="dark-content" />
      <ToastProvider duration={50}>
        <AppNavigation />
      </ToastProvider>
    </AuthProvider>
  );
}
