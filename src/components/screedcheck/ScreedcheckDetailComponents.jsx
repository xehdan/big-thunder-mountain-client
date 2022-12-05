import React, {useState} from 'react';
import {Box, Card, CardContent, Typography} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import moment from "moment/moment";

function ScreedcheckDetailComponents(props) {
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            type: 'number',
            width: 60,
        },
        {
            field: 'transactionId',
            headerName: 'Transaction ID',
            width: 55,
        },
        {
            field: 'floor_name',
            headerName: 'Floor Level',
            width: 100,
        },
        {
            field: 'type',
            headerName: 'Componenttype',
            width: 150,

        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            type: 'number',
            width: 150,
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            width: 200,
            valueGetter: (params) => {
                return moment(params.row.createdAt).format('YYYY-MM-DD hh:ss')
            }
        },
        {
            field: 'updatedAt',
            headerName: 'Last Updated',
            width: 200,
            valueGetter: (params) => {
                return moment(params.row.updatedAt).format('YYYY-MM-DD hh:ss')
            }
        },
        {
            field: 'deletedAt',
            headerName: 'Deleted',
            width: 200,
            valueGetter: (params) => {
                if (params.row.deletedAt != null) {
                    return moment(params.row.deletedAt).format('YYYY-MM-DD hh:ss')
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
                        columns={columns}
                        rows={props.rows}
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

ScreedcheckDetailComponents.propTypes = {
    rows: PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired
}

export default ScreedcheckDetailComponents;