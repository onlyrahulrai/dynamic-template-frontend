import React, { useEffect, useState } from "react";
import axiosInstance, { baseURL } from "../api/base";
import Spinner from "../component/Spinner";
import Swal from "../config/Swal";
import { Link, useNavigate } from "react-router-dom";
import Header from "../component/Header";
import { AiOutlineArrowRight } from "react-icons/ai";
import Error from "../component/Error";

const Directories = () => {
  const [directories, setDirectories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDirectories = async () => {
      setLoading(true);
      await axiosInstance
        .get("/editor/code-directories/")
        .then((response) => {
          Promise.resolve(setDirectories(response.data)).then(() =>
            setLoading(false)
          );
        })
        .catch((error) => {
          Promise.resolve(setLoading(false)).then(() =>
            setError("Something went wrong \n Please try after sometimes later")
          );
        });
    };

    fetchDirectories();
  }, []);

  const onCreateDirectory = async (id, name) => {
    await axiosInstance
      .post("/editor/code-directories/", {
        id,
        name,
      })
      .then((response) => {
        navigate(`/editor/?id=${response.data.id}`);
      })
      .catch((error) => console.log(" Error ", error));
  };

  const onClickEditCode = async (id) => {
    Swal.fire({
      title: "Are you sure? You want to modify this theme",
      text:
        "You can not modify this theme directly so you have to create a copy of the theme.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Create Copy",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "info",
          title: "Create Theme Copy Form",
          text: "Please enter the name of directory to create copy.",
          input: "text",
          inputPlaceholder: "Enter the name of directory",
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return "You need to enter the name of directory.";
            }
          },
        }).then((response) => {
          onCreateDirectory(id, response.value);
        });
      }
    });
  };

  if (loading) return <Spinner />;

  if (error) return <Error message={error} />;

  return (
    <div>
      <Header />
      <div className="container">
        {directories.length ? (
          <h3 className="text-center my-5">Select Theme to Edit</h3>
        ) : null}
        {directories.length ? (
          <div className="row row-cols-md-3 justify-content-center">
            <>
              {directories.map((directory, key) => (
                <div
                  className="card col m-2"
                  style={{ width: "30%" }}
                  key={key}
                >
                  <img
                    src={`${baseURL}${directory.image}`}
                    className="card-img-top"
                    alt="..."
                  />
                  <div className="card-body">
                    <h5 className="card-title">{directory.name}</h5>
                    <p className="card-text">
                      Status:{" "}
                      <span
                        className={`${
                          directory.public ? "text-danger" : "text-success"
                        } font-bold`}
                      >
                        {directory.public ? "Production" : "Development"}
                      </span>
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        directory.public
                          ? onClickEditCode(directory.id)
                          : navigate(`/editor/?id=${directory.id}`)
                      }
                    >
                      Edit Theme
                    </button>
                  </div>
                </div>
              ))}
            </>
          </div>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center text-center flex-column"
            style={{ minHeight: "80vh" }}
          >
            <span className="text-info">
              You've not selected any theme <br /> So Please select any theme
              after that you can edit.
            </span>

            <Link to="/themes" className="mt-2 text-decoration-none">
              Go To Select Theme <AiOutlineArrowRight size={24} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directories;
