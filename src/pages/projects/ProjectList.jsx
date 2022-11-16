import React, {useEffect, useState} from 'react';
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import { utcToZonedTime, format } from 'date-fns-tz'

import http from "../../http";
import {Link} from "react-router-dom";
import {Add, Edit, Visibility} from "@mui/icons-material";
import {Button, Grid, Typography, Card} from "@mui/material";


function ProjectList() {
    const [data, setData] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);


    useEffect(() => {
        const readAllProjects = async () => {
            const response = await http.get("/api/project");
            //const responseArr = Object.values(response.data.project);
            setData(response.data.project);
        };
        return readAllProjects;
    }, []);

    const columns = [
        { field: 'transactionId', headerName: 'ID', width: 200},
        {
            field: 'customerId',
            headerName: 'Customer Id',
            width: 150,
            editable: true,
        },
        {
            field: 'invoice_head_id',
            headerName: 'invoice_head_id',
            width: 110,
            editable: true,
        },
        {
            field: 'createdAt',
            headerName: 'createdAt',
            width: 280,
            valueFormatter: (params) => {

                const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
                const zonedDate = utcToZonedTime(params.value, timeZone)
                // zonedDate could be used to initialize a date picker or display the formatted local date/time

                // Set the output to "1.9.2018 18:01:36.386 GMT+02:00 (CEST)"
                const pattern = 'd. MMMM yyyy HH:mm:ss:SSS'
                const output = format(zonedDate, pattern, { timeZone: timeZone })

                //return format(params.value, 'MM/dd/yyyy');*/
                return output
            },
        }, {
            field: 'updatedAt',
            headerName: 'Updated At',
            width: 280,
            valueFormatter: (params) => {
                if (params.value) {
                    const {timeZone} = Intl.DateTimeFormat().resolvedOptions();
                    const zonedDate = utcToZonedTime(params.value, timeZone)
                    // zonedDate could be used to initialize a date picker or display the formatted local date/time

                    // Set the output to "1.9.2018 18:01:36.386 GMT+02:00 (CEST)"
                    const pattern = 'd. MMMM yyyy HH:mm:ss:SSS'
                    const output = format(zonedDate, pattern, {timeZone: timeZone})

                    //return format(params.value, 'MM/dd/yyyy');*/
                    return output
                } else {
                    return null
                }
            },
        },
        {
            field: 'deletedAt',
            headerName: 'Deleted At',
            width: 280,
            valueFormatter: (params) => {
                if (params.value) {
                    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
                    const zonedDate = utcToZonedTime(params.value, timeZone)
                    // zonedDate could be used to initialize a date picker or display the formatted local date/time

                    // Set the output to "1.9.2018 18:01:36.386 GMT+02:00 (CEST)"
                    const pattern = 'd. MMMM yyyy HH:mm:ss:SSS'
                    const output = format(zonedDate, pattern, { timeZone: timeZone })

                    //return format(params.value, 'MM/dd/yyyy');*/
                    return output
                } else {
                    return null
                }
            },
        },
        {
            field: 'actions',
            type: 'actions',
            width: 150,
            align: 'right',
            getActions: (params) => [
                <Link  to={`/project/${params.id}`}>
                    <GridActionsCellItem
                        icon={<Visibility />}
                        label="View"
                        //onClick={goToCustomerPage(params.id)}
                    /></Link>,
                <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    //onClick={toggleAdmin(params.id)}
                    showInMenu
                />
            ],
        },
    ];

    return (
        <Grid container sx={{marginTop: 5}}>
            <Grid item xs={12} spacing={2} sx={{ paddingX: 3}}>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography variant="h2" component="h1" gutterBottom>Projects</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{textAlign: 'right'}}>
                        <Button variant="outlined" color="success" startIcon={<Add/>}>New Project</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <DataGrid
                                columns={columns}
                                rows={data}
                                sx={{ height: '80vh'}}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

    );
}

export default ProjectList;