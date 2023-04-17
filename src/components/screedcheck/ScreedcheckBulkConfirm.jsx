import React, {useEffect, useState} from 'react';
import ScreedcheckPhoneConfirm from "./ScreedcheckPhoneConfirm";
import {Button, Card, CardContent, CardHeader, Chip, Grid, Tooltip, Typography, Skeleton} from "@mui/material";
import {DataGrid, GridActionsCellItem, GridToolbar} from "@mui/x-data-grid";
import moment from "moment/moment";
import {Link} from "react-router-dom";
import {Edit, Visibility} from "@mui/icons-material";
import http from "../../http";
import StandardMap from "../map/StandardMap";
import CustomerAddressCard from "../customer/CustomerAddressCard";

const ScreedcheckBulkConfirm = () => {

    const [screedcheck, setScreedcheck] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [selectedScreedcheck, setSelectedScreedchecks] = useState({})
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const readAllScreedchecks = async () => {
            const response = await http.get("/api/screedcheck/new?detail=true");
            setScreedcheck(response.data.screedcheckHead);
            setLoading(false)
        };
        return readAllScreedchecks
    }, [loading])

    const showDate = (params) => {
        return (
            <Tooltip title={moment(params.row.createdAt).format('lll')}>
                <Typography variant="body2">{moment(params.row.createdAt).fromNow()}</Typography>
            </Tooltip>
        )
    }

    const switchSelection = (newModel) => {
        setSelectedScreedchecks(newModel)
    }


    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50
        },
        {
            field: 'name',
            headerName: 'Name',
            valueGetter: (params) => params.row.Project.Customer.firstName ? params.row.Project.Customer.firstName + ' ' + params.row.Project.Customer.lastName : params.row.Project.Customer.company,
            width: 250
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            width: 200,
            renderCell: showDate
        },
        {
            field: 'screedcheck_date',
            headerName: 'Screedcheck Date time',
            width: 200,
            valueGetter: (params) => params.row.datetime_of_screedcheck ? moment(params.row.datetime_of_screedcheck).format('lll') : 'not set'
        },
        {
            field: 'getBackToDate',
            headerName: 'Screedcheck to Review on',
            width: 200,
            valueGetter: (params) => 'Not set'
        },
        {
            field: 'zipcode',
            headerName: 'Zipcode',
            type: 'string',
            width: 80,
            valueGetter: (params) => params.row.Project.customerDeliveryAddress.zipcode
        },
        {
            field: 'city',
            headerName: 'City',
            width: 150,
            valueGetter: (params) => params.row.Project.customerDeliveryAddress.city
        },
        {
            field: 'actions',
            type: 'actions',
            width: 100,
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
        <Grid container spacing={2} sx={{margin: 3}}>
            <Grid item xs={12}>
                <DataGrid
                    selectionModel={selectedScreedcheck}
                    onSelectionModelChange={(newModel) => switchSelection(newModel)}
                    columns={columns}
                    rows={screedcheck}
                    autoPageSize
                    pageSize={20}
                    rowsPerPageOptions={[20, 100, 500]}
                    disableMultipleSelection
                    disableDensitySelector
                    loading={loading}
                    slots={{Toolbar: GridToolbar}}
                    sx={{height: '40vh', minHeight: '400px'}}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: {debounceMs: 500},
                        }
                    }}
                />
            </Grid>
            {Array.isArray(selectedScreedcheck) && selectedScreedcheck.length ?
                <ScreedcheckInfoCard mainLoading={setLoading} id={selectedScreedcheck}/> :
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography>No Screedcheck selected</Typography>
                        </CardContent>
                    </Card>
                </Grid>

            }
        </Grid>
    );
};

const ScreedcheckInfoCard = props => {
    const {id} = props

    const [screedcheck, setScreedcheck] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const readScreedcheck = async () => {
            const response = await http.get(`/api/screedcheck/${id}?detail=true`);
            setScreedcheck(response.data.screedcheck);
            setLoading(false)
        };
        return readScreedcheck
    }, [id])

    return (
        loading === true ?
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Skeleton/>
                    </CardContent>
                </Card>
            </Grid>
            :
            <>
                <Grid item xs={5}>
                    <Card>
                        <CardHeader
                            title={screedcheck.Project.Customer.firstName ? screedcheck.Project.Customer.firstName + ' ' + screedcheck.Project.Customer.lastName : screedcheck.Project.Customer.company}
                            subheader={screedcheck.transactionId}/>
                        <CustomerAddressCard address={screedcheck.Project.customerDeliveryAddress}
                                             addressType={'Assembly Address'}/>
                        <CardContent>
                            <Typography variant="display1">Order
                                placed: {moment(screedcheck.Project.ProjectOrder.createdAt).format('lll')} via {screedcheck.Project.ProjectOrder.origin}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={7}>
                    <ScreedcheckPhoneConfirm setMainLoading={props.mainLoading} setLoading={setLoading} setScreedcheck={setScreedcheck} screedcheck={screedcheck}/>
                </Grid>

            </>
    )
}

export default ScreedcheckBulkConfirm;