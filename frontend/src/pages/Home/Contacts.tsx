import * as React from "react";
import {useCallback, useEffect, useRef} from "react";
import {runInAction} from "mobx";
import {observer, useLocalObservable} from "mobx-react";
import {Avatar, Box, Button, CircularProgress, Container, Grid, IconButton, Paper, TextField, Typography} from "@mui/material";
import {Add, Delete, Edit, Email, Phone} from "@mui/icons-material";
import {ContactAddModal} from "./ContactAddModal";
import {ContactEditModal} from "./ContactEditModal";

export const ContactsLoading: React.FC = React.memo(() => {
    return (
        <Box
            sx={{
                width: "100%",
                height: "calc(100vh - 120px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <CircularProgress size={60} />
        </Box>
    );
});

export enum ContactTypes {
    NONE,
    EMAIL,
    PHONE
}

export interface Contact {
    id: number;
    type: ContactTypes;
    photo: string | null;
    name: string;
    surname: string;
    contact: string;
    userId: number;
}

export interface DeleteResponse {
    type: "error" | "success";
    content: string;
}

export interface ContactsStore {
    loaded: boolean;
    query: string | null;
    list: Contact[];
    addModalOpened: boolean;
    edit: Contact | null;
    editModalOpened: boolean;
}

export const Contacts: React.FC = observer(() => {
    const store = useLocalObservable<ContactsStore>(() => ({
        loaded: false,
        query: null,
        list: [],
        addModalOpened: false,
        edit: null,
        editModalOpened: false
    }));
    const handleAddClick = useCallback(() => {
        runInAction(() => {
            store.addModalOpened = true;
        });
    }, []);
    const handleAddModalClose = useCallback(() => {
        runInAction(() => {
            store.addModalOpened = false;
        });
    }, []);
    const load = useCallback(async () => {
        const params = new URLSearchParams();
        if (store.query !== null) params.set("q", store.query);
        const contacts = (await (await fetch("/api/contacts?" + params)).json()) as Contact[];
        runInAction(() => {
            store.list = contacts;
            store.loaded = true;
        });
    }, [store.query]);
    const handleAdd = useCallback(async () => {
        await load();
        runInAction(() => {
            store.addModalOpened = false;
        });
    }, []);
    const handleEditClick = useCallback((contact: Contact) => {
        runInAction(() => {
            store.edit = contact;
            store.editModalOpened = true;
        });
    }, []);
    const handleEdit = useCallback(async () => {
        await load();
        runInAction(() => {
            store.editModalOpened = false;
        });
    }, []);
    const handleEditModalClose = useCallback(() => {
        runInAction(() => {
            store.editModalOpened = false;
        });
    }, []);
    const handleDelete = useCallback(async (contact: Contact) => {
        const response = (await (await fetch("/api/contacts/" + contact.id, {method: "DELETE"})).json()) as DeleteResponse;
        if (response.type === "success") await load();
    }, []);
    const searchRef = useRef<HTMLInputElement>(null);
    const handleSearch = useCallback(async () => {
        const query: string | null = searchRef.current?.value ?? null;
        runInAction(() => {
            store.query = query ? query : null;
        });
        await load();
    }, []);
    useEffect(() => {
        load();
    }, []);
    if (!store.loaded) return <ContactsLoading />;
    return (
        <>
            <Container sx={{paddingTop: "20px"}}>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Typography variant="h5">Contacts</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
                        Add contact
                    </Button>
                </Box>
                <Grid container spacing={2} sx={{paddingTop: "20px"}}>
                    <Grid item xs={12} sm={8} md={4} lg={3}>
                        <TextField
                            inputRef={searchRef}
                            fullWidth
                            placeholder="Search"
                            value={store.query ?? ""}
                            onInput={handleSearch}
                        />
                    </Grid>
                </Grid>
                {store.list.length === 0 ? (
                    <Box sx={{paddingTop: "40px"}}>
                        <Typography variant="body1" align="center">
                            {store.query === null ? "Contact list empty." : "Contacts not found."}
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2} sx={{paddingTop: "20px"}}>
                        {store.list.map((contact) => {
                            const {id, type, name, surname, photo, contact: contactPlain} = contact;
                            const link: string = type === ContactTypes.PHONE ? `tel:${contactPlain}` : `mailto:${contactPlain}`;
                            return (
                                <Grid key={id} item xs={12} md={6} lg={4}>
                                    <Paper>
                                        <Box sx={{display: "flex", justifyContent: "space-between", padding: "20px"}}>
                                            <Box sx={{display: "flex", gap: "16px", alignItems: "center"}}>
                                                <Avatar src={photo ? photo + "?" + Date.now() : undefined} />
                                                <Box sx={{display: "flex", flexDirection: "column", gap: "2px"}}>
                                                    <Typography variant="subtitle1">
                                                        {name} {surname}
                                                    </Typography>
                                                    <Typography variant="body2">{contactPlain}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{display: "flex", alignItems: "center"}}>
                                                <IconButton component="a" href={link}>
                                                    {type === ContactTypes.PHONE ? <Phone /> : <Email />}
                                                </IconButton>
                                                <IconButton color="primary" onClick={handleEditClick.bind(undefined, contact)}>
                                                    <Edit />
                                                </IconButton>
                                                <IconButton color="error" onClick={handleDelete.bind(undefined, contact)}>
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>
            <ContactAddModal open={store.addModalOpened} onAdd={handleAdd} onClose={handleAddModalClose} />
            <ContactEditModal
                open={store.editModalOpened}
                contact={store.edit}
                onEdit={handleEdit}
                onClose={handleEditModalClose}
            />
        </>
    );
});
