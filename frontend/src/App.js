import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./services/UserServices";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./redux/slices/userSlice";
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

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
    } finally {
      setIsPending(false);
    }
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
