import React, {useState} from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Input,
    Stack,
    Typography,
} from "@mui/material";
import {useNavigate} from "react-router-dom";



function NewProjectModal(props) {
    let navigate = useNavigate();


    return (
        <Dialog
            open={props.open}
            onClose={props.close}
            maxWidth={"lg"}
            justifyContent="space-between"
            //onClose={props.handleClose()}
        >
            <DialogTitle>Create new Project</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You can either create from scratch or import a .tsc file from external
                </DialogContentText>
                <Stack
                    divider={<Divider orientation="vertical" flexItem />}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{ margin: 4}}
                >
                    <Button onClick={() => navigate('/projectNew')}>From Scratch</Button>
                    <Button onClick={() => navigate('/projectNewUpload')}>Upload</Button>

                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default NewProjectModal;