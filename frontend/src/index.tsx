/// <reference path="./index.d.ts" />
import "normalize.css";
import "whatwg-fetch";
import * as React from "react";
import {createRoot, Root} from "react-dom/client";
import {configure} from "mobx";
import {GlobalStoreProvider} from "@store";
import {App} from "./App";

(() => {
    configure({enforceActions: "observed"});
    const container: Element | null = document.querySelector(".app");
    if (container === null) return;
    const root: Root = createRoot(container);
    root.render(
        <GlobalStoreProvider>
            <App />
        </GlobalStoreProvider>
    );
})();
