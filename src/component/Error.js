import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";

const Error = ({message}) => {
  return (
    <div
      className="d-flex justify-content-center text-center align-items-center flex-column"
      style={{ minHeight: "100vh" }}
    >
      <pre className="text-danger my-2">{message}</pre>

      <Link to='/'>Go Back To Home <AiOutlineArrowRight size={24} /></Link>
    </div>
  );
};

export default Error;
