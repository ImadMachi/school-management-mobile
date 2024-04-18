import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import ContactForm from "./Form";
import { styles } from "../../Styles/ContactScreenStyles/ContactMain.styles";
import AnimatedLoading from "../../Shared/AnimatedLoading/AnimatedLoading";
import { LinearGradient } from "expo-linear-gradient";
import CustomDrawerHeader from "../../Custom/CustomDrawerHeader";

const DeclareAbsence = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {isLoading ? (
        <AnimatedLoading />
      ) : (
        <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={styles.container}
        >
          <CustomDrawerHeader>Declarer une absence</CustomDrawerHeader>
          <ScrollView>
            <ContactForm />
          </ScrollView>
        </LinearGradient>
      )}
    </>
  );
};

export default DeclareAbsence;
