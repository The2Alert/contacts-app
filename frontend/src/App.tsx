import * as React from "react";
import {useEffect} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {runInAction} from "mobx";
import {observer, useLocalObservable} from "mobx-react";
import {AuthInfo, GlobalStore, useGlobalStore} from "@store";
import Loading from "@pages/Loading";
import NotFound from "@pages/NotFound";
import {Layout} from "./Layout";

export const Home = React.lazy(() => import("@pages/Home"));

export const SignIn = React.lazy(() => import("@pages/SignIn"));

export interface AppStore {
    loaded: boolean;
}

export const App: React.FC = observer(() => {
    const globalStore: GlobalStore = useGlobalStore();
    const store: AppStore = useLocalObservable(() => ({loaded: false}));
    useEffect(() => {
        (async () => {
            const auth = (await (await fetch("/api/users/auth")).json()) as AuthInfo;
            runInAction(() => {
                globalStore.auth = auth;
                store.loaded = true;
            });
        })();
    }, []);
    if (!store.loaded) return <Loading />;
    return (
        <React.Suspense fallback={<Loading />}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="sign-in" element={<SignIn />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </React.Suspense>
    );
});
