import React, { useContext, useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "reactstrap";
import PropTypes from "prop-types";
import { BsGear } from "react-icons/bs";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { EditorContext } from "../context/useEditor";
import toast from "react-hot-toast";
import axiosInstance from "../api/base";
import Swal from "../config/Swal";

function Settings({ direction, ...args }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { code } = useContext(EditorContext);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onConfirmToPublish = async () => {
    setLoading(true);

    const publishPromise = axiosInstance.post("/theme/publish/", {
      id: searchParams.get("id"),
    });

    toast.promise(publishPromise, {
      loading: "Publishing...",
      success: <b>Theme {code?.name} Published Successfully!</b>,
      error: <b>Could not published.</b>,
    });

    await publishPromise
      .then((response) => {
        Promise.resolve(setLoading(false)).then(() => navigate("/directories"));
      })
      .catch((error) => {
        Promise.resolve(setLoading(false)).then(() =>
          console.log(" Error ", error)
        );
      });
  };

  const onPublish = async () => {
    Swal.fire({
      title: "Are you sure? You want to Publish this theme",
      text:
        "Note: Your production theme will replace by the current theme.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Publish",
    }).then(async (result) => {
      if (result.isConfirmed) {
        onConfirmToPublish()
      }
    });
  };

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div className="d-flex align-items-center">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={direction}>
        <DropdownToggle
          caret
          className="d-flex align-items-center gap-2 btn-light"
        >
          <BsGear size={24} />
          <span className="mr-5">Settings</span>{" "}
        </DropdownToggle>
        <DropdownMenu {...args}>
          <DropdownItem onClick={onPublish} disabled={loading}>
            Publish{" "}
            {loading ? (
              <Spinner
                style={{ width: "1rem", height: "1rem" }}
                color="secondary"
              />
            ) : null}
          </DropdownItem>
          <DropdownItem disabled={loading}>
            <Link
              to={`http://127.0.0.1:8000/?path=${code?.name}`}
              target="_blank"
              className="text-decoration-none text-dark"
            >
              Preview
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

Settings.propTypes = {
  direction: PropTypes.string,
};

export default Settings;
