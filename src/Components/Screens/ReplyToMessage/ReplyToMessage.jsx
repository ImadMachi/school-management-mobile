import { ScrollView } from "react-native";
import ContactForm from "./Form";
import { styles } from "../../Styles/ContactScreenStyles/ContactMain.styles";
import { LinearGradient } from "expo-linear-gradient";
import CustomDrawerHeader from "../../Custom/CustomDrawerHeader";
import { useRoute } from "@react-navigation/native";

const ReplyToMessage = () => {
  const router = useRoute();
  const { replyData } = router.params;
  return (
    <>
      <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
        <CustomDrawerHeader>Répondre</CustomDrawerHeader>
        <ScrollView>
          <ContactForm replyData={replyData} />
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default ReplyToMessage;
