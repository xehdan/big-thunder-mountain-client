import React, {useEffect, useState} from 'react';
import {DataGrid, GridActionsCellItem, GridToolbar} from "@mui/x-data-grid";

import http from "../../http";
import {Link} from "react-router-dom";
import {Add, Edit, Visibility} from "@mui/icons-material";
import {Button, Grid, Typography, Card, Chip, FormGroup, FormControlLabel, Switch} from "@mui/material";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import NewProjectModal from "../../components/project/NewProjectModal";


function ProjectList() {
    const navigate = useNavigate()
    const [data, setData] = useState([]);
    const [deleted, setDeleted] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        deletedAt: false,
        customerGroup: false
    });
    const readAllProjects = async () => {
        //setData([])
        const response = await http.get("/api/project", {
            params: {
                detail: true,
                deleted: !deleted
            }
        });
        //const responseArr = Object.values(response.data.project);
        setData(response.data.project);
    }

    useEffect(() => {
        return readAllProjects;
    }, [deleted]);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            type: 'number',
            width: 60,
        },
        {
            field: 'customerName',
            headerName: 'Customer',
            width: 250,
            valueGetter: (params) => {
                const customer = params.row.Customer
                const firstName = customer.firstName
                const lastName = customer.lastName
                const company = customer.company

                if (company) {
                    return company
                } else {
                    return `${firstName} ${lastName}`
                }
            }
        },
        {
            field: 'customerGroup',
            headerName: 'Customer Group',
            width: 130,
            align: 'center',
            renderCell: (params) => {
                const groupArray = params.row.Customer
                if (groupArray.CustomerGroup) {
                    return <Chip size="small" label={groupArray.CustomerGroup.shortName}/>
                } else {
                    return null
                }
            }
        },
        {
            field: 'assemblyZipcode',
            headerName: 'Zipcode',
            type: 'number',
            width: 80,
            valueGetter: (params) => {
                const customerDeliveryAddress = params.row.customerDeliveryAddress
                return customerDeliveryAddress.zipcode
            }
        }, {
            field: 'assemblyCity',
            headerName: 'City',
            width: 200,
            valueGetter: (params) => {
                const customerDeliveryAddress = params.row.customerDeliveryAddress
                return customerDeliveryAddress.city
            }
        },
        {
            field: 'assemblyState',
            headerName: 'State',
            width: 100,
            valueGetter: (params) => {
                const customerDeliveryAddress = params.row.customerDeliveryAddress
                return customerDeliveryAddress.state
            }
        },
        {
            field: 'assemblyCountry',
            headerName: 'Country',
            width: 200,
            valueGetter: (params) => {
                const customerDeliveryAddress = params.row.customerDeliveryAddress
                return customerDeliveryAddress.country
            }
        },
        {
            field: 'size',
            headerName: 'Size',
            width: 150,
            type: 'number',
            valueGetter: (params) => {
                return 0
                /*const assemblyHead = params.row.AssemblyHeads
                if (assemblyHead.length > 1) {
                    let totalSpace = 0
                    for (const assemblyHeadKey in assemblyHead) {
                        totalSpace += assemblyHead[assemblyHeadKey].space
                    }
                    return `${totalSpace}*`
                } else {
                    return assemblyHead[0].space
                }*/
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 250,
            align: 'center',
            renderCell: (params) => <Chip size="small" label="Undefined"/>
        },
        {
            field: 'screedcheck',
            headerName: 'Screedcheck',
            width: 110,
            type: 'boolean',
            valueGetter: (params) => {
                const screedcheck = params.row.ScreedcheckHeads
                if (screedcheck) {
                    return true
                }
                return false
            }
        },
        {
            field: 'assembly',
            headerName: 'Assembly',
            width: 80,
            type: 'boolean',
            valueGetter: (params) => {
                const assembly = params.row.AssemblyHeads
                if (assembly) {
                    return true
                }
                return false
            }
        },
        {
            field: 'invoice',
            headerName: 'Invoice',
            width: 70,
            type: 'boolean',
            valueGetter: (params) => {
                const invoice = params.row.invoice_head_id
                if (invoice) {
                    return true
                }
                return false
            }
        },
        {
            field: 'completed',
            headerName: 'Completed',
            width: 85,
            type: 'boolean',
            valueGetter: (params) => {
                return false
            }
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            width: 140,
            type: 'datetime',
            valueGetter: (params) => {
                return moment(params.row.createdAt).format('LLL')
            }
        }, {
            field: 'updatedAt',
            headerName: 'Last Updated',
            width: 140,
            type: 'datetime',
            valueGetter: (params) => {
                return moment(params.row.updatedAt).format('LLL')
            }
        },
        {
            field: 'deletedAt',
            headerName: 'Deleted',
            width: 140,
            type: 'datetime',
            valueGetter: (params) => {
                const date = params.row.deletedAt
                if (date == null) {
                    return ''
                } else {
                    return moment(params.row.deletedAt).format('LLL')
                }
            }
        },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            align: 'right',
            getActions: (params) => [
                <Link to={`/project/${params.id}`}>
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
    ];


    const handleClickOpen = () => {
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
    };


    function handleFilter() {
        setDeleted(!deleted)
        readAllProjects()
    }

    return (
        <>
            <NewProjectModal close={handleClose} open={openModal}/>
            <Grid container sx={{marginTop: 5}}>
                <Grid item xs={12} spacing={2} sx={{paddingX: 3}}>
                    <Grid container>
                        <Grid item xs={10}>
                            <Typography variant="h2" component="h1" gutterBottom>Projects</Typography>
                        </Grid>
                        <Grid item xs={2} sx={{textAlign: 'right'}}>
                            <Button variant="outlined" color="success" startIcon={<Add/>} onClick={handleClickOpen}>New
                                Project</Button>
                        </Grid>
                        <Grid item xs={12} xl={12} gutterBottom>
                            <FormGroup>
                                <FormControlLabel control={<Switch
                                    checked={deleted}
                                    onChange={handleFilter}
                                    inputProps={{'aria-label': 'Show deleted'}}
                                />} label={"Show deleted"}/>
                            </FormGroup>

                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <DataGrid
                                    columnVisibilityModel={columnVisibilityModel}
                                    onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                                    componentsProps={{
                                        toolbar: {
                                            showQuickFilter: true,
                                            quickFilterProps: {debounceMs: 500},
                                        },
                                    }}
                                    components={{
                                        Toolbar: GridToolbar,
                                    }}
                                    columns={columns}
                                    rows={data}
                                    sx={{height: '80vh'}}
                                    onRowDoubleClick={(params) => navigate(`/project/${params.row.id}`)}
                                />
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>

    );
}

export default ProjectList;