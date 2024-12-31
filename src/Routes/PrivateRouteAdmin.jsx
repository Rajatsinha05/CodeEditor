import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRouteAdmin = ({ children }) => {
  let { user, isLogin } = useSelector((store) => store.data);
  

  if (!isLogin) {
    return <Navigate to="/login" />;
  }

  if (user?.role === "ADMIN" || user?.role === "SUPERADMIN") {
    return children;
  }

  return <Navigate to="/" />;
};

export default PrivateRouteAdmin;
