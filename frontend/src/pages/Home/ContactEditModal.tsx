import * as React from "react";
import {useCallback, useRef} from "react";
import {runInAction} from "mobx";
import {observer, useLocalObservable} from "mobx-react";
import {Alert, Box, Button, Grid, Modal, TextField, Typography} from "@mui/material";
import {Edit} from "@mui/icons-material";
import {UploadPhoto} from "./UploadPhoto";
import {Contact} from "./Contacts";

export interface EditResponse {
    type: "error" | "success";
    content: string;
}

export interface ContactEditModalProps {
    contact: Contact | null;
    open: boolean;
    onClose: () => any;
    onEdit?: () => any;
}

export interface ContactEditModalStore {
    errors: string[];
}

export const ContactEditModal: React.FC<ContactEditModalProps> = observer(({open, contact, onClose, onEdit}) => {
    const store = useLocalObservable<ContactEditModalStore>(() => ({
        errors: []
    }));
    const photoRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const surnameRef = useRef<HTMLInputElement>(null);
    const contactRef = useRef<HTMLInputElement>(null);
    const handleEditSubmit = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (contact === null) return;
            const id: number = contact.id;
            const photo: File | null = photoRef.current?.files?.[0] ?? null;
            const name: string = nameRef.current?.value ?? "";
            const surname: string = surnameRef.current?.value ?? "";
            const contactPlain: string = contactRef.current?.value ?? "";
            const data = new FormData();
            if (photo !== null) data.set("photo", photo);
            data.set("name", name);
            data.set("surname", surname);
            data.set("contact", contactPlain);
            const response = (await (
                await fetch("/api/contacts/" + id, {
                    method: "PUT",
                    body: data
                })
            ).json()) as EditResponse;
            if (response.type === "error")
                runInAction(() => {
                    store.errors = [response.content];
                });
            else if (response.type === "success") onEdit?.();
        },
        [contact]
    );
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
                {contact ? (
                    <form onSubmit={handleEditSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5" align="center">
                                    Edit contact
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <UploadPhoto inputRef={photoRef} photo={contact.photo} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField inputRef={nameRef} label="Name" name="name" defaultValue={contact.name} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    inputRef={surnameRef}
                                    label="Surname (Optional)"
                                    name="surname"
                                    defaultValue={contact.surname}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    inputRef={contactRef}
                                    label="Phone number or email"
                                    name="contact"
                                    sx={{width: "100%"}}
                                    defaultValue={contact.contact}
                                />
                            </Grid>
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <Button type="submit" variant="contained" startIcon={<Edit />}>
                                    Edit contact
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
                ) : null}
            </Box>
        </Modal>
    );
});
