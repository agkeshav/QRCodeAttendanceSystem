"use strict";
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo } from "react-native-vector-icons";
import api from "../api/api";
import LoadingScreen from "./LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen({ route }) {
  const [who, setWho] = useState();
  const [isLogOutVisible, setIsLogOutVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rollNo, setRollNo] = useState();
  const navigation = useNavigation();
  const getData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/");
      // console.log(response);
      setRollNo(response.data.data.rollNo);
      setWho(response.data.role);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleLogOut = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("who");
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
        flexDirection: "column",
      }}
    >
      <StatusBar backgroundColor={"#EF9E1C"} />
      <View
        style={{
          backgroundColor: "#EF9E1C",
          height: 45,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Entypo
          name="dots-three-vertical"
          size={20}
          color="white"
          style={{ marginRight: 10 }}
          onPress={() => {
            setIsLogOutVisible(!isLogOutVisible);
          }}
        />
      </View>
      {isLogOutVisible ? (
        <View
          style={{
            backgroundColor: "gray",
            width: 70,
            height: 38,
            alignSelf: "flex-end",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white" }} onPress={() => handleLogOut()}>
            Log Out
          </Text>
        </View>
      ) : null}
      <TouchableOpacity
        style={[
          styles.touchableOpacity,
          {
            backgroundColor: "#EF9E1C",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
        onPress={() => {
          navigation.navigate("ScanQrScreen", rollNo);
        }}
      >
        <Text style={{ fontSize: 16, color: "white" }}>SCAN QR CODE</Text>
      </TouchableOpacity>
      {/* {route.params && route.params.codes[0].value && (
        <Text>{route.params.codes[0].value}</Text>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  touchableOpacity: {
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "bold",
    marginTop: 10,
    marginHorizontal: 15,
    borderColor: "gray",
    borderWidth: 1,
    justifyContent: "center",
  },
});
