import React, {useState} from 'react';
import {Box, Card, CardContent, Typography} from "@mui/material";
import PropTypes from "prop-types";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import moment from "moment";

function ScreedcheckDetailResults(props) {
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        id: false,
        deletedAt: false,
        transactionId: false
    });

    const ScreedcheckDetailResultsColumn = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50
        },
        {
            field: 'transactionId',
            headerName: 'Transaction ID',
            width: 200,
        },
        {
            field: 'thickness_screed',
            headerName: 'Thickness',
            type: 'number',
            width: 100,
        },
        {
            field: 'screed_type',
            headerName: 'Screed Type',
            width: 150,
        },
        {
            field: 'screed_consistency',
            headerName: 'Consistency',
            width: 130
        },
        {
            field: 'insulation_type',
            headerName: 'Insulation',
            width: 100
        },
        {
            field: 'thickness_insulation',
            headerName: 'Thickness Insulation',
            width: 150
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
                        columns={ScreedcheckDetailResultsColumn}
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

ScreedcheckDetailResults.propTypes = {
    rows: PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired
}

export default ScreedcheckDetailResults;