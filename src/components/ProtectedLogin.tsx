import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedLogin: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      navigate("/");
      return;
    }
    try {
      //To check expire or not
      const decodedToken = jwtDecode(token);      

      if (!decodedToken || !decodedToken.exp) {
        console.warn("Invalid token. Redirecting to home");
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      const currentTime = Date.now();

      if (decodedToken.exp * 1_000 < currentTime) {
        console.warn("Token expired. Redirecting to home....");
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error verifying Token");
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  if (!isLoggedIn) {
    return <></>;
  }

  return <>{children}</>;
};

export default ProtectedLogin;
