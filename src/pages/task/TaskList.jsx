import React, {useContext, useEffect, useState} from 'react';
import {
    Alert,
    Button,
    Card, CardActions,
    CardContent,
    FormControlLabel,
    FormGroup,
    Grid, IconButton, Snackbar, Stack,
    Switch, TextField,
    Typography
} from "@mui/material";
import {DataGrid, GridActionsCellItem, GridToolbar} from "@mui/x-data-grid";
import moment from "moment";
import {Add, AssignmentTurnedIn, Delete, PriorityHigh, Edit} from "@mui/icons-material";
import http from "../../http";
import {UserContext} from "../../context/UserContext";
import TaskDialog2 from "../../components/tasks/TaskDialog2";
import TaskConfirmDialog from "../../components/tasks/TaskConfirmDialog";
import {DatePicker} from "@mui/x-date-pickers";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import 'moment/dist/locale/de'





function TaskList(props) {
    const user = useContext(UserContext)
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [filter, setFilter] = useState(true);
    const [selectedTask, setSelectedTask] = useState();
    const [selectionModel, setSelectionModel] = useState({});
    const [confirmedTask, setConfirmedTask] = useState();
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarText, setSnackbarText] = useState("");
    const [snackbarColor, setSnackbarColor] = useState();
    const [filterMode, setFilterMode] = useState({
        items: [{
            columnField: 'taskOwner',
            operatorValue: 'equals',
            value: user.username,
        }]
    })
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);


    const readTasks = async () => {
        setTasks([])
        const response = await http.get(`api/task/`);
        setTasks(response.data.task)
    }


    const handleClose = () => {
        setOpen(false);
        setSelectedTask({});
        readTasks()
    };


    const handleConfirmClose = () => {
        setOpenConfirm(false);
        setConfirmedTask(null)
    }
    const handleDeleteClose = () => {
        setOpenDelete(false);
        setConfirmedTask(null)
    }

    const handleClickConfirm = (params) => {
        setConfirmedTask(params.row)
        setOpenConfirm(true)
    }

    const handleClickDelete = (params) => {
        setConfirmedTask(params.row)
        setOpenDelete(true)
    }

    const handleClickUpdate = () => {
        setUpdateMode(true)
    }

    const handleClickOpen = (params) => {
        setOpen(true);
    };

    async function fireUpdate() {
        try {
            const transactionId = selectedTask.transactionId
            const taskToUpdate = {
                taskCreator: selectedTask.taskCreator,
                taskOwner: selectedTask.taskOwner,
                task: selectedTask.task,
                dueDate: selectedTask.dueDate,
                priority: selectedTask.priority
            }

            const response = await http.patch(`/api/task/${transactionId}`, taskToUpdate)

            if (response.status === 201) {
                setSnackbarText(response.statusText)
                setSnackbarColor("success")
                handleClose()
            } else {
                console.log(response.data)
                setSnackbarText(response.statusText)
                setSnackbarColor("error")
            }
        } catch (e) {
            console.log(e.message)
            setSnackbarText(e.message)
            setSnackbarColor("error")
        } finally {
            setSnackbarOpen(true)
            setUpdateMode(false)
            readTasks()
            setSelectedTask({})
            setSnackbarOpen(false)
        }
    }

    useEffect(() => {
        return readTasks
    }, [confirmedTask])

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50
        }, {
            field: 'priority',
            headerName: 'Priority',
            align: 'center',
            width: 100,
            renderCell: (params) => {
                const priority = params.row.priority
                const container = []
                for (let i = 0; i < priority; i++) {
                    container.push(<PriorityHigh fontSize="inherit"/>)
                }
                return container
            }
        }, {
            field: 'dueDateIn',
            headerName: 'Due',
            width: 120,
            valueGetter: (params) => moment(params.row.dueDate).fromNow()
        }, {
            field: 'dueDate',
            headerName: 'Due Date',
            width: 100,
            valueGetter: (params) => moment(params.row.dueDate).format('ll')
        },
        {
            field: 'completed',
            headerName: '',
            width: 50,
            type: 'boolean'
        },
        {
            field: 'taskCreator',
            headerName: 'From',
            width: 150
        },

        {
            field: 'taskOwner',
            headerName: 'To',
            width: 150
        }, {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<AssignmentTurnedIn/>}
                    label="Completed"
                    onClick={() => handleClickConfirm(params)}
                    disabled={params.row.taskOwner === user.username ? false : true}
                />,
                <GridActionsCellItem
                    icon={<Delete/>}
                    label="Delete Task"
                    onClick={() => handleClickDelete(params)}
                    disabled={params.row.taskOwner === user.username ? false : true}
                    showInMenu
                />,
                /* <GridActionsCellItem
                     icon={<FileCopyIcon />}
                     label="Duplicate User"
                     onClick={duplicateUser(params.id)}
                     showInMenu
                 />,*/
            ],
        },
    ]

    const rows = tasks


    function handleFilter() {
        const current = filter
        setFilter(!current)
        switch (current) {
            case false:
                setFilterMode({
                    items: [{
                        columnField: 'taskOwner',
                        operatorValue: 'equals',
                        value: user.username,
                    }]
                })
                break
            case true:
                setFilterMode({items: []})
                break
            default:
                setFilterMode({items: []})
                break
        }
    }


    return (
        <>
            <TaskConfirmDialog onClose={handleConfirmClose} value={confirmedTask} open={openConfirm} action="Complete"/>
            <TaskConfirmDialog onClose={handleDeleteClose} value={confirmedTask} open={openDelete} action="Delete"/>
            <TaskDialog2 onClose={handleClose} open={open}/>
            <Grid container sx={{marginTop: 5}}>
                <Grid item xs={12} sx={{paddingX: 3}}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} xl={10}><Typography variant="h2"
                                                               component="h1">{filter ? 'My Tasks' : 'All Tasks'}</Typography></Grid>
                        <Grid item xs={12} xl={2} sx={{textAlign: 'right'}}>
                            <Button variant="outlined" color="success" onClick={handleClickOpen} startIcon={<Add/>}>New
                                Task
                            </Button>
                        </Grid>
                        <Grid item xs={12} xl={12} gutterBottom>
                            <FormGroup>
                                <FormControlLabel control={<Switch
                                    checked={filter}
                                    onChange={handleFilter}
                                    inputProps={{'aria-label': 'Filter tasks'}}
                                />} label={"Only my tasks"}/>
                            </FormGroup>

                        </Grid>
                        <Grid item xs={12} xl={selectedTask ? 8 : 12}>
                            <Card>
                                <DataGrid
                                    components={{
                                        Toolbar: GridToolbar,
                                    }}
                                    sx={{height: '80vh'}}
                                    columns={columns}
                                    rows={rows}
                                    filterModel={filterMode}
                                    disableMultipleSelection={true}
                                    onFilterModelChange={(newFilterModel) => setFilterMode(newFilterModel)}
                                    onSelectionModelChange={(id) => {
                                        const selectedId = new Set(id);
                                        const selectedRowData = rows.filter((row) => selectedId.has(row.id));
                                        setSelectedTask(selectedRowData[0])
                                    }}
                                    selectionModel={selectionModel}
                                />
                            </Card>
                        </Grid>
                        {selectedTask ?
                            <>
                                <Grid item xs={12} xl={4}>
                                    <Card>

                                        {selectedTask ? <>
                                        {updateMode ? <CardContent>
                                            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={'de'}>
                                                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                                                    {selectedTask.transactionId}
                                                </Typography>
                                                <TextField
                                                    margin="dense"
                                                    id="taskCreator"
                                                    label="Task Creator"
                                                    type="text"
                                                    fullWidth
                                                    variant="standard"
                                                    disabled={true}
                                                    onChange={(newValue) => {
                                                    setSelectedTask(prevState => ({
                                                        ...prevState,
                                                        taskCreator: newValue.target.value
                                                    }))}
                                                    }
                                                    value={selectedTask.taskCreator}
                                                />
                                                <TextField
                                                    margin="dense"
                                                    id="taskOwner"
                                                    label="Task Owner"
                                                    type="text"
                                                    fullWidth
                                                    variant="standard"
                                                    value={selectedTask.taskOwner}
                                                    onChange={(newValue) =>
                                                    setSelectedTask(prevState => ({
                                                        ...prevState,
                                                        taskOwner: newValue.target.value
                                                    }))}
                                                />
                                                <DatePicker
                                                    id="dueDate"
                                                    label="Due Date"
                                                    required
                                                    openTo="day"
                                                    views={['year', 'month', 'day']}
                                                    fullWidth
                                                    value={selectedTask.dueDate}
                                                    onChange={(newValue) =>
                                                        //console.log(newValue._d)
                                                        setSelectedTask(prevState => ({
                                                            ...prevState,
                                                            dueDate: newValue._d
                                                        }))}
                                                    renderInput={(params) => <TextField margin="dense"
                                                                                        variant="standard"
                                                                                        fullWidth {...params} />}
                                                />
                                                <TextField
                                                    margin="dense"
                                                    id="task"
                                                    label="Task"
                                                    type="text"
                                                    variant="standard"
                                                    required
                                                    fullWidth
                                                    multiline
                                                    rows={10}
                                                    value={selectedTask.task}
                                                    onChange={(newValue) =>
                                                        setSelectedTask(prevState => ({
                                                            ...prevState,
                                                            task: newValue.target.value
                                                        }))}
                                                />
                                            </LocalizationProvider>
                                        </CardContent> : <CardContent>
                                            <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                                                {selectedTask.transactionId}
                                            </Typography>
                                            <Typography variant="h5" component="div">
                                                from: {user.username === selectedTask.taskCreator ? 'You' : selectedTask.taskCreator} to: {user.username === selectedTask.taskOwner ? 'You' : selectedTask.taskOwner}
                                            </Typography>
                                            <Typography sx={{mb: 1.5}} color="text.secondary">
                                                Due: {moment(selectedTask.dueDate).fromNow()}
                                            </Typography>
                                            <Typography variant="body1" sx={{mb: 1.5}}
                                                        style={{'white-space': 'pre-line'}}>
                                                {selectedTask.task}
                                            </Typography>
                                            <Typography variant="body2">
                                                Created: {moment(selectedTask.createdAt).format('LLL')}
                                                <br/>
                                                Updated: {moment(selectedTask.updatedAt).format('LLL')}
                                            </Typography>
                                        </CardContent>}
                                        {updateMode ?
                                            <CardActions>
                                                <Grid container>
                                                    <Grid item xs={12}>
                                                        <Stack spacing={2} direction="row" justifyContent="flex-end">
                                                            <Button variant="outlined" color="success" onClick={() => setUpdateMode(false)}>
                                                                Cancel
                                                            </Button>
                                                            <Button variant="contained" color="success" onClick={fireUpdate}>
                                                                Update
                                                            </Button>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </CardActions> : <>
                                                <CardActions disableSpacing>
                                                    <Grid container>
                                                        <Grid item xs={6}>
                                                            <IconButton
                                                                disabled={selectedTask.taskOwner === user.username ? false : true}
                                                                onClick={() => setUpdateMode(true)}
                                                                size="small"><Edit/></IconButton>
                                                            <IconButton
                                                                disabled={selectedTask.taskOwner === user.username ? false : true}
                                                                size="small"><Delete/></IconButton>
                                                        </Grid>
                                                        <Grid xs={6} item sx={{textAlign: 'right'}}>
                                                            <IconButton
                                                                disabled={selectedTask.taskOwner === user.username ? false : true}
                                                                size="small"><AssignmentTurnedIn/></IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </CardActions>
                                            </>}
                                            </> : <CardContent><Typography sx={{mb: 1.5}} color="text.secondary">No Task
                                            selected</Typography></CardContent>
                                        }

                                    </Card>
                                </Grid>
                            </>
                            :
                            ''}

                    </Grid>
                </Grid>
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={2000}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                <Alert onClose={handleClose} severity={snackbarColor} sx={{width: '100%'}}>
                    {snackbarText}
                </Alert>
            </Snackbar>
        </>
    );
}

export default TaskList;