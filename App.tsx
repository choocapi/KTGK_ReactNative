import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import CustomNavigationBar from "./components/CustomNavigationBar";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerBar from "./components/CustomDrawerBar";
import { MaterialIcons } from "@expo/vector-icons";
import {
  CartScreen,
  DishDetailsScreen,
  ForgotPasswordScreen,
  HomeScreen,
  ListDishScreen,
  LoginScreen,
  PaymentScreen,
  ProfileScreen,
  RegisterScreen,
} from "./screens";
import { AuthProvider } from "./contexts/authContext";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const getTabBarIcon =
  (icon: any) =>
  ({ color }: any) =>
    <MaterialIcons name={icon} size={26} style={{ color }} />;

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="StackNav"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name="StackNav" component={StackNav} />
            <Stack.Screen name="DrawerNav" component={DrawerNav} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}

const StackNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: (props: any) => <CustomNavigationBar {...props} />,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ListDish" component={ListDishScreen} />
      <Stack.Screen name="DishDetails" component={DishDetailsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const DrawerNav = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props: any) => <CustomDrawerBar {...props} />}
    >
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};
