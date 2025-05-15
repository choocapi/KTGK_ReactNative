import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import colors from "@/utils/colors";

const CUISINES = [
  {
    name: "Chinese",
    image: require("@/assets/images/chinese.png"),
  },
  {
    name: "South Indian",
    image: require("@/assets/images/south-indian.png"),
  },
  {
    name: "Beverages",
    image: require("@/assets/images/beverages.png"),
  },
  {
    name: "North India",
    image: require("@/assets/images/north-indian.png"),
  },
  {
    name: "Pizza",
    image: require("@/assets/images/pizza.png"),
  },
  {
    name: "Rice",
    image: require("@/assets/images/biryani.png"),
  },
];

const ITEM_WIDTH = (Dimensions.get("window").width - 60) / 2;

const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cuisine</Text>
      <FlatList
        data={CUISINES}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("ListDish", { category: item.name })
            }
          >
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.cuisineName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;

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
    fontSize: 22,
    marginVertical: 8,
    marginLeft: 4,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: ITEM_WIDTH,
    paddingVertical: 18,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  image: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  cuisineName: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
