import {useContext} from "react";
import {GlobalStore, GlobalStoreContext} from ".";

export function useGlobalStore(): GlobalStore {
    const globalStore: GlobalStore | null = useContext(GlobalStoreContext);
    if (globalStore === null) throw new Error("useGlobalStore must be used within a GlobalStoreProvider.");
    return globalStore;
}
