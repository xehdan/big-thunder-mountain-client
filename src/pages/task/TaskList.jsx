import React from 'react';
import {Button, Card, Grid, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import moment from "moment/moment";
import {Add} from "@mui/icons-material";

function TaskList(props) {
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100
        }, {
            field: 'dueDateIn',
            headerName: 'Due in',
            width: 250,
            valueGetter: (params) => moment(params.row.dueDate).fromNow()
        }, {
            field: 'dueDate',
            headerName: 'Due Date',
            width: 250,
            valueGetter: (params) => moment(params.row.dueDate).format('d.MM.yyyy hh:mm')
        },
        {
            field: 'from',
            headerName: 'From',
            width: 200
        }
    ]

    const rows = [
        {id: 1, dueDate: new Date(2022, 10, 9), from: 'Jane Doe'},
        {id: 2, dueDate: new Date(2022, 10, 11), from: 'Jane Doe'},
        {id: 3, dueDate: new Date(2022, 10, 12), from: 'Chuck Norris'},
        {id: 4, dueDate: new Date(2022, 10, 15), from: 'The Undertaker'},
        {id: 5, dueDate: new Date(2022, 10, 20), from: 'Obi-Wan Kenobi'},
    ]

    return (
        <Grid container sx={{marginTop: 5}}>
            <Grid item xs={12} spacing={2} sx={{paddingX: 3}}>
                <Grid container>
                    <Grid item xs={10}><Typography variant="h2" component="h1" gutterBottom>Tasks</Typography></Grid>
                    <Grid item xs={2} sx={{textAlign: 'right'}}>
                        <Button variant="outlined" color="success" startIcon={<Add/>}>New Task</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <DataGrid sx={{height: '80vh'}} columns={columns} rows={rows}/>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default TaskList;