import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { HelperText, Button, TextInput } from "react-native-paper";
import colors from "@/utils/colors";
import { useAuth } from "@/contexts/authContext";

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msgHelperEmail, setMsgHelperEmail] = useState("");
  const [msgHelperName, setMsgHelperName] = useState("");
  const [msgHelperPassword, setMsgHelperPassword] = useState("");
  const [msgHelperConfirmPassword, setMsgHelperConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

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

  const validateName = (name: string) => {
    if (name.length == 0) {
      setMsgHelperEmail("Name is required");
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

  const validateConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword.length == 0) {
      setMsgHelperConfirmPassword("Confirm password is required");
      return true;
    } else if (confirmPassword !== password) {
      setMsgHelperConfirmPassword("Passwords do not match");
      return true;
    } else {
      setMsgHelperConfirmPassword("");
      return false;
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    const isEmailError = validateEmail(email);
    const isPasswordError = validatePassword(password);
    const isConfirmPasswordError = validateConfirmPassword(confirmPassword);
    setEmailError(isEmailError);
    setPasswordError(isPasswordError);
    setConfirmPasswordError(isConfirmPasswordError);
    if (isEmailError && isPasswordError && isConfirmPasswordError) {
      Alert.alert("Cảnh báo", "Vui lòng nhập đầy đủ thông tin!");
      setIsLoading(false);
      return;
    }

    const res = await register(email, password, name);
    if (res.success) {
      Alert.alert("Thành công", res.msg, [
        {
          text: "Ok",
          onPress: () => navigation.navigate("Login"),
          style: "destructive",
        },
      ]);
    } else {
      Alert.alert("Lỗi", res.msg);
    }
    setIsLoading(false);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.formContainer}>
          {/* input name */}
          <TextInput
            placeholder="Username"
            mode="flat"
            value={name}
            onChangeText={(name) => {
              setName(name);
              setNameError(validateName(name));
            }}
            style={styles.input}
            underlineColor={colors.greyLight}
            placeholderTextColor={colors.greyLight}
            theme={{
              colors: { text: colors.greyDark, primary: colors.primary },
            }}
            autoCapitalize="none"
          />
          <HelperText type="error" visible={nameError}>
            {msgHelperName}
          </HelperText>

          {/* input email */}
          <TextInput
            placeholder="Email"
            mode="flat"
            value={email}
            onChangeText={(email) => {
              setEmail(email);
              setEmailError(validateEmail(email));
            }}
            style={styles.input}
            underlineColor={colors.greyLight}
            placeholderTextColor={colors.greyLight}
            theme={{
              colors: { text: colors.greyDark, primary: colors.primary },
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <HelperText type="error" visible={emailError}>
            {msgHelperEmail}
          </HelperText>

          {/* input password */}
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
            theme={{
              colors: { text: colors.greyDark, primary: colors.primary },
            }}
            secureTextEntry
          />
          <HelperText type="error" visible={passwordError}>
            {msgHelperPassword}
          </HelperText>
          <TextInput
            placeholder="Confirm Password"
            mode="flat"
            value={confirmPassword}
            onChangeText={(confirmPassword) => {
              setConfirmPassword(confirmPassword);
              setConfirmPasswordError(validateConfirmPassword(confirmPassword));
            }}
            style={styles.input}
            underlineColor={colors.greyLight}
            placeholderTextColor={colors.greyLight}
            theme={{
              colors: { text: colors.greyDark, primary: colors.primary },
            }}
            secureTextEntry
          />
          <HelperText type="error" visible={confirmPasswordError}>
            {msgHelperConfirmPassword}
          </HelperText>
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Sign Up
          </Button>
        </View>
        <View style={styles.linkContainer}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.linkText}>Already have an account?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;

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
    textTransform: "capitalize",
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
  button: {
    width: "100%",
    backgroundColor: colors.default,
    borderRadius: 25,
    marginTop: 16,
    paddingVertical: 6,
  },
  buttonText: {
    color: colors.signInText,
    fontWeight: "bold",
    fontSize: 18,
  },
  linkContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  linkButton: {
    marginBottom: 8,
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
  },
});
