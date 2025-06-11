import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";
import axios from "axios"; // ✅ CORRECT

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      stateRegion: "",
      zipcode: "",
    },
  });

  const unsetUser = () => {
    setUser({ id: null, isAdmin: null });
  };

  async function fetchUser(authToken) {
    if (authToken) {
      try {
        const res = await axios.get(`http://localhost:4000/users/details`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUser({
          id: res.data._id,
          isAdmin: res.data.isAdmin,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          mobileNo: res.data.mobileNo || "",
          address: {
            addressLine1: res.data.address?.addressLine1 || "",
            addressLine2: res.data.address?.addressLine2 || "",
            country: res.data.address?.country || "",
            city: res.data.address?.city || "",
            stateRegion: res.data.address?.stateRegion || "",
            zipcode: res.data.address?.zipcode || "",
          },
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        unsetUser();
        setToken(null);
        localStorage.removeItem("token");
      }
    } else {
      unsetUser();
    }
  }

  // Watch token changes and fetch user accordingly
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUser(token);
    } else {
      localStorage.removeItem("token");
      unsetUser();
    }
  }, [token]);

  return <UserContext.Provider value={{ user, setUser, unsetUser, token, setToken }}>{children}</UserContext.Provider>;
};

export default UserProvider;
