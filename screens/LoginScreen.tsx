import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Button, HelperText, TextInput } from "react-native-paper";
import colors from "@/utils/colors";
import { useAuth } from "@/contexts/authContext";
import { Image } from "expo-image";

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msgHelperEmail, setMsgHelperEmail] = useState("");
  const [msgHelperPassword, setMsgHelperPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length == 0) {
      setMsgHelperEmail("Email is required");
      return true;
    } else if (!emailRegex.test(email)) {
      setMsgHelperEmail("Email is invalid");
      return true;
    } else {
      setMsgHelperEmail("");
      return false;
    }
  };

  const validatePassword = (password: string) => {
    if (password.length == 0) {
      setMsgHelperPassword("Password is required");
      return true;
    } else if (password.length < 8) {
      setMsgHelperPassword("Password must be at least 8 characters long");
      return true;
    } else {
      setMsgHelperPassword("");
      return false;
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const isEmailError = validateEmail(email);
    const isPasswordError = validatePassword(password);
    setEmailError(isEmailError);
    setPasswordError(isPasswordError);
    if (isEmailError || isPasswordError) {
      Alert.alert("Cảnh báo", "Vui lòng nhập đầy đủ thông tin!");
      setIsLoading(false);
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      Alert.alert("Thành công", res.msg, [
        {
          text: "Ok",
          onPress: () => {
            navigation.navigate("StackNav");
          },
        },
      ]);
    } else {
      Alert.alert("Lỗi", res.msg);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant App</Text>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Test@gmail.com"
          mode="flat"
          value={email}
          onChangeText={(email) => {
            setEmail(email);
            setEmailError(validateEmail(email));
          }}
          style={styles.input}
          underlineColor={colors.greyLight}
          placeholderTextColor={colors.greyLight}
          theme={{ colors: { text: colors.greyDark, primary: colors.primary } }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <HelperText type="error" visible={emailError}>
          {msgHelperEmail}
        </HelperText>
        <TextInput
          placeholder="Password"
          mode="flat"
          value={password}
          onChangeText={(password) => {
            setPassword(password);
            setPasswordError(validatePassword(password));
          }}
          style={styles.input}
          underlineColor={colors.greyLight}
          placeholderTextColor={colors.greyLight}
          theme={{ colors: { text: colors.greyDark, primary: colors.primary } }}
          secureTextEntry
        />
        <HelperText type="error" visible={passwordError}>
          {msgHelperPassword}
        </HelperText>
        <TouchableOpacity
          style={styles.forgotContainer}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
        <Button
          mode="contained"
          style={styles.signInBtn}
          labelStyle={styles.signInText}
          loading={isLoading}
          disabled={isLoading}
          onPress={handleLogin}
        >
          Sign In
        </Button>
        <Button
          mode="contained"
          style={styles.signUpBtn}
          labelStyle={styles.signUpText}
          onPress={() => navigation.navigate("Register")}
        >
          Sign Up
        </Button>
      </View>
      <View style={styles.groupInfoBox}>
        <Text style={styles.groupInfoText}>
          Châu Minh Đương - 2124802010036{"\n"}
          Phan Minh Đại - 2124802010236{"\n"}
          Lê Minh Trí - 2124802010164
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    marginTop: 48,
    marginBottom: 100,
    fontFamily: "System",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "transparent",
    marginBottom: 8,
    fontSize: 16,
  },
  forgotContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  forgotText: {
    color: colors.pending,
    fontSize: 15,
    fontWeight: "500",
  },
  signInBtn: {
    width: "100%",
    backgroundColor: colors.default,
    borderRadius: 25,
    marginBottom: 16,
    paddingVertical: 6,
  },
  signInText: {
    color: colors.signInText,
    fontWeight: "bold",
    fontSize: 18,
  },
  signUpBtn: {
    width: "100%",
    backgroundColor: colors.blue,
    borderRadius: 25,
    paddingVertical: 6,
  },
  signUpText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 18,
  },
  groupInfoBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  groupInfoText: {
    color: colors.primary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 20,
  },
});
