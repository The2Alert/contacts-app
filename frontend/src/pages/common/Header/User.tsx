import * as React from "react";
import {useCallback} from "react";
import {Box, Button, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {runInAction} from "mobx";
import {observer} from "mobx-react";
import {useGlobalStore} from "@store";

export const User: React.FC = observer(() => {
    const globalStore = useGlobalStore();
    const {auth} = globalStore;
    const navigate = useNavigate();
    const handleSignIn = useCallback(() => navigate("/sign-in"), []);
    const handleLogout = useCallback(async () => {
        const response = (await (await fetch("/api/users/logout", {method: "POST"})).json()) as {type: "success"};
        if (response.type === "success")
            runInAction(() => {
                globalStore.auth = {isAuth: false, user: null};
            });
    }, []);
    if (auth.isAuth) {
        return (
            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <Typography>@{auth?.user?.login}</Typography>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
        );
    } else
        return (
            <Button color="inherit" onClick={handleSignIn}>
                Sign in
            </Button>
        );
});
