import React, {useEffect, useState} from 'react';
import {Box, Rating} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
//import hotels from './dummyData.json'
import http from "../../../http";

function HotelList(props) {
    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            width: 250,
        },
        {
            field: 'street',
            headerName: 'Street',
            width: 150
        },
        {
            field: 'zipcode',
            headerName: 'Zipcode',
            width: 80,
        },
        {
            field: 'city',
            headerName: 'City',
            width: 150,
        },
        {
            field: 'phone',
            headerName: 'Phone',
            width: 150,
        },
        {
            field: 'mail',
            headerName: 'Mail',
            width: 200,
        },
        {
            field: 'website',
            headerName: 'Website',
            width: 300,
        },
        {
            field: 'price',
            headerName: 'latest Price',
            type: 'number',
            width: 110,
        },
        {
            field: 'payment',
            headerName: 'Payment Option',
            width: 200,
        },
        {
            field: 'rating',
            headerName: 'Rating',
            width: 150,
            renderCell: (params) => <Rating value={params.row.rating} max={5} readOnly/>
        },
    ]

    const [hotels, setHotels] = useState([])

    useEffect(() => {
        const readAllHotels = async () => {
            const response = await http.get("api/hotel");
            setHotels(response.data.hotel);
        };
        return readAllHotels
    })

    //const rows = hotels;

    return (
        <Box sx={{ height: '50vh', width: '100%' }}>
            <DataGrid
                rows={hotels}
                columns={columns}
                pageSize={20}
                rowsPerPageOptions={[10, 20, 30]}
                density={'compact'}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
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