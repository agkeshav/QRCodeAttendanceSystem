import createDataContext from "./createDataContext";
const userReducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const { Context, Provider } = createDataContext(userReducer);
