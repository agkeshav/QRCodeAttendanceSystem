import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Context as UserContext } from "../context/UserContext";
import LoadingScreen from "./LoadingScreen";
import api from "../api/api";
import { Entypo } from "react-native-vector-icons";
import DatePicker from "react-native-date-picker";
import Toast from "react-native-simple-toast";
import QRCode from "react-native-qrcode-svg";

export default function TakeAttendance() {
  const [loading, setLoading] = useState(false);
  const [isLogOutVisible, setIsLogOutVisible] = useState(false);
  const [courseId, setCourseId] = useState();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [classTime, setClassTime] = useState();
  const [teacherId, setTeacherId] = useState();
  const [showQR, setShowQR] = useState(false);
  const navigation = useNavigation();
  const handleGenerateQR = async () => {
    try {
      setLoading(true);
      const response = await api.post("/generateqr", { courseId,teacherId });
      if (response.data.success) {
        setShowQR(true);
      } else {
        Toast.show(response.data.msg, Toast.SHORT);
      }
      setLoading(false);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("teacherId");
      await AsyncStorage.removeItem("who");
      navigation.replace("ChooseScreen");
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const getTeacherId = async () => {
      const tid = await AsyncStorage.getItem("teacherId");
      setTeacherId(tid);
    };
    getTeacherId();
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <View style={{ display: "flex", flexDirection: "column" }}>
      <StatusBar backgroundColor={"#EF9E1C"} />
      <View
        style={{
          backgroundColor: "#EF9E1C",
          height: 45,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, color: "white", marginLeft: 120 }}>
          Take Attendance
        </Text>
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

      <TextInput
        value={courseId}
        onChangeText={(text) => setCourseId(text)}
        placeholder="Course Id"
        placeholderTextColor={"gray"}
        style={styles.textInput}
      />
      <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={() => {
          setOpen(true);
        }}
      >
        <Text>
          Select Date:-{" "}
          {date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-
          {date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1}
          -{date.getFullYear()}
        </Text>
      </TouchableOpacity>
      <View
        style={styles.touchableOpacity}
        onPress={() => {
          setOpen(true);
        }}
      >
        <Text>
          Class Time:-{" "}
          {date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:
          {date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}
        </Text>
      </View>
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        mode="datetime"
      />
      <TouchableOpacity
        style={[
          styles.touchableOpacity,
          {
            backgroundColor: "#EF9E1C",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
        onPress={() => handleGenerateQR()}
      >
        <Text style={{ fontSize: 16, color: "white" }}>Generate QR CODE</Text>
      </TouchableOpacity>
      {showQR && (
        <View style={{ alignSelf: "center", marginTop: 20 }}>
          <QRCode
            value={JSON.stringify({
              courseId: courseId,
              teacherId: teacherId,
              date: date,
            })}
            size={250}
            color="black"
            backgroundColor="white"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
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
  },
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
