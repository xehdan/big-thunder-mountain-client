import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material";
import PropTypes from "prop-types";
import http from "../../http";

function TaskConfirmDialog(props) {
    const { onClose, value: valueProp, open, action, ...other } = props;
    //const [value, setValue] = useState(valueProp);


    const handleCancel = () => {
        onClose();
    };

    const handleOk = async () => {
        console.log(valueProp.transactionId)
        if(action === 'Complete') {
            const response = await http.patch(`/api/task/completed/${valueProp.transactionId}`,)

            if (response.status === 200) {
                console.log(response)
                onClose();
            } else {
                console.log(response)
            }
        } else if (action === 'Delete'){
            const response = await http.delete(`/api/task/${valueProp.transactionId}`,)

            if (response.status === 200) {
                console.log(response)
                onClose();
            } else {
                console.log(response)
            }
        }

    };




    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            open={open}
            {...other}
        >
            <DialogTitle>{action} Task</DialogTitle>
            <DialogContent>
            <DialogContentText>
                <Typography gutterBottom variant="body1">
                    Do you want to {action.toLowerCase()} this task?
                </Typography>
                <Typography variant="caption" display="block">
                    {valueProp ? valueProp.transactionId : ''}
                </Typography>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>{action}</Button>
            </DialogActions>
        </Dialog>
    );
}

TaskConfirmDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    action: PropTypes.string.isRequired,
};

export default TaskConfirmDialog;