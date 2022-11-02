import React from 'react';
import {Box, Chip, Rating} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {CreditCard, Payments} from "@mui/icons-material";

function HotelList(props) {

    const hotels = props.hotels

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50,
            hide: true
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 250,
        },
        {
            field: 'street',
            headerName: 'Street',
            width: 150,
            valueGetter: (params) => { return `${params.row.HotelAddresses[0].street} ${params.row.HotelAddresses[0].housenumber}`}
        },
        {
            field: 'zipcode',
            headerName: 'Zipcode',
            width: 80,
            valueGetter: (params) => { return `${params.row.HotelAddresses[0].zipcode}` }
        },
        {
            field: 'city',
            headerName: 'City',
            width: 150,
            valueGetter: (params) => { return `${params.row.HotelAddresses[0].city}, ${params.row.HotelAddresses[0].state}` }
        },
        {
            field: 'phone_number',
            headerName: 'Phone',
            width: 150,
        },
        {
            field: 'email',
            headerName: 'Mail',
            width: 200,
        },
        {
            field: 'website',
            headerName: 'Website',
            width: 300,
        },
        {
            field: 'has_parksport',
            headerName: 'Parkspot',
            type: 'boolean',
            width: 100,
        },
        {
            field: 'payment',
            headerName: 'Payment Option',
            width: 200,
            renderCell: renderPaymentOptions
        },
        {
            field: 'rating',
            headerName: 'Rating',
            width: 150,
            renderCell: (params) => <Rating value={params.row.rating} max={5} readOnly/>
        },
        {
            field: 'geocoordinates',
            hide: true,
            headerName: 'Position',
            valueGetter: (params) => { return `${JSON.stringify(params.row.HotelAddresses[0].geocoordinates.coordinates)}` },
            width: 200
        }
    ]


    function renderPaymentOptions(params) {
        const options = params.row.PaymentOptions
        const chips = []
        for (let optionsKey in options) {
            if (options[optionsKey].is_digital) {
                chips.push(<Chip key={optionsKey} label={options[optionsKey].codename} sx={{ marginRight: 1}} title={options[optionsKey].type} size="small" icon={<CreditCard/>}/>)
            } else {
                chips.push(<Chip key={optionsKey} label={options[optionsKey].codename} sx={{ marginRight: 1}} size="small" icon={<Payments/>}/>)
            }
        }
        return chips
    }
    //const rows = hotels;


    function handleRowClick(params) {
        props.clickHandler(params.row.HotelAddresses[0].geocoordinates.coordinates)
    }

    return (
        <Box sx={{ height: '50vh', width: '100%' }}>
            <DataGrid
                getRowId={(row) => row.id}
                rows={hotels}
                columns={columns}
                pageSize={20}
                rowsPerPageOptions={[10, 20, 30]}
                density={'compact'}
                slot={{ Toolbar: GridToolbar }}
                onRowClick={handleRowClick}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    }
                }}
            />
        </Box>
    );
}

export default HotelList;