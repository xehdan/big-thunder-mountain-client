import React from 'react';
import PropTypes from 'prop-types';
import {DataGrid, GridActionsCellItem, GridToolbar} from "@mui/x-data-grid";
import moment from "moment/moment";
import {Link} from "react-router-dom";
import {Edit, Visibility} from "@mui/icons-material";
import {Avatar, AvatarGroup, Tooltip, Typography} from "@mui/material";

AssemblyTable.propTypes = {
    assemblies: PropTypes.array.isRequired,
    height: PropTypes.number,
    dense: PropTypes.bool
};

function AssemblyTable(props) {

    function getCustomerName(params) {
        const project = params.row.Project
        const customer = project.Customer
        if (customer.company) {
            return customer.company
        }
        return `${customer.firstName} ${customer.lastName}`
    }

    function getLocation(params) {
        const project = params.row.Project
        const deliveryAddress = project.customerDeliveryAddress
        return `${deliveryAddress.zipcode} ${deliveryAddress.city}`
    }

    function renderEmployeeAvatar(params) {
        const employees = params.row.Employees
        if (employees.length > 1) {
            return (
                <AvatarGroup max={4}>
                    {employees.map((element, index) => (
                        <Tooltip title={element.firstName + ' ' + element.lastName}>
                            <Avatar key={index} alt={element.firstName + ' ' + element.lastName} sx={{width: 24, height: 24, fontSize: '0.8rem'}}>{element.firstName.substring(0,1)}{element.lastName.substring(0,1)}</Avatar>
                        </Tooltip>
                    ))}
                </AvatarGroup>
            )
        } else {
            return <Typography variant="caption">not assigned</Typography>

        }
    }

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50,
        },
        {
            field: 'assembly_date',
            headerName: 'Assembly Date',
            width: 200,
            valueGetter: params => {
                return moment(params.row.assembly_date).format('LL')
            }
        },
        {
            field: 'estimated_duration',
            headerName: 'Est. Duration',
            width: 100,
            valueGetter: params => {
                if (params.row.estimated_duration > 1) {
                    return `${params.row.estimated_duration} Days`
                } else {
                    return `${params.row.estimated_duration} Day`
                }
            }
        },
        {
            field: 'space',
            headerName: 'Space',
            width: 100,
        },
        {
            field: 'assignedMechanics',
            headerName: 'Mechanics',
            width: 100,
            renderCell: renderEmployeeAvatar
        },
        {
            field: 'projectId',
            headerName: 'Project',
            width: 100
        },
        {
            field: 'completed',
            headerName: 'Status',
            width: 100,
            type: 'boolean'
        },
        {
            field: 'customer.name',
            headerName: 'Customer Name',
            width: 250,
            valueGetter: getCustomerName
        },
        {
            field: 'deliveryLocation',
            headerName: 'Location',
            width: 250,
            valueGetter: getLocation
        }, {
            field: 'actions',
            type: 'actions',
            width: 150,
            align: 'right',
            getActions: (params) => [
                <Link to={`/assembly/${params.id}`}>
                    <GridActionsCellItem
                        icon={<Visibility/>}
                        label="View"
                        //onClick={goToCustomerPage(params.id)}
                    /></Link>,
                <GridActionsCellItem
                    icon={<Edit/>}
                    label="Edit"
                    //onClick={toggleAdmin(params.id)}
                    showInMenu
                />
            ],
        },
    ]

    return (
        <DataGrid
            columns={columns}
            rows={props.assemblies}
            loading={props.loading ? props.loading : false}
            density={props.dense ? 'compact' : 'standard'}
            autoPageSize
            pageSize={20}
            rowsPerPageOptions={[20, 100, 500]}
            /*checkboxSelection={selectedAssemblies}*/
            disableDensitySelector
            slots={{Toolbar: GridToolbar}}
            sx={{height: props.height ? props.height : '80vh'}}
            slotProps={{
                toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: {debounceMs: 500},
                }
            }}
        />

    );
}

export default AssemblyTable;