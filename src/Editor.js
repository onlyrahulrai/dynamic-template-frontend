import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./component/Sidebar";
import Body from "./component/Body";
import CreateNewFileModel from "./component/CreateNewFileModel";
import CreateNewFolderModel from "./component/CreateNewFolderModel";
import { EditorContext } from "./context/useEditor";

const Editor = () => {
  const navigate = useNavigate();
  const { isCreateNewFileModelOpen, isCreateNewFolderModelOpen,onSaveFileByCTRL } = useContext(
    EditorContext
  );


  const handleKeyDown = (event) => {
    // Check if the Ctrl key and the S key are pressed simultaneously

    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();

      onSaveFileByCTRL()
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authTokens")) {
      navigate("/");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <Body />
        {isCreateNewFileModelOpen ? <CreateNewFileModel /> : null}
        {isCreateNewFolderModelOpen ? <CreateNewFolderModel /> : null}
      </div>
    </div>
  );
};

export default Editor;
