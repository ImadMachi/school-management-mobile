import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

axios.interceptors.request.use(
  async (config) => {
    const authToken = await AsyncStorage.getItem("accessToken");
    if (authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
