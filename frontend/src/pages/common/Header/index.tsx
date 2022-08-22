import * as React from "react";
import {AppBar, Toolbar, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {User} from "./User";

export function Header(): React.ReactElement {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1, color: "inherit", textDecoration: "none"}}>
                    <Link to="/" style={{color: "inherit", textDecoration: "none"}}>
                        Contacts App
                    </Link>
                </Typography>
                <User />
            </Toolbar>
        </AppBar>
    );
}
