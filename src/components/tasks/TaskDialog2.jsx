import React, {useContext, useState} from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Snackbar,
    TextField
} from "@mui/material";
import PropTypes from 'prop-types';
import {DatePicker} from "@mui/x-date-pickers";
import {UserContext} from "../../context/UserContext";
import http from "../../http";

function TaskDialog2(props) {
    const { onClose, open, type } = props;
    const user = useContext(UserContext)

    const [taskCreator, setTaskCreator] = useState(user.username);
    const [taskOwner, setTaskOwner] = useState('');
    const [task, setTask] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [priority, setPriority] = useState(1);

    // eslint-disable-next-line no-unused-vars
    const [editable, setEditable] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarText, setSnackbarText] = useState("");
    const [snackbarColor, setSnackbarColor] = useState();

    const handleClose = () => {
        onClose(
            setTaskOwner(''),
            setTask(''),
            setDueDate(null),
            setPriority(1),
            //props.setOpen(false)
        );
    };


    async function storeTask() {
        try {

            const taskToStore = {
                taskCreator: taskCreator,
                taskOwner: taskOwner,
                task: task,
                dueDate: dueDate,
                priority: priority
            }

            const response = await http.post('/api/task/', taskToStore)

            if (response.status === 200) {
                setSnackbarText(response.statusText)
                setSnackbarColor("success")
                setSnackbarOpen(true)
                handleClose()
            } else {
                console.log(response.data)
                setSnackbarText(response.statusText)
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


    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{type} Task</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You can set tasks for yourself or others
                </DialogContentText>
                <TextField
                    margin="dense"
                    id="taskCreator"
                    label="Task Creator"
                    type="text"
                    fullWidth
                    variant="standard"

                    disabled={!editable}
                    value={user.username}
                    onChange={(e) => setTaskCreator(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="taskOwner"
                    label="Task Owner"
                    type="text"
                    fullWidth
                    required
                    variant="standard"
                    value={taskOwner}
                    onChange={(e) => setTaskOwner(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="task"
                    label="Task"
                    type="text"
                    required
                    multiline
                    rows={5}
                    fullWidth
                    variant="standard"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <DatePicker
                    id="dueDate"
                    label="Due Date"
                    required
                    openTo="day"
                    views={['year', 'month', 'day']}
                    value={dueDate}
                    onChange={(newValue) => {
                        setDueDate(newValue);
                    }}
                    renderInput={(params) => <TextField margin="dense"
                                                        variant="standard" fullWidth {...params} />}
                />
                <TextField
                    margin="dense"
                    id="priority"
                    label="Priority"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={storeTask}>Save Task</Button>
            </DialogActions>

            <Snackbar open={snackbarOpen} autoHideDuration={6000}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                <Alert onClose={handleClose} severity={snackbarColor} sx={{width: '100%'}}>
                    {snackbarText}
                </Alert>
            </Snackbar>
        </Dialog>
    );
}

TaskDialog2.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired
};

export default TaskDialog2;