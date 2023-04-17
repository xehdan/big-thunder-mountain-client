import React, {useState} from 'react';
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import moment from "moment/moment";

function AssemblyControlChecks(props) {
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        id: false,
        //deletedAt: false,
        transactionId: false
    });

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            type: 'number',
            width: 50
        },{
            field: 'transactionId',
            headerName: 'Transaction ID',
            width: 80
        },{
            field: 'task',
            headerName: 'Task',
            width: 150
        }, {
            field: 'completed',
            headerName: 'Completed',
            width: 100,
            type: 'boolean'
        }, {
            field: 'timestamp_completed',
            headerName: 'Completed',
            width: 195,
            valueGetter: params => {return moment(params.row.timestamp_completed).format('LLL')}
        }, {
            field: 'createdAt',
            headerName: 'Created',
            width: 195,
            valueGetter: params => {return moment(params.row.createdAt).format('LLL')}
        } , {
            field: 'updatedAt',
            headerName: 'Last Update',
            width: 195,
            valueGetter: params => {return moment(params.row.updatedAt).format('LLL')}
        } , {
            field: 'deletedAt',
            headerName: 'Deleted',
            width: 195,
            valueGetter: (params) => {
                if (params.row.deletedAt != null) {
                    return moment(params.row.deletedAt).format('LLL')
                } else {
                    return ''
                }
            }
        }    ]


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


AssemblyControlChecks.propTypes = {
    rows: PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired
}

export default AssemblyControlChecks;