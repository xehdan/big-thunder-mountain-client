import React, {useState} from 'react';
import moment from "moment";
import {Box, Card, CardContent, Typography} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import PropTypes from "prop-types";

function ScreedcheckDetailRooms(props) {
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        deletedAt: false
    });

    const ScreedcheckDetailRoomsColumn = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50,
        },
        {
            field: 'space',
            headerName: 'Space',
            type: 'number',
            width: 100,
        },
        {
            field: 'room_description',
            headerName: 'Room Description',
            width: 200,
        },
        {
            field: 'floor_level',
            headerName: 'Floor Level',
            width: 100,
        },
        {
            field: 'floor_cover',
            headerName: 'Floor Cover',
            width: 150,

        },
        {
            field: 'additional_circuit_needed',
            headerName: 'Additional Circuits',
            type: 'number',
            width: 150,
        },
        {
            field: 'number_of_circuits',
            headerName: 'Total amount of circuits',
            type: 'number',
            width: 200,
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            width: 200,
            valueGetter: (params) => {
                return moment(params.row.createdAt).format('LLL')
            }
        },
        {
            field: 'updatedAt',
            headerName: 'Last Updated',
            width: 200,
            valueGetter: (params) => {
                return moment(params.row.updatedAt).format('LLL')
            }
        },
        {
            field: 'deletedAt',
            headerName: 'Deleted',
            width: 200,
            valueGetter: (params) => {
                if (params.row.deletedAt != null) {
                    return moment(params.row.deletedAt).format('LLL')
                } else {
                    return ''
                }
            }
        }
    ]

    return (
                    <DataGrid
                        sx={{height: 300, width: '100%'}}
                        density="compact"
                        rows={props.rows}
                        columns={ScreedcheckDetailRoomsColumn}
                        pageSize={props.pageSize}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
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
                    />
    );
}

ScreedcheckDetailRooms.propTypes = {
    rows: PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default ScreedcheckDetailRooms;