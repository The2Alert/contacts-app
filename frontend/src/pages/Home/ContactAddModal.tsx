import * as React from "react";
import {useCallback, useRef} from "react";
import {runInAction} from "mobx";
import {observer, useLocalObservable} from "mobx-react";
import {Alert, Box, Button, Grid, Modal, TextField, Typography} from "@mui/material";
import {Add} from "@mui/icons-material";
import {UploadPhoto} from "./UploadPhoto";

export interface CreateResponse {
    type: "error" | "success";
    content: string;
}

export interface ContactAddModalProps {
    open: boolean;
    onClose: () => any;
    onAdd?: () => any;
}

export interface ContactAddModalStore {
    errors: string[];
}

export const ContactAddModal: React.FC<ContactAddModalProps> = observer(({open, onClose, onAdd}) => {
    const store = useLocalObservable<ContactAddModalStore>(() => ({
        errors: []
    }));
    const photoRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const surnameRef = useRef<HTMLInputElement>(null);
    const contactRef = useRef<HTMLInputElement>(null);
    const handleAddSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const photo: File | null = photoRef.current?.files?.[0] ?? null;
        const name: string = nameRef.current?.value ?? "";
        const surname: string = surnameRef.current?.value ?? "";
        const contact: string = contactRef.current?.value ?? "";
        const data = new FormData();
        if (photo !== null) data.set("photo", photo);
        data.set("name", name);
        data.set("surname", surname);
        data.set("contact", contact);
        const response = (await (
            await fetch("/api/contacts", {
                method: "POST",
                body: data
            })
        ).json()) as CreateResponse;
        if (response.type === "error")
            runInAction(() => {
                store.errors = [response.content];
            });
        else if (response.type === "success") onAdd?.();
    }, []);
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    width: "300px"
                }}
            >
                <form onSubmit={handleAddSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5" align="center">
                                Add contact
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <UploadPhoto inputRef={photoRef} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField inputRef={nameRef} label="Name" name="name" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField inputRef={surnameRef} label="Surname (Optional)" name="surname" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField inputRef={contactRef} label="Phone number or email" name="contact" sx={{width: "100%"}} />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <Button type="submit" variant="contained" startIcon={<Add />}>
                                Add contact
                            </Button>
                        </Grid>
                        {store.errors.length > 0 ? (
                            <Grid item xs={12}>
                                <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
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
            </Box>
        </Modal>
    );
});
