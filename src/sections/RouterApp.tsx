import { Route, Routes, useLocation, Navigate, type RouteObject } from "react-router-dom";
import routes from "@/config/router";

function RouterApp() {
    const location = useLocation();
    const { pathname } = location;

    const token = true; // get token

    const handleRedirect = (item: RouteObject) => {
        if (pathname === "/") {
            return <Navigate to="/" />;
        }
        if (pathname !== "/login" && !token) {
            return <Navigate to="/login" replace={true} />;
        } else {
            return item.element;
        }
    };

    const RouteNav = (param: RouteObject[]) => {
        return param.map(item => {
            return (
                <Route path={item.path} element={handleRedirect(item)} key={item.path}>
                    {item?.children && RouteNav(item.children)}
                </Route>
            );
        });
    };
    return <Routes>{RouteNav(routes)}</Routes>;
}

export default RouterApp;
