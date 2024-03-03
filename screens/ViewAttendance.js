import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import api from "../api/api";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNHTMLtoPDF from "react-native-html-to-pdf";
export default function ViewAttendance() {
  const [teacherId, setTeacherId] = useState();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [courses, setCourses] = useState([]);
  const [attdData, setAttdData] = useState([]);
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  console.log(attdData);
  const attde = [
    {
      attd: [
        {
          date: "2024-02-09",
          present: "1",
        },
      ],
      rollNo: "BT21CSE001",
    },
  ];
  const htmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pdf Content</title>
    <style>
        body {
            font-size: 16px;
            color: rgb(255, 196, 0);
        }

        h1 {
            text-align: center;
        }

        .list {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
            justify-content: space-between;
        }

        .key {
            font-family: "Inter", sans-serif;
            font-weight: 600;
            color: #c9cdd2;
            font-size: 12px;
            line-height: 1.2;
            width: 40%;
        }

        .value {
            font-family: "Inter", sans-serif;
            font-weight: 600;
            color: #5e6978;
            font-size: 12px;
            line-height: 1.2;
            text-transform: capitalize;
            width: 60%;
            flex-wrap: wrap;
        }
    </style>
</head>

<body>
    <div class="confirmationBox_content">
    <h1>Hello!</h1>
        
            
          ${attde.map(
            (el) =>
              `<div class="list" key=${el.rollNo}>
                    <p class="key">${el.rollNo}</p>
                    <p class="value">${el.attd[0].date}</p>
                    <p class="value">${el.attd[0].present}</p>
                </div>`
          )}
        
    </div>
</body>

</html>`;
  const createPDF = async () => {
    try {
      let PDFOptions = {
        html: htmlContent,
        fileName: "file",
        directory: Platform.OS === "android" ? "Downloads" : "Documents",
      };
      let file = await RNHTMLtoPDF.convert(PDFOptions);
      console.log("pdf", file.filePath);
      if (!file.filePath) return;
      alert(file.filePath);
    } catch (error) {
      console.log("Failed to generate pdf", error.message);
    }
  };
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
      setAttdData(response.data.msg);

      setLoading(false);
      createPDF();
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
  }, [teacherId, attdData]);
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
