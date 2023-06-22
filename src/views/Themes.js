import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import axiosInstance, { baseURL } from "../api/base";
import LoadingSpinner from "../component/Spinner";

import { toast } from "react-hot-toast";
import Swal from "../config/Swal";
import { useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";
import Error from "../component/Error";

const Themes = () => {
  const [themes, setThemes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadThemes = async () => {
      setLoading(true);
      await axiosInstance
        .get("/theme")
        .then((response) => {
          Promise.resolve(setThemes(response.data)).then(() =>
            setLoading(false)
          );
        })
        .catch((error) => {
          Promise.resolve(setError("Something went wrong \n Please try after sometimes later")).then(() =>
            setLoading(false)
          );
        });
    };

    loadThemes();
  }, []);

  const onSelectThemeConfimed = async (theme) => {
    setRequestLoading(theme.id);

    const selectThemePromise = axiosInstance.post("/theme/", {
      id: theme.id,
    });

    toast.promise(selectThemePromise, {
      loading: "Selecting...",
      success: `${theme?.name} theme is selected successfully!`,
      error: "Couldn't select theme.",
    });

    await selectThemePromise
      .then((response) => {
        Promise.resolve(setRequestLoading(null)).then(() =>
          navigate("/directories")
        );
      })
      .catch((error) => {
        Promise.resolve(setRequestLoading(null));
      });
  };

  const onSelectTheme = (theme) => {
    Swal.fire({
      title: "Are you sure? You want to Select this theme",
      text: "Note: Your selected theme is used in your website.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Create Copy",
    }).then((result) => {
      if (result.isConfirmed) {
        onSelectThemeConfimed(theme);
      }
    });
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <Error message={error} />;

  return (
    <div>
      <Header />
      <div className="container">
        <h3 className="text-center my-5">Select Theme</h3>

        <div className="row row-cols-md-3 justify-content-center">
          {themes.map((theme, key) => (
            <div className="card col m-2" style={{ width: "30%" }} key={key}>
              <img
                src={`${baseURL}${theme.image}`}
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">{theme.name}</h5>
                <p className="card-text">
                  Description: <span>{theme.description}</span>
                </p>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-3"
                  onClick={() => onSelectTheme(theme)}
                  disabled={requestLoading}
                >
                  Select Theme{" "}
                  {requestLoading === theme.id ? (
                    <Spinner style={{ width: "1rem", height: "1rem" }} />
                  ) : null}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Themes;
