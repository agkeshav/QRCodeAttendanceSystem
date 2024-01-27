"use strict";
import { View, Text, Button, Linking, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import Toast from "react-native-simple-toast";
export default function ScanQrScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [who, setWho] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const device = useCameraDevice("back");
  if (device == null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Camera not available</Text>
      </View>
    );
  }
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
    onCodeScanned: (codes) => {
      if(codes.length>0){
        Toast.show("QR Scanned Successfully", Toast.LONG);
        navigation.navigate('HomeScreen',codes);
      }
    },
  });
  return (
    <View style={styles.container}>
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
