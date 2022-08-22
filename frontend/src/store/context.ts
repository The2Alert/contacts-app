import * as React from "react";
import {GlobalStore} from "./types";

export const GlobalStoreContext = React.createContext<GlobalStore | null>(null);
