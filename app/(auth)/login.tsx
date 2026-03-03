/**
 * Driver Login Screen
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/config";
import { useAuthStore } from "@/stores/auth";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      Alert.alert("Login Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>LaMa</Text>
          <Text style={styles.subtitle}>Driver</Text>
          <Text style={styles.tagline}>Start earning today</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.grayLight}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.grayLight}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.registerText}>
              Don't have an account?{" "}
              <Text style={styles.registerBold}>Register as Driver</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    fontSize: 42,
    fontWeight: "800",
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.dark,
    marginTop: 4,
  },
  tagline: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 8,
  },
  form: {
    gap: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.dark,
    backgroundColor: Colors.lightBg,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  loginBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
  registerLink: {
    alignItems: "center",
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
    color: Colors.gray,
  },
  registerBold: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
