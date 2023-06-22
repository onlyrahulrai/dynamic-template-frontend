import React, { useEffect, useState } from "react";
import axiosInstance from "../api/base";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../state/useAuthStore";

const Login = (props) => {
  const [data,setData] = useState({username:"qazi",password:"224133"});
  const navigate = useNavigate()
  const { setUser, user} = useAuthStore((state) => state);

  console.log(" User ",user)

  useEffect(()=> {
    if(user){
      navigate('/directories')
    }
  },[props])

  const onSubmit = async (e) => {
    e.preventDefault()

    await axiosInstance.post('/token/',data)
    .then((response) => {
      Promise.resolve(localStorage.setItem("authTokens",JSON.stringify(response.data)))
      .then(async () => {
        await axiosInstance.get("/editor/user-details/")
        .then((response) => {
          Promise.resolve(setUser(response.data))
          .then(() => navigate('/directories'))
        })
      })
    })
    .catch((error) => console.log(" Error ",error))

  }

  const onChange = (e) => setData((prevState) => ({...prevState,[e.target.name]:e.target.value}))

  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column"
      style={{ minHeight: "100vh" }}
    >
      <div className="card rounded-4" style={{ width: "24rem" }}>
        <div className="card-body">
          <h3 className="text-center mt-1 mb-5">Login</h3>
          <form onSubmit={onSubmit}>
            <label htmlFor="username">Username:</label>
            <br />
            <input type="text" name="username" className="form-control" value={data.username} onChange={onChange} required />
            <br />
            <label htmlFor="password">Password:</label>
            <br />
            <input type="text" name="password" className="form-control" value={data.password} onChange={onChange} required />

            <button type="submit" className="btn btn-warning text-white my-4">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
