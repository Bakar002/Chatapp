import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import "../style.css";

export default function Register() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null); // State to manage the image file
  const [isLoggedInOrRegister, setIsLoggedInOrRegister] = useState("register");
  const { setUserName: setLogedInUsername, setId } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLoggedInOrRegister === "register" ? "/register" : "/login";
      // Convert the image to a base64 string if registering
      let imageData = null;
      if (isLoggedInOrRegister === "register" && image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = async () => {
          imageData = reader.result; // Base64 string of the image

          // Request payload
          const payload = {
            username,
            password,
            image: imageData, // Include the image data only during registration
          };

          const response = await axios.post(url, payload);

          if (response.status === 200) {
            alert("Login successful");
            setLogedInUsername(username);
            setId(response.data.id);
          } else if (response.status === 201) {
            alert("Registration successful");
          } else {
            alert("Unexpected response status: " + response.status);
          }
        };
      } else {
        // For login, just send username and password without image
        const payload = { username, password };
        const response = await axios.post(url, payload);

        if (response.status === 200) {
          alert("Login successful");
          setLogedInUsername(username);
          setId(response.data.id);
        } else {
          alert("Unexpected response status: " + response.status);
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Invalid username or password");
        } else {
          alert("Server error: " + error.response.data.error);
        }
      } else if (error.request) {
        alert("Request error: " + error.request.message);
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  const handleLoginClick = () => {
    setIsLoggedInOrRegister("login");
  };

  const handleRegisterClick = () => {
    setIsLoggedInOrRegister("register");
  };

  return (
    <div className="background-Login">
      <div className="container">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm blur-background">
          <form
            className="space-y-6 blur-content"
            onSubmit={handleSubmit}
            method="POST"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  value={username}
                  onChange={(ev) => setUserName(ev.target.value)}
                  type="text"
                  placeholder="Username"
                  required
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  type="password"
                  placeholder="Password"
                  required
                  className="block w-full rounded-md p-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {isLoggedInOrRegister === "register" && (
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Upload Profile Image
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#a30e46] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2e1e3f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoggedInOrRegister === "register" ? "Register" : "Login"}
              </button>
            </div>
            <div className="text-center mt-3">
              {isLoggedInOrRegister === "register" && (
                <div>
                  Already a member?{" "}
                  <button onClick={handleLoginClick}>login here</button>{" "}
                </div>
              )}
              {isLoggedInOrRegister === "login" && (
                <div>
                  Don't have an account?{" "}
                  <button onClick={handleRegisterClick}>Register here</button>{" "}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
