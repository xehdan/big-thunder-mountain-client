import React, {useContext, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import http from "../../http";
import {UserContext} from "../../context/UserContext";
import moment from "moment/moment";



const columns = [
    { field: 'id', headerName: 'ID', width: 40 },
    {
        field: 'task',
        headerName: 'Task',
        width: 200,
    },
    {
        field: 'dueDate',
        headerName: 'Due Date',
        width: 130,
        editable: true,
        valueGetter: (params) => { return moment(params.row.dueDate).fromNow() }
    },
    {
        field: 'taskCreator',
        headerName: 'From',
        width: 100,
        editable: true,
    },
    {
        field: 'priority',
        headerName: 'Priority',
        width: 160,
    },
];


function TaskGrid(props) {
    const {username} = useContext(UserContext)

    //const user = props.taskOwner;
    const [userTasks, setUserTasks] = useState([])

    useEffect(() => {
        const readUserTasks = async () => {
            const response = await http.get(`api/task/owner/${username}`);
            setUserTasks(response.data.tasks);
        };
        return readUserTasks
    }, [props, username])

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={userTasks}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
            />
        </Box>
    );
}

export default TaskGrid;