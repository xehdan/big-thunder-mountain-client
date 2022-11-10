import React from 'react';
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {Link} from "react-router-dom";
import {Edit, Visibility} from "@mui/icons-material";

function ComplaintTable(props) {

    const {complaints} = props

    const columns = [
        {
            field: 'transactionId',
            headerName: 'Transaction ID',
            width: 200
        },
        {
            field: 'status',
            headerName: 'status',
            width: 100
        },
        {
            field: 'completed',
            headerName: 'completed',
            width: 100,
            type: 'boolean'
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            width: 200
        },
        {
            field: 'updatedAt',
            headerName: 'Updated',
            width: 200
        },
        {
            field: 'actions',
            type: 'actions',
            width: 150,
            align: 'right',
            getActions: (params) => [
                <Link  to={`/complaint/${params.id}`}>
                    <GridActionsCellItem
                        icon={<Visibility />}
                        label="View"
                        //onClick={goToCustomerPage(params.id)}
                    /></Link>,
                <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    //onClick={toggleAdmin(params.id)}
                    showInMenu
                />
            ],
        },
    ]

    return (
        <DataGrid
            rows={complaints}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            sx={{ width: '89vw', height: '80vh'}}
        />
    );
}

export default ComplaintTable;