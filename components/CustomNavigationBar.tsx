import React, { useState } from "react";
import { getHeaderTitle } from "@react-navigation/elements";
import { Appbar, Menu, Badge } from "react-native-paper";
import colors from "@/utils/colors";
import { Alert, View } from "react-native";
import { useAuth } from "@/contexts/authContext";
import { auth } from "@/config/firebase";

const CustomNavigationBar = ({ navigation, route, options, back }: any) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const title = getHeaderTitle(options, route.name);
  const { user } = useAuth();
  const cartCount = 3;

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        onPress: () => {
          auth.signOut();
        },
        style: "destructive",
      },
    ]);
  };

  const isHome = route.name === "Home";
  const isListDishOrDetails =
    route.name === "ListDish" || route.name === "DishDetails";
  const isCart = route.name === "Cart";

  return (
    <Appbar.Header
      style={{ backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 }}
    >
      {isHome ? (
        <Appbar.Action icon="menu" color={colors.black} onPress={() => {}} />
      ) : (
        <Appbar.BackAction onPress={navigation.goBack} color={colors.black} />
      )}
      <Appbar.Content
        title={title}
        titleStyle={{
          color: colors.primary,
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
        }}
        style={{ alignItems: "center" }}
      />
      {/* Cart icon với badge */}
      <View style={{ marginRight: 8 }}>
        <Appbar.Action
          icon="cart"
          color={colors.greyDark}
          onPress={() => navigation.navigate("Cart")}
        />
        {cartCount > 0 && (
          <Badge
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              backgroundColor: colors.primary,
            }}
            size={18}
          >
            {cartCount}
          </Badge>
        )}
      </View>
      {/* Logout icon */}
      {user ? (
        <Appbar.Action
          icon="logout"
          color={colors.greyDark}
          onPress={handleLogout}
        />
      ) : (
        <Appbar.Action
          icon="account"
          color={colors.greyDark}
          onPress={() => navigation.navigate("Login")}
        />
      )}
    </Appbar.Header>
  );
};

export default CustomNavigationBar;
