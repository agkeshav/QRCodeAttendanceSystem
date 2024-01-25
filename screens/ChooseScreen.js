import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function ChooseScreen() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 25 }}>Who Are You?</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingHorizontal: 30,
          margin: 30,
        }}
      >
        <TouchableOpacity
          style={styles.toStyle}
          onPress={() => {
            navigation.navigate("SignUpScreen", "Student");
          }}
        >
          <Image
            source={require("../assets/student.png")}
            style={styles.imgStyle}
          />
          <Text style={styles.textStyle}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toStyle}
          onPress={() => {
            navigation.navigate("SignUpScreen", "Teacher");
          }}
        >
          <Image
            source={require("../assets/teacher.png")}
            style={styles.imgStyle}
          />
          <Text style={styles.textStyle}>Teacher</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    alignSelf: "center",
    marginTop: 5,
    fontSize: 16,
  },
  imgStyle: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  toStyle: {
    marginHorizontal: 10,
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
  },
});
