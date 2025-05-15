export const formatCurrency = (value: number) => {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export const imageMap: Record<string, any> = {
  "chinese.png": require("@/assets/images/chinese.png"),
  "south-indian.png": require("@/assets/images/south-indian.png"),
  "beverages.png": require("@/assets/images/beverages.png"),
  "north-indian.png": require("@/assets/images/north-indian.png"),
  "pizza.png": require("@/assets/images/pizza.png"),
  "biryani.png": require("@/assets/images/biryani.png"),
};
