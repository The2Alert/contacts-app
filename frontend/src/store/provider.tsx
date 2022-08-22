import * as React from "react";
import {useLocalObservable, observer} from "mobx-react";
import {GlobalStore, GlobalStoreContext} from ".";

export interface GlobalStoreProviderProps {
    children?: React.ReactNode;
}

export const GlobalStoreProvider: React.FC<GlobalStoreProviderProps> = observer(({children}) => {
    const globalStore = useLocalObservable<GlobalStore>(() => ({
        auth: {
            isAuth: false,
            user: null
        }
    }));
    return <GlobalStoreContext.Provider value={globalStore}>{children}</GlobalStoreContext.Provider>;
});
