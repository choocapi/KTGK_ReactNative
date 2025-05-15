import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { DishType } from "@/types";
import colors from "@/utils/colors";
import { formatCurrency, imageMap } from "@/utils/common";
import { useAuth } from "@/contexts/authContext";
import { MaterialIcons } from "@expo/vector-icons";

const DishDetailsScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { id } = route.params;
  const [dish, setDish] = useState<DishType | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDish = async () => {
      setLoading(true);
      try {
        const docRef = doc(firestore, "dishes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDish({ id: docSnap.id, ...docSnap.data() } as DishType);
        } else {
          setDish(null);
        }
      } catch (error) {
        setDish(null);
      }
      setLoading(false);
    };
    fetchDish();
  }, [id]);

  const handleAddToCart = async () => {
    if (!dish) return;
    setAdding(true);
    try {
      const cartRef = doc(firestore, "carts", user?.uid || "");
      const cartSnap = await getDoc(cartRef);
      let newItem = { dishId: dish.id, quantity: 1 };
      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        let items = cartData.items || [];
        const idx = items.findIndex((item: any) => item.dishId === dish.id);
        if (idx > -1) {
          items[idx].quantity += 1;
        } else {
          items.push(newItem);
        }
        await updateDoc(cartRef, { items });
      } else {
        await setDoc(cartRef, { items: [newItem] });
      }
      Alert.alert("Thành công", "Đã thêm vào giỏ hàng!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng!");
    }
    setAdding(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!dish) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy món ăn.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        <Image
          source={
            imageMap[dish.imageUrl || ""] ||
            require("@/assets/images/placeholder-food.png")
          }
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.name}>{dish.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{formatCurrency(dish.price)} ₫</Text>
      </View>
      <View style={styles.descRow}>
        <MaterialIcons
          name="description"
          size={20}
          color={colors.greyDark}
          style={{ marginRight: 4 }}
        />
        <Text style={styles.desc}>{dish.description}</Text>
      </View>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={handleAddToCart}
        disabled={adding}
        activeOpacity={0.8}
      >
        {adding ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="add-shopping-cart"
              size={22}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.addBtnText}>Add to cart</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DishDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBox: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 12,
    backgroundColor: "#fafafa",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 160,
    height: 160,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: "bold",
    marginLeft: 2,
  },
  descRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
    maxWidth: 320,
  },
  desc: {
    fontSize: 16,
    color: colors.greyDark,
    textAlign: "left",
    flex: 1,
    flexWrap: "wrap",
  },
  addBtn: {
    backgroundColor: colors.blue,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: "center",
    marginTop: 12,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
