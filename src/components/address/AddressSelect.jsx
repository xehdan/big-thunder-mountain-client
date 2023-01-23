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
import PropTypes from "prop-types";

const AddressSelect = (props) => {
    const [loading, setLoading] = useState(true)
    const [addresses, setAddresses] = useState([])

    useEffect(() => {
        const readAllAddresses = async () => {
            const response = await http.get(`api/customer/address/${props.customerId}`);
            setAddresses(response.data.customerAddresses)
            setLoading(false)
        };
        return readAllAddresses
    }, [])


    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50,
        },
        {
            field: 'street',
            headerName: 'Street',
            width: 150,
        },
        {
            field: 'housenumber',
            headerName: 'No',
            width: 20
        },
        {
            field: 'zipcode',
            headerName: 'Zip',
            width: 80,
        },
        {
            field: 'city',
            headerName: 'city',
            width: 150,
        },
        {
            field: 'state',
            headerName: 'State',
            width: 150,
        },
        {
            field: 'country',
            headerName: 'Country',
            width: 150,
        },
    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Grid container>
                    <Grid item xs={6}>
                        <GridToolbarFilterButton/>
                    </Grid>
                    <Grid item xs={6} sx={{textAlign: 'right'}}>
                        <GridToolbarQuickFilter sx={{textAlign: 'right'}}/>
                    </Grid>
                </Grid>

            </GridToolbarContainer>
        );
    }


    return (
        <>
            <DataGrid
                density="compact"
                disableMultipleSelection
                onSelectionModelChange={(newSelectionModel) => {
                    props.setSelectedAddress(newSelectionModel)
                }
                }
                selectionModel={props.selectedAddress}
                rows={addresses}
                columns={columns}
                autoPageSize
                pageSize={20}
                rowsPerPageOptions={[20, 100, 500]}
                disableDensitySelector
                components={{LoadingOverlay: LinearProgress, Toolbar: CustomToolbar}}
                sx={{height: '50vh'}}
                componentsProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: {debounceMs: 500},

                    }
                }}
                loading={loading}
            />
        </>
    );
};

AddressSelect.propTypes = {
    customerId: PropTypes.number.isRequired,
    selectedAddress: PropTypes.object.isRequired,
    setSelectedAddress: PropTypes.func.isRequired
}

export default AddressSelect;