import { View, Text, Button, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Context as UserContext } from "../context/UserContext";
import LoadingScreen from "./LoadingScreen";
import api from "../api/api";

export default function TakeAttendance() {
  const {
    state: { teacherId },
    updateTeacherId,
  } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  let cnt = 1;
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

  return loading ? (
    <LoadingScreen />
  ) : (
    <View>
      <Text>TakeAttendane</Text>
      <TouchableOpacity
        onPress={() => {
          handleLogOut();
        }}
        style={{
          height: 250,
          width: 200,
          borderColor: "black",
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text> Log ut</Text>
      </TouchableOpacity>
    </View>
  );
}
