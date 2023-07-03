import React, { useContext } from "react";
import { EditorContext } from "../context/useEditor";
import axiosInstance from "../api/base";
import toast from "react-hot-toast";
import NoFileSelectedMessage from "./NoFileSelectedMessage";
import { AiOutlineClose } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import Settings from "./SettingsButton";
import Swal from "../config/Swal";

const Body = () => {
  const {
    content,
    onChangeState,
    explorer,
    selectedFiles,
    selectedTab,
    onSaveFileByCTRL,
  } = useContext(EditorContext);
  const [searchParams] = useSearchParams();

  const onSubmit = async (e) => {
    e.preventDefault();

    const onSaveFilePromise = axiosInstance.put(
      "/editor/file/",
      {
        content,
        path: explorer.path,
      },
      {
        params: {
          id: searchParams.get("id"),
        },
      }
    );

    toast.promise(onSaveFilePromise, {
      loading: "Saving...",
      success: "File Saved Successfully",
      error: `Couldn't save file ${explorer?.name}`,
    });

    await onSaveFilePromise
      .then(async (response) => {
        await axiosInstance
          .get("/editor/file/", {
            params: {
              path: explorer.path,
            },
          })
          .then(({ data }) => {
            const { content, path } = data;

            const tempSelectedFiles = selectedFiles.map((file) => {
              if (file.path === path) {
                return { ...file, content, saved: true };
              }
              return file;
            });

            Promise.resolve(
              onChangeState({
                code: response.data,
                content,
                selectedFiles: tempSelectedFiles,
                explorer:{...explorer,saved:true}
              })
            );
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

  const onCloseFile = (tab) => {
    const files = selectedFiles.filter((file) => file.path !== tab.path);

    const object = {};

    if (files.findIndex((file) => file.path === explorer?.path) !== -1) {
      object["selectedFiles"] = files;
    } else {
      const explorerIndex = files.length ? files.length : null;

      object["selectedFiles"] = explorerIndex ? files : [];

      object["explorer"] = explorerIndex ? files[explorerIndex - 1] : null;

      object["selectedTab"] = explorerIndex ? files[explorerIndex - 1]?.path : null;

      object["content"] = explorerIndex ? files[explorerIndex - 1]?.content : null;
    }

    onChangeState(object);
  };

  const onDeselectTab = (tab) => {
    if (
      tab?.path === explorer?.path
        ? explorer?.saved
        : selectedFiles.findIndex(
            (file) => file.path === tab.path && !file.saved
          ) === -1
    ) {
      onCloseFile(tab);
    } else {
      Swal.fire({
        icon: "warning",
        title: `Do you want to \n save  the changes you made to ${tab?.name}?`,
        text: "your changes will be lost if you don't save them.",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
        customClass: {
          title: "fs-4 lh-sm",
        },
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          onSaveFileByCTRL();
        } else if (result.isDenied) {
          onCloseFile(tab);
        }
      });
    }
  };

  return (
    <div className="col-md-9 p-0" style={{ minHeight: "100vh" }}>
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex">
            <Settings />

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
                onChange={(e) =>
                  onChangeState({
                    content: e.target.value,
                    explorer: { ...explorer, saved: false },
                  })
                }
                style={{ width: "100%" }}
                rows={27}
              />
              <small className="text-sm text-info">
                You can also save files by pressing CTRL+S Button.
              </small>

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
