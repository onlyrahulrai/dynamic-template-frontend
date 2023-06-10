import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Editor from "./Editor.js";
import { EditorProvider } from "./context/useEditor";
import useAuthStore from "./state/useAuthStore";
import axiosInstance from "./api/base";
import  toast  from "react-hot-toast";

function App() {
  const { setUser } = useAuthStore((state) => state);

  useEffect(() => {
    const loadUserDetails = async () => {
      await axiosInstance
        .get("/theme/user-details/")
        .then((response) => setUser(response.data))
        .catch((error) => toast.error("Failed in Loading User Details"));
    };

    if (localStorage.getItem("authTokens")) {
      loadUserDetails();
    }
  }, []);

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/editor"
          element={
            <EditorProvider>
              <Editor />
            </EditorProvider>
          }
        />
      </Routes>
    </React.Fragment>
  );
}

export default App;
