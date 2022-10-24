import React, {useState} from 'react';
import {Alert, Button, FormControl, Grid, Snackbar, Stack, TextField} from "@mui/material";
import http from "../../http";
import Editor from 'ckeditor5-custom-build/build/ckeditor'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5-custom-build/build/translations/de';

function MailAssistant() {

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
            if (post.data.message.status === 200) {
                setSnackbarText(post.data.message.message)
                setSnackbarColor("success")
                setSnackbarOpen(true)
            } else {
                console.log(post)
                setSnackbarText(post.data.message)
                setSnackbarColor("error")
            }
        } catch (e) {
            console.log(e.message)
            console.log(e)
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
        <Grid container spacing={2}>
            <Grid item xs={12}
                  component="form"
            >
                <Stack spacing={3}>
                    <TextField
                        label="TO: (e-mail)"
                        margin="dense"
                        variant="standard"
                        type="email"
                        value={mailTo}
                        onChange={(event) => setMailTo(event.target.value)}
                    />
                    <TextField
                        autoFocus
                        label="Subject"
                        margin="dense"
                        variant="standard"
                        value={subject}
                        onChange={(event) => setSubject(event.target.value)}
                    />
                    <FormControl variant="standard">
                        <CKEditor
                            editor={Editor}
                            config={{
                                language: 'de'
                            }}
                            data={message}
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                setMessage(data)
                            } }
                        />
                    </FormControl>



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

export default MailAssistant;