/**
 * LaMa Yatayat Driver - Auth Store (Zustand)
 */

import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { post, setStoredToken, clearStoredToken, getStoredToken, get } from "@/services/api";
import type { AuthResponse, LoginInput, RegisterInput, User, DriverProfile, OnboardInput } from "@/lib/types";

const TOKEN_KEY = "lama_driver_access_token";
const USER_KEY = "lama_driver_user";

interface AuthState {
  user: User | null;
  driverProfile: DriverProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  onboard: (input: OnboardInput) => Promise<void>;
  fetchDriverProfile: () => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, getState) => ({
  user: null,
  driverProfile: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const body: LoginInput = { email, password };
      const data = await post<AuthResponse>("/api/v1/auth/login", body, { token: null });

      const token = data?.access_token;
      const user = data?.user;
      if (!token || typeof token !== "string") {
        throw new Error("Invalid login response: missing access token");
      }

      await setStoredToken(token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user ?? {}));

      set({
        user: user ?? null,
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  register: async (name: string, email: string, phone: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const body: RegisterInput = { name, email, phone, password, role: "driver" };
      const data = await post<AuthResponse>("/api/v1/auth/register", body, { token: null });

      const token = data?.access_token;
      const user = data?.user;
      if (!token || typeof token !== "string") {
        throw new Error("Invalid register response: missing access token");
      }

      await setStoredToken(token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user ?? {}));

      set({
        user: user ?? null,
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  onboard: async (input: OnboardInput) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await post<DriverProfile>("/api/v1/drivers/onboard", input);
      set({ driverProfile: profile, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Onboarding failed";
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  fetchDriverProfile: async () => {
    try {
      const user = getState().user;
      if (!user) return;
      const profile = await get<DriverProfile>(`/api/v1/drivers/${user.id}/profile`);
      set({ driverProfile: profile });
    } catch {
      // Profile may not exist yet (pre-onboarding)
    }
  },

  logout: async () => {
    await clearStoredToken();
    await SecureStore.deleteItemAsync(USER_KEY);
    set({
      user: null,
      driverProfile: null,
      accessToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  hydrate: async () => {
    try {
      const token = await getStoredToken();
      const userJson = await SecureStore.getItemAsync(USER_KEY);

      if (token && userJson) {
        const user: User = JSON.parse(userJson);

        try {
          const freshUser = await get<User>("/api/v1/auth/me", { token });
          set({
            user: freshUser,
            accessToken: token,
            isAuthenticated: true,
            isHydrated: true,
          });
          return;
        } catch {
          // Token may be expired
        }

        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },

  setError: (error: string | null) => set({ error }),
}));
