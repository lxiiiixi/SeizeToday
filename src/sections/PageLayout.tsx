import { Outlet } from "react-router-dom";

import LayoutFooter from "./Layout/LayoutFooter";
import LayoutHeader from "./Layout/LayoutHeader";

function PageLayout() {
    return (
        <div>
                    <Outlet />
        </div>
    );
}

export default PageLayout;
