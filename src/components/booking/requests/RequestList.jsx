import React from 'react';
import {Box} from "@mui/material";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {MapRounded} from "@mui/icons-material";
import moment from "moment";

function RequestList(props) {


    const columns = [
        {field: 'id', headerName: 'ID', width: 90, hide: true},
        {
            field: 'arrivalDate',
            headerName: 'Arrival Date',
            type: 'date',
            width: 110,
            valueGetter: params => {
                return new Date(params.row.arrivalDate)
            }
        },
        {
            field: 'departureDate',
            headerName: 'Departure Date',
            type: 'date',
            width: 110,
            valueGetter: params => {
                return moment(params.row.arrivalDate).add(params.row.nightsToStay, 'd').format('LLL')
            }
        },
        {
            field: 'nightsToStay',
            headerName: 'Nights to stay',
            type: 'number',
            width: 110,
        },
        {
            field: 'calendarWeek',
            headerName: 'Calendar Week',
            type: 'number',
            width: 110,
            valueGetter: params => {
                return moment(params.row.arrivalDate).isoWeek()
            }
        },
        {
            field: 'guests',
            headerName: 'Guests',
            type: 'number',
            width: 70,
            valueGetter: params => {
                return params.row.guests.length
            }
        },
        {
            field: 'site',
            headerName: 'Site',
            width: 200,
            valueGetter: params => {
                return `${params.row.zipcodeSite} ${params.row.citySite}`
            }
        },
        {
            field: 'coordinates',
            headerName: 'Coordinates',
            hide: true,
            width: 200,
            valueGetter: params => { return `${JSON.stringify(params.row.geocoordinates.coordinates) }` }

        },
        {
            field: 'actions',
            type: 'actions',
            width: 50,
            align: 'right',
            getActions: (params) => [
                <GridActionsCellItem
                    onClick={() => {
                        window.open(`https://www.google.com/maps/search/Hotels/@${params.row.geocoordinates.coordinates[1]},${params.row.geocoordinates.coordinates[0]},13z`, '_blank').focus()
                    }}
                    icon={<MapRounded/>}
                    label="Google Maps"
                />
            ],
        },
    ]

    const rows = props.requests

    function handleRowClick(params) {
        //console.log("Click", params.row.geocoordinates.coordinates)
        //props.setNewMapCenter(params.row.geocoordinates.coordinates)
        props.clickHandler(params.row.geocoordinates.coordinates)
    }

    return (
        <Box sx={{height: 400, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                experimentalFeatures={{newEditingApi: true}}
                onRowClick={handleRowClick}
            />
        </Box>
    );
}

export default RequestList;