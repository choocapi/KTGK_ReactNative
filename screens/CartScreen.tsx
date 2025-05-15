import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import { formatCurrency, imageMap } from "@/utils/common";
import colors from "@/utils/colors";
import { MaterialIcons } from "@expo/vector-icons";

const TAX_RATE = 0.08;
const DELIVERY_FEE = 30_000;
const OFFER_DISCOUNT = 18_000;

const CartScreen = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const cartRef = doc(firestore, "carts", user.uid);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        const items = cartSnap.data().items || [];
        const dishPromises = items.map(async (item: any) => {
          const dishRef = doc(firestore, "dishes", item.dishId);
          const dishSnap = await getDoc(dishRef);
          return dishSnap.exists()
            ? { ...item, dish: { id: dishSnap.id, ...dishSnap.data() } }
            : null;
        });
        const dishes = await Promise.all(dishPromises);
        setCartItems(dishes.filter(Boolean));
      } else {
        setCartItems([]);
      }
    } catch (e) {
      setCartItems([]);
    }
    setLoading(false);
  };

  const updateCart = async (newItems: any[]) => {
    if (!user) return;
    setUpdating(true);
    try {
      const cartRef = doc(firestore, "carts", user.uid);
      await updateDoc(cartRef, {
        items: newItems.map((i) => ({
          dishId: i.dish.id,
          quantity: i.quantity,
        })),
      });
      fetchCart();
    } catch (e) {
      Alert.alert("Lỗi", "Không thể cập nhật giỏ hàng!");
    }
    setUpdating(false);
  };

  const handleChangeQty = (idx: number, delta: number) => {
    const newItems = [...cartItems];
    newItems[idx].quantity += delta;
    if (newItems[idx].quantity < 1) newItems[idx].quantity = 1;
    updateCart(newItems);
  };

  const handleRemove = (idx: number) => {
    const newItems = cartItems.filter((_, i) => i !== idx);
    updateCart(newItems);
  };

  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );
  const taxes = itemsTotal * TAX_RATE;
  const totalPay = itemsTotal - OFFER_DISCOUNT + taxes + DELIVERY_FEE;

  const handlePay = async () => {
    if (!user) return;
    try {
      const orderId = `${user.uid}_${Date.now()}`;
      await setDoc(doc(firestore, "orders", orderId), {
        id: orderId,
        userId: user.uid,
        items: cartItems.map((item) => ({
          dish: item.dish,
          quantity: item.quantity,
        })),
        total: totalPay,
        status: "pending",
        createdAt: new Date(),
      });
      await deleteDoc(doc(firestore, "carts", user.uid));
      navigation.navigate("Payment", { totalPay });
      setCartItems([]);
    } catch (e) {
      Alert.alert("Lỗi", "Không thể hoàn tất thanh toán!");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemRow}>
            <Image
              source={
                imageMap[item.dish.imageUrl || ""] ||
                require("@/assets/images/placeholder-food.png")
              }
              style={styles.itemImg}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.dish.name}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  onPress={() => handleChangeQty(index, -1)}
                  disabled={updating}
                  style={styles.qtyBtn}
                >
                  <MaterialIcons
                    name="remove"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => handleChangeQty(index, 1)}
                  disabled={updating}
                  style={styles.qtyBtn}
                >
                  <MaterialIcons name="add" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRemove(index)}
                  disabled={updating}
                  style={styles.removeBtn}
                >
                  <MaterialIcons
                    name="delete"
                    size={20}
                    color={colors.cancelled}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.itemPrice}>
              {formatCurrency(item.dish.price * item.quantity)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 32 }}>
            Giỏ hàng trống.
          </Text>
        }
        style={{ flex: 1 }}
      />
      {/* Bill Receipt */}
      <View style={styles.billBox}>
        <Text style={styles.billTitle}>Hoá đơn</Text>
        <View style={styles.billRow}>
          <Text>Tạm tính</Text>
          <Text>{formatCurrency(itemsTotal)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text>Khuyến mãi</Text>
          <Text>-{formatCurrency(OFFER_DISCOUNT)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text>Thuế (8%)</Text>
          <Text>{formatCurrency(taxes)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text>Phí giao hàng</Text>
          <Text>{formatCurrency(DELIVERY_FEE)}</Text>
        </View>
        <View style={styles.billRowTotal}>
          <Text style={{ fontWeight: "bold" }}>Tổng cộng</Text>
          <Text style={{ fontWeight: "bold", color: colors.primary }}>
            {formatCurrency(totalPay)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handlePay}
          disabled={cartItems.length === 0}
        >
          <Text style={styles.payBtnText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: colors.greyLight,
    backgroundColor: "#fafafa",
  },
  itemImg: {
    width: 48,
    height: 48,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  itemName: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  qtyBtn: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: colors.default,
    marginHorizontal: 2,
  },
  qtyText: {
    minWidth: 24,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  removeBtn: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 4,
    backgroundColor: colors.default,
  },
  itemPrice: {
    fontWeight: "bold",
    fontSize: 15,
    color: colors.primary,
    marginLeft: 8,
  },
  billBox: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: colors.greyLight,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
  },
  billTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: colors.primary,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  billRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 12,
  },
  payBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  payBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
