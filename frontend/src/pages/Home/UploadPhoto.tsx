import * as React from "react";
import {useCallback, useRef} from "react";
import {runInAction} from "mobx";
import {observer, useLocalObservable} from "mobx-react";
import {Avatar, Box, Button} from "@mui/material";
import {UploadFile} from "@mui/icons-material";

export interface UploadPhotoProps {
    inputRef?: React.RefObject<HTMLInputElement>;
    photo?: string | null;
}

export interface UploadPhotoStore {
    photo: string | null;
}

export const UploadPhoto: React.FC<UploadPhotoProps> = observer(({photo = null, ...props}) => {
    const store = useLocalObservable<UploadPhotoStore>(() => ({
        photo
    }));
    const inputRef = props.inputRef ?? useRef<HTMLInputElement>(null);
    const handleInputChange = useCallback(() => {
        const input: HTMLInputElement | null = inputRef.current;
        if (input === null) return;
        const file: File | null = input.files?.[0] ?? null;
        if (file === null) return;
        const reader = new FileReader();
        reader.addEventListener("loadend", () => {
            runInAction(() => {
                if (reader.result !== null) store.photo = reader.result.toString();
            });
        });
        reader.readAsDataURL(file);
    }, []);
    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: "20px"}}>
            <Avatar src={store.photo ?? undefined} sx={{width: "120px", height: "120px"}} />
            <label>
                <input
                    ref={inputRef}
                    type="file"
                    name="photo"
                    accept="image/png, image/jpeg"
                    style={{display: "none"}}
                    onChange={handleInputChange}
                />
                <Button component="span" variant="contained" startIcon={<UploadFile />}>
                    {store.photo ? "Change" : "Upload"} photo
                </Button>
            </label>
        </Box>
    );
});
