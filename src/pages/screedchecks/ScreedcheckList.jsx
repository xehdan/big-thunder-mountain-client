import React, {useEffect, useState} from 'react';
import {DataGrid, GridActionsCellItem, GridToolbar} from "@mui/x-data-grid";
import http from "../../http";
import moment from "moment";
import {Button, Card, Chip, Grid, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {Add, Edit, Visibility} from "@mui/icons-material";

const ScreedcheckList = () => {
    const [screedcheck, setScreedcheck] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [selectedScreedcheck, setSelectedScreedchecks] = useState([])

    useEffect(() => {
        const readAllScreedchecks = async () => {
            const response = await http.get("/api/screedcheck?detail=true");
            //const responseArr = Object.values(response.data.customer);
            setScreedcheck(response.data.screedcheckHead);
        };
        return readAllScreedchecks
    }, [])

    function getStatusFromScreedcheck(params) {

        let status = 'undefined'

        /*if(params.row.datetime_of_screedcheck == null) {
            status = 'New'
        } else if (params.row.datetime_of_screedcheck) {
            status = 'Dated'
        }

        if ('ScreedcheckDetails' in params.row) {
            status = 'Started'
            if (further_checks_necessary) {
                status = 'Further checks necessary'
            }
            else if(screedcheck_completed) {
                status = 'completed'
            }
        }*/

        switch (status) {
            //case 'completed':
            //    return <Chip size="small" label={status} color="success"/>
            //case 'Further checks necessary':
            //    return <Chip size="small" label={status} color="warning"/>
            case 'Started':
                return <Chip size="small" label={status}/>
            case 'Dated':
                return <Chip size="small" label={status}/>
            case 'New':
                return <Chip size="small" label={status} color="danger"/>
            default:
                return <Chip size="small" label={status}/>
        }
    }

    function getResult(params) {
        let result
        if ('ScreedcheckDetail' in params.row) {
            /* if (params.row.ScreedcheckDetail.assembly_possible === true)*/
            result = true
            /*else {
                result = false
            }*/
        } else {
            result = false
        }

        return result
    }

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50
        },
        {
            field: 'projectId',
            headerName: 'Project Id',
            width: 150,
            valueGetter: 0
        },
        {
            field: 'status',
            headerName: 'Status',
            align: 'center',
            width: 150,
            renderCell: getStatusFromScreedcheck
        },
        {
            field: 'result',
            headerName: 'Result',
            width: 100,
            type: 'boolean',
            valueGetter: getResult
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            width: 200,
            valueGetter: (params) => moment(params.row.createdAt).fromNow()
        },
        {
            field: 'screedchecker',
            headerName: 'Screedchecker',
            width: 150,
            valueGetter: (params) => params.row.screedcheckerId != null ? params.row.Employee.firstName + ' ' + params.row.Employee.lastName : ''
        },
        {
            field: 'actions',
            type: 'actions',
            width: 150,
            align: 'right',
            getActions: (params) => [
                <Link to={`/screedcheck/${params.id}`}>
                    <GridActionsCellItem
                        icon={<Visibility/>}
                        label="View"
                        //onClick={goToCustomerPage(params.id)}
                    /></Link>,
                <GridActionsCellItem
                    icon={<Edit/>}
                    label="Edit"
                    //onClick={toggleAdmin(params.id)}
                    showInMenu
                />
            ],
        },
    ]

    return (
        <Grid container sx={{marginTop: 5}}>
            <Grid item xs={12} spacing={2} sx={{paddingX: 3}}>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography variant="h2" component="h1" gutterBottom>Screedchecks</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{textAlign: 'right'}}>
                        <Button variant="outlined" color="success" startIcon={<Add/>}>New Screedcheck</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <DataGrid
                                columns={columns}
                                rows={screedcheck}
                                autoPageSize
                                pageSize={20}
                                rowsPerPageOptions={[20, 100, 500]}
                                checkboxSelection={selectedScreedcheck}
                                disableDensitySelector
                                slots={{Toolbar: GridToolbar}}
                                sx={{ height: '80vh'}}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true,
                                        quickFilterProps: {debounceMs: 500},
                                    }
                                }}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ScreedcheckList;