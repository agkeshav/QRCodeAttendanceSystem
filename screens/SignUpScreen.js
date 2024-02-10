import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useContext, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Context as UserContext } from "../context/UserContext";

export default function SignUpScreen(props) {
  const navigation = useNavigation();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [rollNo, setRollNo] = useState();
  const who = props.route.params;
  const handleSignUp = async () => {
    try {
      const response =
        who === "Teacher"
          ? await api.post("/teacher/signup", { name, email, password })
          : await api.post("/student/signup", {
              name,
              rollNo,
              email,
              password,
            });
      const token = response.data.token;
      await AsyncStorage.setItem("who", who);
      if (who === "Teacher") {
        await AsyncStorage.setItem("teacherId", response.data.teacherId);
      }
      await AsyncStorage.setItem("token", token);
      console.log("Register Successfully");
      {
        who == "Student"
          ? navigation.replace("StudentMain", who)
          : navigation.replace("TeacherMain", who);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#EF9E1C"} />
      <Image
        source={
          who === "Teacher"
            ? require("../assets/teacher.png")
            : require("../assets/student.png")
        }
        style={{
          width: who === "Teacher" ? 250 : 150,
          height: 250,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}
      />

      <Text style={styles.textStyle}>SignUp</Text>
      <TextInput
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder="Name"
        placeholderTextColor={"gray"}
        style={styles.textInput}
      />
      {who == "Student" ? (
        <TextInput
          value={rollNo}
          onChangeText={(text) => setRollNo(text)}
          placeholder="Roll No."
          placeholderTextColor={"gray"}
          style={styles.textInput}
        />
      ) : null}
      <TextInput
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Email"
        placeholderTextColor={"gray"}
        style={styles.textInput}
      />
      <TextInput
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
        placeholderTextColor={"gray"}
        style={styles.textInput}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#EF9E1C",
          paddingHorizontal: 10,
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "center",
          height: 50,
          borderRadius: 10,
          marginBottom: 25,
        }}
        onPress={() => handleSignUp()}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
          Register
        </Text>
      </TouchableOpacity>
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "#666666", fontWeight: "bold", marginBottom: 5 }}>
          Already have an account ?
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("LoginScreen", who)}
        >
          <Text style={{ color: "#EF9E1C", fontWeight: "700", fontSize: 15 }}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 50,
  },
  textStyle: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 15,
    fontWeight: "bold",
  },
});
