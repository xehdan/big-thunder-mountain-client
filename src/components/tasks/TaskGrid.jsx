import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import http from "../../http";



const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'task',
        headerName: 'Task',
        width: 200,
    },
    {
        field: 'dueDate',
        headerName: 'Due Date',
        width: 100,
        editable: true,
    },
    {
        field: 'taskCreater',
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

    const user = props.taskOwner;
    const [userTasks, setUserTasks] = useState([])

    useEffect(() => {
        const readUserTasks = async () => {
            const response = await http.get(`api/task/owner/${user}`);
            setUserTasks(response.data.tasks);
        };
        return readUserTasks
    }, [props])

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