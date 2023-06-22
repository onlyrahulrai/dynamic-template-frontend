import React, { useContext, useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { AiOutlineFile, AiOutlineFolderOpen } from "react-icons/ai";
import axiosInstance from "../api/base";
import { EditorContext } from "../context/useEditor";
import { BsTrash3 } from "react-icons/bs";
import Swal from "../config/Swal";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const Folder = ({ explorer }) => {
  const [expand, setExpand] = useState(false);
  const { onChangeState, selectedFiles,onDeleteFile } = useContext(EditorContext);
  const [searchParams,] = useSearchParams()

  const onClickFile = async () => {
    await axiosInstance
      .get("/theme/file/", { params: { path: explorer.path } })
      .then((response) => {
        const fileIndex = selectedFiles.findIndex((file) => file.path === explorer.path);

        const values =
          (fileIndex === -1)
            ? {selectedFiles:[...selectedFiles, response?.data],content:response?.data?.content}
            : {selectedFiles,content:selectedFiles[fileIndex]?.content};

        onChangeState({
          explorer,
          selectedTab:response?.data?.path,
          ...values
        });
      })
      .catch((error) => console.log(" Error ", error));
  };

  const onClickCreateFolderButton = () => {
    onChangeState({ isCreateNewFolderModelOpen: true, explorer });
  };

  const onClickCreateFileButton = () => {
    onChangeState({ isCreateNewFileModelOpen: true, explorer });
  };

  const onClickDeleteFolderButton = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${explorer.name} folder!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const onDeleteFolderPromise = axiosInstance.delete("/theme/folder/", {
          params: {
            id:searchParams.get('id'),
            path: explorer.path,
          },
        });

        toast.promise(onDeleteFolderPromise, {
          loading: "Deleting...",
          success: `${explorer.name} folder is deleted successfully`,
          error: `Couldn't delete folder ${explorer.name}`,
        });

        await onDeleteFolderPromise
          .then((response) => {
            const foldersAfterDelete = selectedFiles.filter((file) => !explorer.items.map((file) => file.path).includes(file.path))
            
            const tempExplorer = foldersAfterDelete.length ? foldersAfterDelete[0] : null;

            const content = tempExplorer ? tempExplorer?.content : null;

            onChangeState({ code: response.data,  explorer, content,selectedFiles:foldersAfterDelete });
          })
          .catch((error) => console.log(" Error ", error));
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire("Cancelled", "Your imaginary folder is safe :)", "error");
      }
    });
  };

  if (explorer.is_folder) {
    return (
      <div className="curor-pointer">
        <div className="d-flex justify-content-between align-items-center">
          <span onClick={() => setExpand(!expand)}>
            {expand ? (
              <FiChevronDown size={18} />
            ) : (
              <FiChevronRight size={18} />
            )}
            {explorer.name}
          </span>

          <div>
            <AiOutlineFile size={18} onClick={onClickCreateFileButton} />{" "}
            <AiOutlineFolderOpen
              size={18}
              onClick={onClickCreateFolderButton}
            />{" "}
            <BsTrash3 size={16} onClick={onClickDeleteFolderButton} />
          </div>
        </div>

        <div
          style={{
            display: expand ? "block" : "none",
            paddingLeft: "12px",
            paddingTop: "3px",
          }}
        >
          {explorer.items.map((exp, index) => (
            <Folder explorer={exp} key={index} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ paddingTop: "3px", cursor: "pointer" }}>
        <div className="d-flex justify-content-between align-items-center">
          <span onClick={onClickFile}>{explorer.name}</span>
          <BsTrash3 size={16} onClick={() => onDeleteFile(explorer)} />
        </div>
      </div>
    );
  }
};

export default Folder;
