import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "@/utils/colors";
import { formatCurrency } from "@/utils/common";

const PaymentScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const total = route?.params?.totalPay ?? 100000;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thanh toán thành công</Text>
      <View style={styles.content}>
        <Text style={styles.successTitle}>Giao dịch thành công!</Text>
        <View style={styles.iconCircle}>
          <MaterialIcons name="check" size={90} color="#4BB543" />
        </View>
        <Text style={styles.successMsg}>
          Thanh toán của bạn đã được chấp nhận!
        </Text>
        <Text style={styles.amount}>{formatCurrency(total)}</Text>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Home")}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
  },
  header: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 12,
    marginTop: 0,
    textAlign: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 0,
  },
  successTitle: {
    color: "#4BB543",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 18,
    textAlign: "center",
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: "#4BB543",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  successMsg: {
    color: "#4BB543",
    fontSize: 17,
    marginBottom: 28,
    textAlign: "center",
  },
  amount: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 36,
    marginBottom: 36,
    textAlign: "center",
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: "center",
    marginBottom: 40,
    width: "90%",
    elevation: 3,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
    letterSpacing: 0.5,
  },
});
