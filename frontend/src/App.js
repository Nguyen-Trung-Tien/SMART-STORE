import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./services/UserServices";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./redux/slices/userSlice";
import Loading from "./components/LoadingComponent/Loading";
import FooterComponent from "./components/FooterComponent/FooterComponent";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const interceptor = UserService.axiosJWT.interceptors.request.use(
      async (config) => {
        const currentTime = new Date();
        const { decoded } = handleDecoded();
        if (decoded?.exp < currentTime.getTime() / 1000) {
          const data = await UserService.refreshToken();
          config.headers["token"] = `Bearer ${data?.access_token}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    return () => {
      UserService.axiosJWT.interceptors.request.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsPending(true);
      const { token, decoded } = handleDecoded();
      if (decoded?.id) {
        await handleGetDetailsUser(decoded?.id, token);
      }
      setIsPending(false);
    };

    fetchUserDetails();
  }, []);

  const handleDecoded = () => {
    const token = localStorage.getItem("access_token");
    let decoded = {};
    if (token) {
      decoded = jwtDecode(token);
    }
    return { decoded, token };
  };

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Loading isLoading={isPending}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const isCheckAuth = !route.isPrivate || user.isAdmin;
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;
              return (
                <Route
                  key={route.path}
                  path={isCheckAuth ? route.path : undefined}
                  element={
                    <Layout>
                      <Page />
                      {/* <FooterComponent /> */}
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  );
}

export default App;
