import React, {useState} from 'react';
import PropTypes from 'prop-types';
import http from "../../http";
import {Stack, TextField, Button} from "@mui/material";

SendTextMessageDialog.propTypes = {

};

function SendTextMessageDialog(props) {
    const [text, setText] = useState('')
    const [toNumber, setToNumber] = useState('')

    async function sendMessage(){
        try {
            const message = http.post(`api/messages`, {
                text,
                toNumber,
                "fromNumber": "thermisto"
            })
                .then(response => console.log(response))
        } catch (e) {
            window.alert(e)
        }
    }


    return (
        <Stack>
            <TextField
                label="To"
                fullWidth
                variant="standard"
                value={toNumber}
                onChange={(event) => {
                    setToNumber(event.target.value)
                }}
            />
            <TextField
                label="Message"
                fullWidth
                multiline
                rows={20}
                onChange={(event) => {
                    setText(event.target.value);
                }}
                value={text}
                variant="standard"
            />
            <Button onClick={sendMessage}>Send Message</Button>
        </Stack>

    );
}

export default SendTextMessageDialog;