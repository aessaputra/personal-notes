import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import {
  getUserLogged,
  putAccessToken,
  getAccessToken,
} from '../utils/network-data';

const removeLocalAccessToken = () => {
  localStorage.removeItem('accessToken');
};

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authedUser, setAuthedUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function fetchUserOnLoad() {
      const token = getAccessToken();
      if (token) {
        try {
          const { error, data } = await getUserLogged();
          if (!error) {
            setAuthedUser(data);
          } else {
            removeLocalAccessToken();
            setAuthedUser(null);
          }
        } catch (e) {
          removeLocalAccessToken();
          setAuthedUser(null);
        }
      }
      setInitializing(false);
    }
    fetchUserOnLoad();
  }, []);

  const loginContext = async ({ email, password }) => {
    const { login: apiLogin } = await import('../utils/network-data');
    const { error, message, data } = await apiLogin({ email, password });
    if (!error && data && data.accessToken) {
      putAccessToken(data.accessToken);
      const { data: userData, error: userError } = await getUserLogged();
      if (!userError) {
        setAuthedUser(userData);
        return { error: false };
      } else {
        removeLocalAccessToken();
        setAuthedUser(null);
        return {
          error: true,
          message:
            userError.message ||
            'Gagal mendapatkan data pengguna setelah login.',
        };
      }
    }
    return { error: true, message: message || 'Email atau password salah.' };
  };

  const registerContext = async ({ name, email, password }) => {
    const { register: apiRegister } = await import('../utils/network-data');
    return await apiRegister({ name, email, password });
  };

  const logoutContext = () => {
    removeLocalAccessToken();
    setAuthedUser(null);
  };

  const contextValue = useMemo(
    () => ({
      authedUser,
      initializing,
      login: loginContext,
      register: registerContext,
      logout: logoutContext,
    }),
    [authedUser, initializing]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!initializing && children}
    </AuthContext.Provider>
  );
}
