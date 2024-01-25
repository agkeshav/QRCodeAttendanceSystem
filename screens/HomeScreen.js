"use strict";
import { View, Text, Button, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import api from "../api/api";
import LoadingScreen from "./LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useCameraDevice } from "react-native-vision-camera";

export default function HomeScreen() {
  const [who, setWho] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const device = useCameraDevice("back");

  if (device == null) return <NoCameraDeviceError />;
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
      <Text>{who}</Text>
      {/* <Button
        title="Log out"
        onPress={() => {
          handleLogOut();
        }}
      /> */}
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
    </View>
  );
}
