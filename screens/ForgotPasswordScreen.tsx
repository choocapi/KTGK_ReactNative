import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { TextInput, Button, HelperText } from "react-native-paper";
import colors from "@/utils/colors";
import { useAuth } from "@/contexts/authContext";

const ForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [msgHelperEmail, setMsgHelperEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleResetPassword = async () => {
    const isEmailError = validateEmail(email);
    setEmailError(isEmailError);
    if (!isEmailError) {
      try {
        setIsLoading(true);
        const result = await resetPassword(email);
        if (result.success) {
          Alert.alert("Thành công", result.msg, [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ]);
        } else {
          Alert.alert("Lỗi", result.msg);
        }
      } catch (error) {
        Alert.alert("Lỗi", "Đã xảy ra lỗi");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Enter your email"
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
          disabled={isLoading}
        />
        <HelperText type="error" visible={emailError}>
          {msgHelperEmail}
        </HelperText>
        <Button
          mode="contained"
          onPress={handleResetPassword}
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
          labelStyle={styles.buttonText}
        >
          Send reset password
        </Button>
      </View>
      <View style={styles.linkContainer}>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate("Login")}
          disabled={isLoading}
        >
          <Text style={styles.linkText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

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
  button: {
    width: "100%",
    backgroundColor: colors.blue,
    borderRadius: 25,
    marginTop: 16,
    paddingVertical: 6,
  },
  buttonText: {
    color: colors.white,
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
    fontWeight: "bold",
  },
});
