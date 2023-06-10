import axios from "axios";

const getAuthTokens = () =>
  localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;

const axiosInstance = axios.create({
  baseURL: "https://testing-amojo.up.railway.app",
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${getAuthTokens()?.access}`,
  },
});

axiosInstance.interceptors.request.use(async function(config) {
  // Set the Authorization header with a token
  const token = getAuthTokens();

  if (token) {
    config.headers.Authorization = `Bearer ${token?.access}`;
  }

  return config;
});

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      originalRequest.headers.Authorization
    ) {
      originalRequest._retry = true;

      try{

        const refresh = getAuthTokens()?.refresh;
  
        const { data} = await axios.post("/token/refresh/", { refresh });
  
        localStorage.setItem(
          "authTokens",
          JSON.stringify({ access: data.access, refresh })
        );
  
        originalRequest.headers.Authorization = `Bearer ${data?.access}`;
  
        return getAuthTokens() ? axiosInstance(originalRequest) : null;
      }catch(error){
        Promise.resolve(localStorage.removeItem("authTokens"))
        .then(() => window.location.reload())
      }
    }

    return Promise.reject(error).then(() => {
      localStorage.removeItem("authTokens");
    });
  }
);

export default axiosInstance;
