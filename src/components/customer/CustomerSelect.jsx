import React, {useEffect, useState} from 'react';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbar,
    GridToolbarContainer, GridToolbarFilterButton,
    GridToolbarQuickFilter
} from "@mui/x-data-grid";
import {Chip, Grid, LinearProgress} from "@mui/material";
import CustAvatar from "../customComp/CustAvatar";
import http from "../../http";

const CustomerSelect = () => {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect( () => {
        const readAllCustomers = async () => {
            const response = await http.get("api/customer?detail=true");
            setCustomers(response.data.customer)
            setLoading(false)
        };
        return readAllCustomers
    }, [])

    function getInvoiceInfos(params) {
        let invoiceInfo = [];
        let addressArray = params.row.CustomerAddresses
        addressArray.map((item, index) => {
            if (item.typeOfAddress === 1) {
                invoiceInfo.push(`${item.zipcode} ${item.city}`)
            }
            return null
        })
        return invoiceInfo
    }

    function getAssemblyInfo(params) {
        let assemblyInfo = [];
        let addressArray = params.row.CustomerAddresses
        addressArray.map((item, index) => {
            if (item.typeOfAddress === 2) {
                assemblyInfo.push(`${item.zipcode} ${item.city}`)
            }
            return null
        })
        return assemblyInfo
    }

    function getCustomerGroup(params) {
        let groupArray = params.row
        if (groupArray.CustomerGroup){
            //console.log(groupArray.CustomerGroup.shortName)
            return <Chip size="small" label={groupArray.CustomerGroup.shortName} />
        } else {
            return null
        }
    }


    function getFullName(params) {
        let name;
        if (params.row.company) {
            name = params.row.company
        } else {
            name = `${params.row.lastName}, ${params.row.firstName}`
        }
        return name;
    }

    function getCustomerType(params) {
        if (params.row.CustomerType.shortName === 'B2B') {
            return <Chip size="small" label={params.row.CustomerType.shortName} sx={{ color: 'primary.light'}}/>
        } else if(params.row.CustomerType.shortName === 'B2C') {
            return <Chip size="small" label={params.row.CustomerType.shortName} sx={{ color: 'primary.dark'}} />
        } else {
            return <Chip size="small" label={params.row.CustomerType.shortName} />
        }
    }

        const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50,
        },
        {
            field: 'name',
            headerName: 'Name/Company' ,
            width: 350,
            valueGetter: getFullName
        },
        {
            field: 'invoiceInfo',
            headerName: 'Invoice Params',
            width: 250,
            valueGetter: getInvoiceInfos
        },
        {
            field: 'assemblyInfo',
            headerName: 'Assembly Params',
            width: 250,
            valueGetter: getAssemblyInfo
        },
        {
            field: 'customerType',
            headerName: 'Customer Type',
            width: 150,
            align: 'center',
            renderCell: getCustomerType
        },
        {
            field: 'customerGroup',
            headerName: 'Customer Group',
            width: 150,
            align: 'center',
            renderCell: getCustomerGroup
        }
    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Grid container>
                    <Grid item xs={6}>
                        <GridToolbarFilterButton/>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right'}}>
                        <GridToolbarQuickFilter sx={{ textAlign: 'right'}}/>
                    </Grid>
                </Grid>

            </GridToolbarContainer>
        );
    }


    return (
        <DataGrid
            density="compact"
            rows={customers}
            columns={columns}
            autoPageSize
            pageSize={20}
            rowsPerPageOptions={[20, 100, 500]}
            disableDensitySelector
            components={{ LoadingOverlay: LinearProgress, Toolbar: CustomToolbar }}
            sx={{ height: '50vh'}}
            componentsProps={{
                toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },

                }
            }}
            loading={loading}

        />

    );
};

export default CustomerSelect;