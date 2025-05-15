import { Timestamp } from "firebase/firestore";

export type UserType = {
  uid: string;
  email: string;
  name?: string;
  imageUrl?: string;
  role?: string;
};

export type AuthContextType = {
  user: UserType | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg: string; role?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; msg: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; msg: string }>;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; msg: string }>;
  updateUserInfo: (
    uid: string,
    data: {
      name?: string;
      email?: string;
      role?: string;
      imageUrl?: string;
    }
  ) => Promise<{ success: boolean; msg: string }>;
};

export type DishType = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  category: string;
  available?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type CartItemType = {
  dish: DishType;
  quantity: number;
};

export type OrderType = {
  id: string;
  userId: string;
  items: CartItemType[];
  total: number;
  status: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};
