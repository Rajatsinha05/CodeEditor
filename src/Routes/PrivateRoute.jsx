import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Spinner, Center } from "@chakra-ui/react";

const PrivateRoute = ({ children }) => {
  const { user, isLogin, loading } = useSelector((store) => store.data);
  const navigate = useNavigate();

  // Redirect to the login page if not authenticated
  useEffect(() => {
    if (!loading && !isLogin) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }, [loading, isLogin, navigate]);

  // Show a loading spinner while checking the login status
  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // If authenticated, render the children components
  if (isLogin) {
    return children;
  }

  // Fallback: If not logged in, show nothing (useEffect will handle the redirect)
  return null;
};

export default PrivateRoute;
