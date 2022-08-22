import * as React from "react";
import {useCallback, useRef} from "react";
import {Helmet} from "react-helmet";
import {Alert, Box, Button, Container, Grid, Paper, TextField, Typography} from "@mui/material";
import {observable, runInAction} from "mobx";
import {observer, useLocalObservable} from "mobx-react";
import {Navigate} from "react-router-dom";
import {useGlobalStore, AuthInfo} from "@store";

export interface LoginResponse {
    type: "error" | "success";
    content: string;
}

export interface SignInStore {
    errors: string[];
}

const SignIn: React.FC = observer(() => {
    const globalStore = useGlobalStore();
    const loginRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const store = useLocalObservable<SignInStore>(() => ({
        errors: []
    }));
    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new URLSearchParams();
        data.set("login", loginRef.current?.value ?? "");
        data.set("password", passwordRef.current?.value ?? "");
        const response = (await (
            await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: data
            })
        ).json()) as LoginResponse;
        if (response.type === "error")
            runInAction(() => {
                store.errors = [response.content];
            });
        else if (response.type === "success") {
            const auth = (await (await fetch("/api/users/auth")).json()) as AuthInfo;
            runInAction(() => {
                globalStore.auth = auth;
            });
        }
    }, []);
    if (globalStore.auth.isAuth) return <Navigate to="/" />;
    return (
        <>
            <Helmet>
                <title>Sign In - Contacts App</title>
            </Helmet>
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px"
                }}
            >
                <Paper
                    sx={{
                        padding: "20px"
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} display="flex" flexDirection="column" alignItems="center">
                            <Grid item xs={12}>
                                <Typography variant="h5">Sign In</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Login"
                                    name="login"
                                    sx={{
                                        width: 270
                                    }}
                                    inputRef={loginRef}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    type="password"
                                    label="Password"
                                    name="password"
                                    sx={{
                                        width: 270
                                    }}
                                    inputRef={passwordRef}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" type="submit">
                                    Sign in
                                </Button>
                            </Grid>
                            {store.errors.length > 0 ? (
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        width: "100%"
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px"
                                        }}
                                    >
                                        {store.errors.map((error, index) => {
                                            return (
                                                <Alert key={index} severity="error">
                                                    {error}
                                                </Alert>
                                            );
                                        })}
                                    </Box>
                                </Grid>
                            ) : null}
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </>
    );
});

export default SignIn;
