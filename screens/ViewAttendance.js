import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  PermissionsAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import api from "../api/api";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
var RNFS = require("react-native-fs");
import XLSX from "xlsx";
import FileViewer from "react-native-file-viewer";

export default function ViewAttendance() {
  const [teacherId, setTeacherId] = useState();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [courses, setCourses] = useState([]);
  const [attdData, setAttdData] = useState([]);
  const [generate, setGenerate] = useState(false);
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  console.log(attdData);
  const getTeacherCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teachercourses", {
        params: { teacherId: teacherId },
      });
      setCourses(response.data.msg);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  };
  const getTeacherId = async () => {
    const tid = await AsyncStorage.getItem("teacherId");
    setTeacherId(tid);
  };
  const exportDataToExcel = async (attdData) => {
    // Created Sample data
    if (!attdData || attdData.length === 0) {
      console.log("No data to export.");
      return;
    }
    let sample_data_to_export = attdData;
    let wb = XLSX.utils.book_new();
    const wsData = [];

    // Push header row
    const headerRow = [
      "RollNo",
      ...(sample_data_to_export.length > 0
        ? sample_data_to_export[0].attd
            .map((item) => {
              const parts = item.date.split("-");
              return `${parts[2]}-${parts[1]}-${parts[0]}`;
            })
            .reverse()
        : []),
    ];

    wsData.push(headerRow);
    sample_data_to_export.forEach((item) => {
      const rowData = [item.rollNo];
      item.attd.forEach((attendance) => {
        rowData.push(attendance.present);
      });
      wsData.push(rowData);
    });
    let ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });

    // Write generated excel to Storage
    const path =
      RNFS.DownloadDirectoryPath + "/" + `${teacherId}` + "_Attendance.xlsx";
    await RNFS.writeFile(path, wbout, "ascii")
      .then((r) => {
        Toast.show("File saved to the location:- " + path, Toast.SHORT);
        console.log(path);
        FileViewer.open(path)
          .then(() => {
            console.log("success");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((e) => {
        Toast.show("Some Error Occurred while downloading", Toast.SHORT);
      });
  };
  const handleClick = async (attdData) => {
    try {
      let isPermitedExternalStorage = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (!isPermitedExternalStorage) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage permission needed",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission Granted (calling our exportDataToExcel function)
          exportDataToExcel(attdData);
          Toast.show("Permission granted", Toast.SHORT);
        } else {
          // Permission denied
          Toast.show("Permission denied", Toast.SHORT);
        }
      } else {
        // Already have Permission (calling our exportDataToExcel function)
        exportDataToExcel(attdData);
      }
      setGenerate(false);
    } catch (e) {
      Toast.show("Error while checking permission", Toast.SHORT);
      console.log(e);
      setGenerate(false);
      return;
    }
  };
  const generateReport = async () => {
    if (value == null) {
      Toast.show("Please choose the course", Toast.SHORT);
      return;
    }
    if (teacherId == null) {
      Toast.show("Teacher ID not set...", Toast.SHORT);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get("/teacherattendance", {
        params: {
          teacherId: teacherId,
          courseId: value,
        },
      });
      setTimeout(() => {
        setAttdData(response.data.msg);
      }, 1000);
      handleClick(attdData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await getTeacherId();
      await getTeacherCourses();
    };
    fetchData();
  }, [teacherId]);
  useEffect(() => {}, [attdData]);
  const renderItem = (item, index) => {
    return (
      <>
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.courseId}</Text>
          <Text style={styles.textItem}>{item.courseName}</Text>
        </View>
      </>
    );
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <View>
      <StatusBar backgroundColor={"#EF9E1C"} />
      <Text
        style={{
          alignSelf: "center",
          marginTop: 5,
          fontSize: 18,
          color: "#EF9E1C",
          fontWeight: "bold",
        }}
      >
        GET ATTENDANCE
      </Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={courses}
        search
        maxHeight={300}
        labelField="courseName"
        valueField="courseId"
        placeholder="Choose Course"
        searchPlaceholder="Search..."
        value={value}
        onChange={(item) => {
          setValue(item.courseId);
        }}
        renderItem={(item, index) => renderItem(item, index)}
      />
      <TouchableOpacity
        style={styles.touchableOpacityStyle}
        onPress={() => generateReport()}
      >
        <Text style={{ color: "white", fontSize: 15 }}>GENERATE REPORT</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: width * 0.15,
          justifyContent: "space-evenly",
          marginTop: 15,
        }}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  textInputStyle: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
  },
  touchableOpacityModalStyle: {
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 250,
    backgroundColor: "#EF9E1C",
    borderRadius: 10,
  },
  touchableOpacityStyle: {
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    backgroundColor: "#EF9E1C",
    borderRadius: 10,
    marginHorizontal: 7,
  },
  reportItemText: {},
});
