import * as React from "react";
import {Outlet} from "react-router-dom";
import {Header} from "@pages/common/Header";

export function Layout(): React.ReactElement {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}
