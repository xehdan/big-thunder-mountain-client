import React, {useState} from 'react';
import {Alert, Box, Button, Grid, Snackbar, Stack, TextField} from "@mui/material";
import http from "../../http";


function Mailer() {

    const [mailTo, setMailTo] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarText, setSnackbarText] = useState("");
    const [snackbarColor, setSnackbarColor] = useState();

    async function sendMail() {

        try {
            const post = await http.post(`api/mailer`, {
                mailTo,
                subject,
                message
            });
            if (post.data.message.status == 200) {
                setSnackbarText(post.data.message.message)
                setSnackbarColor("success")
                setSnackbarOpen(true)
            } else {
                console.log(post)
                setSnackbarText(post.data.message.message)
                setSnackbarColor("error")
            }
        } catch (e) {
            console.log(e.message)
            setSnackbarText(e.message)
            setSnackbarColor("error")
        } finally {
            setSnackbarOpen(true)
        }

    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };


    return (
        <Grid container spacing={2} sx={{ margin: 3 }}>
            <Grid item xs={12}
                component="form"
            >
                <Stack spacing={3}>
                    <TextField
                        label="TO: (e-mail)"
                        value={mailTo}
                        onChange={(event) => setMailTo(event.target.value)}
                    />
                    <TextField
                        label="Subject"
                        value={subject}
                        onChange={(event) => setSubject(event.target.value)}
                    />
                    <TextField
                        label="Message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        multiline
                        rows={10}
                    />
                        <Button variant={"outlined"} onClick={() => sendMail()}>Send</Button>
                </Stack>


            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose}  anchorOrigin={{vertical:'bottom', horizontal: 'right'}}>
                <Alert onClose={handleClose} severity={snackbarColor} sx={{ width: '100%'}}>
                    {snackbarText}
                </Alert>
            </Snackbar>
        </Grid>

    );
}

export default Mailer;