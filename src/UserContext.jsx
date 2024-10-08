import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUserName] = useState(null);
  const [id, setId] = useState(null);
  const [image, setImage] = useState(null); // State to manage the image file

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("No access token found");
          setLoading(false);
          return;
        }

        const response = await axios.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
console.log(response.data);
        // Assuming your backend response contains the profile image URL.
        setId(response.data.userId);
        setUserName(response.data.username);

        setImage(response.data.profileImage); // Set the profile image here


      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <UserContext.Provider
      value={{ username, setUserName, id, setId, image, setImage }}
    >
      {children}
    </UserContext.Provider>
  );
}
