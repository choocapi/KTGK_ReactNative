import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { DishType } from "@/types";
import colors from "@/utils/colors";
import { formatCurrency, imageMap } from "@/utils/common";

const ListDishScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { category } = route.params;
  const [dishes, setDishes] = useState<DishType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(firestore, "dishes"),
          where("category", "==", category)
        );
        const querySnapshot = await getDocs(q);
        const data: DishType[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as DishType);
        });
        setDishes(data);
      } catch (error) {
        setDishes([]);
      }
      setLoading(false);
    };
    fetchDishes();
  }, [category]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách món: {category}</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 32 }}
        />
      ) : (
        <FlatList
          data={dishes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("DishDetails", { id: item.id })
              }
            >
              <Image
                source={
                  imageMap[item.imageUrl || ""] ||
                  require("@/assets/images/placeholder-food.png")
                }
                style={styles.image}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.dishName}>{item.name}</Text>
                <Text style={styles.dishPrice}>
                  {formatCurrency(item.price)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 32 }}>
              Không có món nào.
            </Text>
          }
        />
      )}
    </View>
  );
};

export default ListDishScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 8,
    marginLeft: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  dishName: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  dishPrice: {
    color: colors.greyDark,
    fontSize: 15,
    marginTop: 2,
  },
});
