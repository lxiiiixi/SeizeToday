import { lazy, ReactNode, Suspense } from "react";
import { type RouteObject } from "react-router-dom";

import PageLayout from "@/sections/PageLayout";
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Monitor = lazy(() => import("@/pages/ObjectMonitor"));
const Strategy = lazy(() => import("@/pages/Strategies"));
const Situation = lazy(() => import("@/pages/Situation"));
const Service = lazy(() => import("@/pages/Service"));
const RiskAlert = lazy(() => import("@/pages/RiskAlert"));

const NotFound = lazy(() => import("@/pages/Others/404"));
const Components = lazy(() => import("@/pages/Others/Components"));

const lazyLoad = (conponent: ReactNode): ReactNode => {
    return <Suspense fallback={<div>loading</div>}>{conponent}</Suspense>;
};

const routes: RouteObject[] = [
    {
        path: "/",
        element: <PageLayout />,
        children: [
            {
                path: "/dashboard",
                element: lazyLoad(<Dashboard />),
            },
            {
                path: "/monitor",
                element: lazyLoad(<Monitor />),
            },
            {
                path: "/risk",
                element: lazyLoad(<RiskAlert />),
            },
            {
                path: "/strategy",
                element: lazyLoad(<Strategy />),
            },
            {
                path: "/situation",
                element: lazyLoad(<Situation />),
            },
            {
                path: "/service",
                element: lazyLoad(<Service />),
            },
        ],
    },
    {
        path: "/login",
        element: lazyLoad(<Login />),
    },
    {
        path: "/components",
        element: lazyLoad(<Components />),
    },
    {
        path: "*",
        element: lazyLoad(<NotFound />),
    },
];

export default routes;
