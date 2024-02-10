import { View, Text } from "react-native";
import React from "react";
import Navigation from "./navigation/Navigation";
import { Provider as UserProvider } from "./context/UserContext";

export default function App() {
  return (
    // Run the command expo run:android to start the project
    <UserProvider>
      <Navigation />
    </UserProvider>
  );
}
