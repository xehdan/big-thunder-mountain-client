import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Checkbox, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormGroup, TextField,
    Autocomplete
} from "@mui/material";
import moment from "moment";
import http from "../../http";

AssemblyDateConfirmationMail.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

function AssemblyDateConfirmationMail(props) {
    const name = "John Doe";
    const assemblyDate = moment(Date(2023, 9, 11)).format('ll');
    const [templates, setTemplates] = useState([])

    useEffect(() => {
        const readTemplates = async () => {
            await http.get(`/api/templateTexts`, {
            })
                .then((response) => {
                    setTemplates(response.data.templates)
                })
                .catch((response) => console.error(response))
        };
        return readTemplates

    }, [name])

    const [mailtext, setMailtext] = useState('');
    const [toAddress, setToAddress] = useState('daniel.maier@thermisto.com')

    const setMailText = (newValue) => {
        const template = newValue.template_text
        const newStr = template.replace(`\${name}`, name)
        const newStr2 = newStr.replace(`\${assemblyDate}`, assemblyDate)
        setMailtext(newStr2)
    }

    async function sendMail() {

        try {
            const regEx = new RegExp('\n', "g");
            const post = await http.post(`api/mailer`, {
                mailTo: toAddress,
                subject: '🔧 Your assembly date has been set - thermisto Montageservice',
                message: mailtext.replace(regEx, `</br>`)
            });
            if (post.data.message.status === 200) {
                console.log("Success")
                console.log(post.data.message)
            } else {
                console.log(post)

            }
        } catch (e) {
            console.log(e.message)
            console.log(e)
        }

    }

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Send date confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom>
                    This assistant makes sure you send all necessary informations regarding an assembly date
                </DialogContentText>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={templates}
                    onChange={(event, newValue) => {
                        setMailText(newValue);
                    }}
                    getOptionLabel={(option) => `${option.language} - ${option.type}`}
                    renderInput={(params) => <TextField {...params} fullWidth label={'Template'} variant={'standard'} />}
                />
                <TextField
                    label="To"
                    fullWidth
                    variant="standard"

                    value={toAddress}
                    onChange={(event) => {
                        setToAddress(event.target.value)
                    }}
                />
                <TextField
                    id="standard-multiline-static"
                    label="Message"
                    multiline
                    fullWidth
                    rows={20}
                    onChange={(event) => {
                        setMailtext(event.target.value);
                    }}
                    InputLabelProps={{shrink: true}}
                    value={mailtext}
                    variant="standard"
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button disabled={!toAddress && !mailtext} onClick={sendMail}>Send</Button>
            </DialogActions>
        </Dialog>
    );
};


export default AssemblyDateConfirmationMail;