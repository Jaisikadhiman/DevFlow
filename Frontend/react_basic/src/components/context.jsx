import { createContext } from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const storeToken = (token) => {
    return localStorage.setItem("token", token);
  };
  const storeRole = (role) => {
    return localStorage.setItem("role", role);
  };
  const storeProfile = (profileImage) => {
    return localStorage.setItem("profileImg", profileImage);
  };
  const storeOtpExpiration = (otpExpiration) => {
    return localStorage.setItem("otpExpiration", otpExpiration);
  };
  const storeOtpHash = (otpHash) => {
    return localStorage.setItem("otpHash", otpHash);
  };
  return (
    <AuthContext.Provider value={{ storeToken, storeRole, storeProfile,storeOtpExpiration,storeOtpHash }}>
      {children}
    </AuthContext.Provider>
  );
};
