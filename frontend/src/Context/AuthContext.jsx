import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [auth, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({
        type: 'LOGIN',
        payload: user,
      });
    }
  }, []);

  console.log('AuthContext state: ', auth);

  return (
    <AuthContext.Provider value={{ ...auth, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
