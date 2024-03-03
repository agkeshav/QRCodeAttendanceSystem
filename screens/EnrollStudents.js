import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import api from "../api/api";
import LoadingScreen from "./LoadingScreen";
import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import { CheckBox } from "@rneui/themed";
import { Context as UserContext } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EnrollStudents() {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [courseId, setCourseId] = useState();
  const [courseName, setCourseName] = useState();
  const [courses, setCourses] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [students, setStudents] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [teacherId, setTeacherId] = useState();

  const getAllCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/courses");
      setCourses([
        ...response.data.msg,
        { courseName: "dummy", courseId: 1000000 },
      ]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  const getAllStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students");
      setStudents(response.data.msg);
      setCheckedState(new Array(students.length).fill(false));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const tid = await AsyncStorage.getItem("teacherId");
      setTeacherId(tid);
      await getAllCourses();
      await getAllStudents();
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCheckedState(new Array(students.length).fill(false));
  }, [students]);
  const handleCreateCourse = async () => {
    if (courseId == undefined || courseName == undefined) {
      Toast.show("Please Fill All The Details", Toast.SHORT);
    } else {
      try {
        setLoading(true);
        const response = await api.post("/courses", {
          teacherId,
          courseId,
          courseName,
        });
        Toast.show("Course Successfully Created", Toast.SHORT);
        setIsModalVisible(!isModalVisible);
        setLoading(false);
        setValue(courseId);
        getAllCourses();
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }
  };
  const handleEnrollStudents = async () => {
    let allStudent = [];
    checkedState.map((item, index) => {
      if (item == true) {
        allStudent.push(students[index]);
      }
    });
    if (!value) {
      Toast.show("Choose the course", Toast.SHORT);
    } else {
      try {
        setLoading(true);
        const response = await api.post("/enrollStudents", {
          allStudent,
          value,
        });
        Toast.show("Students successfully enrolled", Toast.SHORT);
        setIsAllSelected(false);
        const updatedCheckedState = checkedState.map(
          (item, index) => (item = false)
        );
        setCheckedState(updatedCheckedState);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }
  };

  const renderItem = (item, index) => {
    return (
      <>
        {item._index != courses.length - 1 && (
          <View style={styles.item}>
            <Text style={styles.textItem}>{item.courseId}</Text>
            <Text style={styles.textItem}>{item.courseName}</Text>
          </View>
        )}
        {item._index === courses.length - 1 && (
          <TouchableOpacity
            style={styles.touchableOpacityStyle}
            onPress={() => setIsModalVisible(!isModalVisible)}
          >
            <Text style={{ color: "white", fontSize: 15 }}>CREATE COURSE</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };
  return loading ? (
    <LoadingScreen />
  ) : (
    <View
      style={{
        display: "flex",
        backgroundColor: "white",
        flex: 1,
        padding: 10,
      }}
    >
      <StatusBar backgroundColor={"#EF9E1C"} />

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
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={() => setIsModalVisible(!isModalVisible)}
        onBackdropPress={() => setIsModalVisible(!isModalVisible)}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              height: 250,
              width: 300,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter CourseId"
              placeholderTextColor={"gray"}
              value={courseId}
              onChangeText={(value) => {
                setCourseId(value);
              }}
            />
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter Course Name"
              placeholderTextColor={"gray"}
              value={courseName}
              onChangeText={(value) => {
                setCourseName(value);
              }}
            />
            <TouchableOpacity
              style={styles.touchableOpacityModalStyle}
              onPress={() => handleCreateCourse()}
            >
              <Text style={{ color: "white", fontSize: 15 }}>
                CREATE COURSE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{ marginHorizontal: 16, marginTop: 5 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 16 }}>Students</Text>
          <CheckBox
            center
            title="Select All"
            checked={isAllSelected}
            onPress={() => {
              if (!isAllSelected) {
                setIsAllSelected(true);
                const updatedCheckedState = checkedState.map(() => true);
                setCheckedState(updatedCheckedState);
              } else {
                setIsAllSelected(false);
                const updatedCheckedState = checkedState.map(() => false);
                setCheckedState(updatedCheckedState);
              }
            }}
            checkedColor="#EF9E1C"
          />
        </View>
        {students.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 16 }}>{item.rollNo}</Text>
              <CheckBox
                key={index}
                checked={checkedState[index]}
                onPress={() => {
                  const updatedCheckedState = checkedState.map((item, i) =>
                    i === index ? !item : item
                  );
                  setCheckedState(updatedCheckedState);
                }}
                checkedColor="#EF9E1C"
              />
            </View>
          );
        })}
        <TouchableOpacity
          style={styles.touchableOpacityStyle}
          onPress={() => handleEnrollStudents()}
        >
          <Text style={{ color: "white", fontSize: 15 }}>ENROLL STUDENTS</Text>
        </TouchableOpacity>
      </View>
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
});
