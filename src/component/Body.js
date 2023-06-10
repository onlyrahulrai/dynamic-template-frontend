import React, { useContext } from "react";
import { EditorContext } from "../context/useEditor";
import axiosInstance from "../api/base";
import toast from "react-hot-toast";
import NoFileSelectedMessage from "./NoFileSelectedMessage";

const Body = () => {
  const { content, onChangeState, explorer } = useContext(EditorContext);

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

  return (
    <div className="col-md-9 p-0" style={{ minHeight: "100vh" }}>
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <span className="mr-5">Body Container</span>{" "}
            {content !== null ? (
              <ul className="nav nav-tabs" style={{ marginLeft: "25px" }}>
                <li className="nav-item">
                  <span className="nav-link active" aria-current="page">
                    {!explorer?.is_folder ? explorer?.name : null}
                  </span>
                </li>
              </ul>
            ) : null}
          </div>

          {content !== null ? (
            <form className="mt-2" onSubmit={onSubmit}>
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
