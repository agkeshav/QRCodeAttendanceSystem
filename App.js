import { View, Text } from "react-native";
import React from "react";
import Navigation from "./navigation/Navigation";
import { Provider as UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <Navigation />
    </UserProvider>
  );
}
