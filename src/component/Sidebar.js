import React, { useContext } from "react";
import { EditorContext } from "../context/useEditor";
import { FiChevronDown } from "react-icons/fi";
import Folder from "./Folder";
import { AiOutlineFile, AiOutlineFolderOpen } from "react-icons/ai";
import useAuthStore from "../state/useAuthStore";

const Sidebar = () => {
  const { code } = useContext(EditorContext);
  const { onChangeState } = useContext(EditorContext);
  const { user } = useAuthStore((state) => state);

  const onLogoutUser = () => {
    Promise.resolve(localStorage.removeItem("authTokens")).then(() => window.location.reload())
  }

  return (
    <div className="col-md-3 p-0" style={{ minHeight: "100vh" }}>
      <div className="card h-100">
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <FiChevronDown size={24} />
                <span className="text-uppercase">{code.name}</span>
              </div>
              <div>
                <AiOutlineFile
                  size={18}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    onChangeState({
                      isCreateNewFileModelOpen: true,
                      explorer: code,
                    })
                  }
                />{" "}
                <AiOutlineFolderOpen
                  size={18}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    onChangeState({
                      isCreateNewFolderModelOpen: true,
                      explorer: code,
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-2 mx-3">
              {code?.items?.map((item, index) => (
                <Folder explorer={item} key={index} />
              ))}
            </div>
          </div>

        <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex justify-content-center align-items-center bg-danger text-white rounded-circle"
              style={{ width: "64px", height: "64px" }}
            >
              {user?.username?.charAt(0)?.toUpperCase() || " "}
            </div>

            <div className="d-flex align-items-center justify-content-between" style={{flex:1}}>
              <div>
                <span>
                  {user?.username?.charAt(0)?.toUpperCase() +
                    user?.username?.slice(1) || " "}
                </span>
                <br />
                <span>{user?.email || ""}</span>
              </div>
              <div className="text-danger" style={{cursor:"pointer"}} onClick={onLogoutUser}>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
