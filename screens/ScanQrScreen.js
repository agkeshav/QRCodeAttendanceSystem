"use strict";
import {
  View,
  Text,
  Button,
  Linking,
  StyleSheet,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import Toast from "react-native-simple-toast";
import LoadingScreen from "./LoadingScreen";
import api from "../api/api";

export default function ScanQrScreen({ route }) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [who, setWho] = useState();
  const [toastShown, setToastShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const device = useCameraDevice("back");
  if (device == null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Camera not available</Text>
      </View>
    );
  }
  const handleAttendance = async (codes, currentDate) => {
    setLoading(true);
    try {
      const response = await api.post("/attendance", {
        codes: codes,
        currentDate: currentDate,
        rollNo: route.params,
      });
      Toast.show(response.data.msg, Toast.LONG);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    const checkPermission = async () => {
      const permissionStatus = hasPermission;
      if (!permissionStatus) {
        const status = await requestPermission();
        if (!status) {
          requestPermission();
        }
      }
    };
    checkPermission();
  }, []);
  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: async(codes) => {
      if (codes.length > 0 && !toastShown) {
        Toast.show("QR Scanned Successfully", Toast.LONG);
        setToastShown(true);
        await handleAttendance(codes, Date(), route.params.rollNo);
        navigation.navigate("HomeScreen");
      }
    },
  });
  return loading ? (
    <LoadingScreen />
  ) : (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#EF9E1C"} />
      <Camera
        device={device}
        isActive={true}
        style={{ height: 250, width: 250 }}
        codeScanner={codeScanner}
      />
      <Text style={{ marginTop: 10 }}>Place the QR CODE inside the frame</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
