import { auth } from "@/config/firebase";
import { useState } from "react";
import { Divider, Drawer } from "react-native-paper";

const CustomDrawerBar = ({ navigation }: { navigation: any }) => {
  const [active, setActive] = useState("");
  const handleLogout = () => {
    auth.signOut();
    navigation.navigate("Login");
  };
  return (
    <Drawer.Section title="Admin">
      <Drawer.Item
        label="Profile"
        icon="account"
        active={active === "Profile"}
        onPress={() => {
          navigation.navigate("Profile");
          setActive("Profile");
        }}
      />
      <Divider />
      <Drawer.Item label="Logout" icon="logout" onPress={handleLogout} />
    </Drawer.Section>
  );
};

export default CustomDrawerBar;
