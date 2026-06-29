"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  userEmail: string | null;
  restaurantId: string | null;
  restaurantSlug: string | null;
  login: (email: string, id: string, slug: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantSlug, setRestaurantSlug] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserEmail(localStorage.getItem("tabletalk_user_email"));
      setRestaurantId(localStorage.getItem("tabletalk_restaurant_id"));
      setRestaurantSlug(localStorage.getItem("tabletalk_restaurant_slug"));
      setIsLoaded(true);
    }
  }, []);

  const login = (email: string, id: string, slug: string) => {
    localStorage.setItem("tabletalk_user_email", email);
    localStorage.setItem("tabletalk_restaurant_id", id);
    localStorage.setItem("tabletalk_restaurant_slug", slug);
    setUserEmail(email);
    setRestaurantId(id);
    setRestaurantSlug(slug);
  };

  const logout = () => {
    localStorage.removeItem("tabletalk_user_email");
    localStorage.removeItem("tabletalk_restaurant_id");
    localStorage.removeItem("tabletalk_restaurant_slug");
    setUserEmail(null);
    setRestaurantId(null);
    setRestaurantSlug(null);
    router.push("/signin");
  };

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{
      userEmail,
      restaurantId,
      restaurantSlug,
      login,
      logout,
      isAuthenticated: !!userEmail && !!restaurantId
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
