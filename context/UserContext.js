import createDataContext from "./createDataContext";
const userReducer = (state, action) => {
  switch (action.type) {
    case "update_who": {
      return { ...state, who: action.payload };
    }
    case "update_teacherid": {
      return { ...state, teacherId: action.payload };
    }
    default:
      return state;
  }
};
const updateWho = (dispatch) => {
  return (user) => {
    dispatch({ type: "update_who", payload: user });
  };
};

const updateTeacherId = (dispatch) => {
  return (id) => {
    dispatch({ type: "update_teacherid", payload: id });
  };
};
export const { Context, Provider } = createDataContext(
  userReducer,
  { updateWho, updateTeacherId },
  { who: "", teacherId: "" }
);
