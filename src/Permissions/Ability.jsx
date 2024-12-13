import React from "react";
import { useSelector } from "react-redux";

const Ability = ({ roles, children }) => {
  let { role } = useSelector((store) => store.user.user);
  if (roles.includes(role)) {
    return <>{children}</>;
  }

  return null;
};

export default Ability;
