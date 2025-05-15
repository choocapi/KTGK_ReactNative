import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth, firestore } from "@/config/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { AuthContextType, UserType } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(firestore, "users", uid));
      if (userDoc.exists()) {
        const userData = { ...userDoc.data(), uid } as UserType;
        setUser(userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userData = await fetchUserData(res.user.uid);

      if (!userData) {
        return {
          success: false,
          msg: "Không thể lấy thông tin người dùng",
        };
      }

      return {
        success: true,
        msg: "Đăng nhập thành công!",
        role: userData.role,
      };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-credential)"))
        msg = "Email hoặc mật khẩu không chính xác";
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Mạng không ổn định";
      return { success: false, msg };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(firestore, "users", res.user.uid), {
        name,
        email,
        uid: res.user.uid,
        role: "customer",
      });
      setUser({ name, email, uid: res.user.uid, role: "customer" });
      return { success: true, msg: "Đăng ký thành công!" };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/email-already-in-use)")) msg = "Email đã tồn tại";
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Mạng không ổn định";
      return { success: false, msg };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, msg: "Email đặt lại mật khẩu đã được gửi!" };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/user-not-found)")) msg = "Email không tồn tại";
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Mạng không ổn định";
      return { success: false, msg };
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      if (!auth.currentUser) throw new Error("Không tìm thấy người dùng");
      const res = await reauthenticateWithCredential(
        auth.currentUser,
        EmailAuthProvider.credential(user?.email!, oldPassword)
      );
      if (!res.user) {
        return {
          success: false,
          msg: "Mật khẩu cũ không chính xác",
        };
      }
      await updatePassword(res.user, newPassword);
      return { success: true, msg: "Cập nhật mật khẩu thành công!" };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/requires-recent-login)"))
        msg = "Vui lòng đăng nhập lại để thực hiện thao tác này";
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Mạng không ổn định";
      return { success: false, msg };
    }
  };

  const updateUserInfo = async (
    uid: string,
    data: {
      name?: string;
      email?: string;
      role?: string;
    }
  ) => {
    try {
      await updateDoc(doc(firestore, "users", uid), data);
      if (user) {
        setUser({
          ...user,
          ...data,
        });
      }
      return { success: true, msg: "Cập nhật thông tin thành công!" };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Mạng không ổn định";
      return { success: false, msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        resetPassword,
        changePassword,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
