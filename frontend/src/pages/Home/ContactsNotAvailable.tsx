import * as React from "react";
import {useCallback} from "react";
import {Box, Button, Container, Paper, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

export const ContactsNotAvailable: React.FC = React.memo(() => {
    const navigate = useNavigate();
    const handleSignIn = useCallback(() => {
        navigate("/sign-in");
    }, []);
    return (
        <Container sx={{display: "flex", justifyContent: "center", paddingTop: "20px"}}>
            <Paper sx={{padding: "15px 30px"}}>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", maxWidth: "300px"}}>
                    <Typography variant="h5">Contacts not available</Typography>
                    <Typography variant="body2">You need to sign in!</Typography>
                    <Button onClick={handleSignIn}>Sign in</Button>
                </Box>
            </Paper>
        </Container>
    );
});
