import React, { useState, useEffect, useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";
import SignUpScreen from "../screens/SignUpScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "../screens/HomeScreen";
import ChooseScreen from "../screens/ChooseScreen";
import ScanQrScreen from "../screens/ScanQrScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TakeAttendance from "../screens/TakeAttendance";
import EnrollStudents from "../screens/EnrollStudents";
import ViewAttendance from "../screens/ViewAttendance";
import ViewStuAttd from "../screens/ViewStuAttd";
import { Context as UserContext } from "../context/UserContext";
import { MaterialCommunityIcons, Ionicons } from "react-native-vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function Navigation() {
  const [token, setToken] = useState("");
  const [who, setWho] = useState("");
  const [loading, setLoading] = useState(true);
  const tryLocalSignIn = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const who = await AsyncStorage.getItem("who");
      if (token) {
        setToken(token);
        setWho(who);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    tryLocalSignIn();
  }, []);

  function TeacherMain() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 5,
            height: 50,
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen
          name="TakeAttendance"
          component={TakeAttendance}
          options={{
            tabBarIcon: () => (
              <Ionicons name="create" color="black" size={25} />
            ),
            tabBarLabel: "GENERATE",
            tabBarLabelStyle: {
              color: "black",
              fontWeight: "bold",
            },
          }}
        />
        <Tab.Screen
          name="EnrollStudents"
          component={EnrollStudents}
          options={{
            tabBarIcon: () => (
              <Ionicons name="person-add" color="black" size={25} />
            ),
            tabBarLabel: "ENROLL",
            tabBarLabelStyle: {
              color: "black",
              fontWeight: "bold",
            },
          }}
        />
        {/* <Tab.Screen name="ViewAttendance" component={ViewAttendance} /> */}
      </Tab.Navigator>
    );
  }

  function StudentMain() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            paddingBottom: 5,
            height: 50,
          },
        }}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="qrcode-scan"
                color="black"
                size={25}
              />
            ),
            tabBarLabel: "SCAN CODE",
            tabBarLabelStyle: {
              color: "black",
              fontWeight: "bold",
            },
          }}
        />
        {/* <Tab.Screen name="ViewStuAttd" component={ViewStuAttd} /> */}
      </Tab.Navigator>
    );
  }
  return loading === true ? (
    <LoadingScreen />
  ) : (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!token ? (
          <>
            <Stack.Screen name="ChooseScreen" component={ChooseScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="TeacherMain" component={TeacherMain} />
            <Stack.Screen name="StudentMain" component={StudentMain} />
            <Stack.Screen name="ScanQrScreen" component={ScanQrScreen} />
          </>
        ) : (
          <>
            {who === "Student" ? (
              <>
                <Stack.Screen name="StudentMain" component={StudentMain} />
                <Stack.Screen name="TeacherMain" component={TeacherMain} />
              </>
            ) : (
              <>
                <Stack.Screen name="TeacherMain" component={TeacherMain} />
                <Stack.Screen name="StudentMain" component={StudentMain} />
              </>
            )}
            <Stack.Screen name="ScanQrScreen" component={ScanQrScreen} />
            <Stack.Screen name="ChooseScreen" component={ChooseScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
