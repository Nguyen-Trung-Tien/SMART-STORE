import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { routes } from "./routes";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./services/UserServices";
import { useDispatch, useSelector } from "react-redux";
import { resetUser, updateUser } from "./redux/slices/userSlice";
import Loading from "./components/LoadingComponent/Loading";
import LayoutComponent from "./components/LayoutFooter/LayoutFooter";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setIsPending(false);
  }, []);

  const handleDecoded = () => {
    let storageData =
      user?.access_token || localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      let storageRefreshToken = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storageRefreshToken);
      const decodedRefreshToken = jwtDecode(refreshToken);
      if (decoded?.exp < currentTime.getTime() / 1000) {
        if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
          const data = await UserService.refreshToken(refreshToken);
          config.headers["token"] = `Bearer ${data?.access_token}`;
        } else {
          dispatch(resetUser());
        }
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storageRefreshToken);
    const res = await UserService.getDetailsUser(id, token);
    dispatch(
      updateUser({
        ...res?.data,
        access_token: token,
        refreshToken: refreshToken,
      })
    );
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Loading isLoading={isPending}>
        <Router>
          <LayoutComponent>
            <Routes>
              {routes.map((route) => {
                const Page = route.page;
                const isCheckAuth = !route.isPrivate || user.isAdmin;

                return (
                  <Route
                    key={route.path}
                    path={isCheckAuth ? route.path : undefined}
                    element={
                      <LayoutComponent
                        isShowFooter={route.isShowFooter}
                        isShowHeader={route.isShowHeader}
                      >
                        <Page />
                      </LayoutComponent>
                    }
                  />
                );
              })}
            </Routes>
          </LayoutComponent>
        </Router>
      </Loading>
    </div>
  );
}

export default App;
