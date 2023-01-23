import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {DataGrid, GridActionsCellItem, GridToolbar} from "@mui/x-data-grid";
import http from "../../http";
import {Add, Edit, Visibility} from "@mui/icons-material";
import {Button, Card, Grid, Typography} from "@mui/material";
import moment from "moment";

function AssemblyList() {
    const [assemblies, setAssemblies] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [selectedAssemblies, setSelectedAssemblies] = useState([]);

    useEffect(() => {
        const readAllAssemblies = async () => {
            const response = await http.get("api/assembly/withProjectCustomer");
            setAssemblies(response.data.assemblyHead);
        };
        return readAllAssemblies
    }, [])

    function getCustomerName(params) {
        const project = params.row.Project
        const customer = project.Customer
        if (customer.company) {
            return customer.company
        } else {
            return `${customer.firstName} ${customer.lastName}`
        }
    }

    function getLocation(params) {
        const project = params.row.Project
        const deliveryAddress = project.customerDeliveryAddress
        return `${deliveryAddress.zipcode} ${deliveryAddress.city}`
    }

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50,
        },
        {
            field: 'assembly_date',
            headerName: 'Assembly Date',
            width: 200,
            valueGetter: params => {
                return moment(params.row.assembly_date).format('LL')
            }
        },
        {
            field: 'estimated_duration',
            headerName: 'Est. Duration',
            width: 100,
            valueGetter: params => {
                if (params.row.estimated_duration > 1) {
                    return `${params.row.estimated_duration} Days`
                } else {
                    return `${params.row.estimated_duration} Day`
                }}
        },
        {
            field: 'space',
            headerName: 'Space',
            width: 100,
        },
        {
            field: 'projectId',
            headerName: 'Project',
            width: 100
        },
        {
            field: 'completed',
            headerName: 'Status',
            width: 100,
            type: 'boolean'
        },
        {
            field: 'customer.name',
            headerName: 'Customer Name',
            width: 250,
            valueGetter: getCustomerName
        },
        {
            field: 'deliveryLocation',
            headerName: 'Location',
            width: 250,
            valueGetter: getLocation
        }, {
            field: 'actions',
            type: 'actions',
            width: 150,
            align: 'right',
            getActions: (params) => [
                <Link to={`/assembly/${params.id}`}>
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
                        <Typography variant="h2" component="h1" gutterBottom>Assemblies</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{textAlign: 'right'}}>
                        <Button variant="outlined" color="success" startIcon={<Add/>}>New Assembly</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <DataGrid
                                columns={columns}
                                rows={assemblies}
                                autoPageSize
                                pageSize={20}
                                rowsPerPageOptions={[20, 100, 500]}
                                checkboxSelection={selectedAssemblies}
                                disableDensitySelector
                                slots={{Toolbar: GridToolbar}}
                                sx={{height: '80vh'}}
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

export default AssemblyList;