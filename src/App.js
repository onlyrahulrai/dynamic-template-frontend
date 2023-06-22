import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import EditorProvider from "./context/useEditor";
import useAuthStore from "./state/useAuthStore";
import axiosInstance from "./api/base";
import { Directories, Editor, Login, Themes } from "./views";

function App() {
  const { setUser } = useAuthStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserDetails = async () => {
      await axiosInstance
        .get("/editor/user-details/")
        .then((response) => setUser(response.data))
        .catch((error) => {
          navigate("/");
        });
    };

    loadUserDetails();
  }, []);

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/directories" element={<Directories />} />
        <Route path="/themes" element={<Themes />} />
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
