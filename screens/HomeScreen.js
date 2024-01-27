"use strict";
import { View, Text, Button, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import api from "../api/api";
import LoadingScreen from "./LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen({ route }) {
  const [who, setWho] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/");
      // console.log(response.data.data);
      setWho(response.data.role);
      // console.log(who);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogOut = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem("token");
      navigation.replace("ChooseScreen");
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return loading ? (
    <LoadingScreen />
  ) : (
    <View
      style={{
        display: "flex",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Button
        title="Log out"
        onPress={() => {
          handleLogOut();
        }}
      />
      <Button
        title="SCAN QR CODE"
        onPress={() => {
          navigation.navigate("ScanQrScreen");
        }}
      />
      {route.params && route.params[0] && <Text>{route.params[0].value}</Text>}
    </View>
  );
}
