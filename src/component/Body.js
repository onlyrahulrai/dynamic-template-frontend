import React, { useContext } from "react";
import { EditorContext } from "../context/useEditor";
import axiosInstance from "../api/base";
import toast from "react-hot-toast";
import NoFileSelectedMessage from "./NoFileSelectedMessage";
import { AiOutlineClose } from "react-icons/ai";

const Body = () => {
  const {
    content,
    onChangeState,
    explorer,
    selectedFiles,
    selectedTab,
  } = useContext(EditorContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    await axiosInstance
      .put("/theme/file/", {
        content,
        path: explorer.path,
      })
      .then(async (response) => {
        await axiosInstance
          .get("/theme/file/", {
            params: {
              path: explorer.path,
            },
          })
          .then(({ data }) => {
            Promise.resolve(
              onChangeState({ code: response.data, ...data })
            ).then(() => toast.success(" File Saved Successfully "));
          });
      })
      .catch((error) => console.log(" Error ", error));
  };

  const onClickingTab = async (explorer) => {
    onChangeState({
      explorer,
      content: explorer?.content,
      selectedTab: explorer?.path,
    });
  };

  const onDeselectTab = (explorer) => {
    const files = selectedFiles.filter((file) => file.path !== explorer.path);

    const currentExplorer = files.length ? files[files.length - 1] : null;

    const content = currentExplorer ? currentExplorer?.content : null;

    onChangeState({
      selectedFiles: files,
      content,
      selectedTab: currentExplorer?.path,
      explorer: currentExplorer,
    });
  };

  return (
    <div className="col-md-9 p-0" style={{ minHeight: "100vh" }}>
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex">
            <div style={{ width: "12%", padding: "14px" }}>
              <span className="mr-5">Body Container</span>{" "}
            </div>
            <div style={{ width: "88%" }}>
              {content !== null ? (
                <div className="scrollmenu">
                  {selectedFiles.map((file, key) => (
                    <div
                      className={`nav-link border border-bottom-0 mx-2 tab-button rounded d-flex align-items-center ${
                        selectedTab === file.path ? "tab-active" : null
                      }`}
                      aria-current="page"
                      key={key}
                    >
                      <span
                        onClick={() => onClickingTab(file)}
                        className="mx-1"
                        style={{ cursor: "pointer" }}
                      >
                        {!file?.is_folder ? file?.name : null}
                      </span>

                      <AiOutlineClose
                        size={16}
                        style={{ cursor: "pointer" }}
                        onClick={() => onDeselectTab(file)}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          {content !== null ? (
            <form onSubmit={onSubmit}>
              <textarea
                value={content || ""}
                onChange={(e) => onChangeState({ content: e.target.value })}
                style={{ width: "100%" }}
                rows={27}
              />

              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-success mt-4">
                  Save
                </button>
              </div>
            </form>
          ) : (
            <NoFileSelectedMessage />
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;
