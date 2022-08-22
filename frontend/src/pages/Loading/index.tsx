import * as React from "react";
import {AppBar, Box, CircularProgress, Toolbar, Typography} from "@mui/material";

export default function Loading(): React.ReactElement {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        Contacts App
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    width: "100%",
                    height: "calc(100vh - 70px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress size={60} />
            </Box>
        </>
    );
}
