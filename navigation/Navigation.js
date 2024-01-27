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
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function Navigation({ navigation }) {
  const {
    state: { who },
  } = useContext(UserContext);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const tryLocalSignIn = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      // console.log(token);
      if (token) {
        setToken(token);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    tryLocalSignIn();
  });
  useEffect(() => {
    if (token && who === "Student") {
      navigation.replace("StudentMain");
    }
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
        <Tab.Screen name="TakeAttendance" component={TakeAttendance} />
        <Tab.Screen name="EnrollStudents" component={EnrollStudents} />
        <Tab.Screen name="ViewAttendance" component={ViewAttendance} />
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
        <Tab.Screen name="HomeScreen" component={HomeScreen} />
        <Tab.Screen name="ViewStuAttd" component={ViewStuAttd} />
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
            <Stack.Screen name="TeacherMain" component={TeacherMain} />
            <Stack.Screen name="StudentMain" component={StudentMain} />
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
