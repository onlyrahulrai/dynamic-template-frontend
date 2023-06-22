import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Body from "../component/Body";
import CreateNewFileModel from "../component/CreateNewFileModel";
import CreateNewFolderModel from "../component/CreateNewFolderModel";
import { EditorContext } from "../context/useEditor";
import Error from "../component/Error";

const Editor = (props) => {
  const navigate = useNavigate();
  const {
    isCreateNewFileModelOpen,
    isCreateNewFolderModelOpen,
    onSaveFileByCTRL,
    error,
  } = useContext(EditorContext);
  const [searchParams] = useSearchParams();

  const handleKeyDown = (event) => {
    // Check if the Ctrl key and the S key are pressed simultaneously

    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();

      onSaveFileByCTRL();
    }
  };

  useEffect(() => {
    console.log(" normal useEffect  ");
    if (!searchParams.get("id")) {
      navigate("/directories");
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (error) return <Error message={error} />;

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
