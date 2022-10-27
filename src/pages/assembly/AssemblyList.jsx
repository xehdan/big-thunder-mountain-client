import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {DataGrid, GridActionsCellItem, GridToolbar} from "@mui/x-data-grid";
import http from "../../http";
import {Contacts, Edit, Visibility} from "@mui/icons-material";

function AssemblyList() {
    let navigate = useNavigate();
    const [assemblies, setAssemblies] = useState([]);
    const [selectedAssemblies, setSelectedAssemblies] = useState([]);

    useEffect(() => {
        const readAllAssemblies = async () => {
            const response = await http.get("api/assembly/withProjectCustomer");
            setAssemblies(response.data.assemblyHead);
        };
        return readAllAssemblies
    }, [])

    function getCustomerName(params) {
        const project = params.row.Project
        const customer = project.Customer
        if(customer.company) {
            return customer.company
        } else {
            return `${customer.firstName} ${customer.lastName}`
        }
    }

    function getLocation(params) {
        const project = params.row.Project
        const deliveryAddress = project.customerDeliveryAddress
        return `${deliveryAddress.zipcode} ${deliveryAddress.city}`
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
        },
        {
            field: 'estimated_duration',
            headerName: 'Est. Duration',
            width: 100
        },
        {
            field: 'space',
            headerName: 'Space',
            width: 100,
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
        <div style={{ height: '80vh', width: '100%'}}>
            <DataGrid
                columns={columns}
                rows={assemblies}
                autoPageSize
                pageSize={20}
                rowsPerPageOptions={[20, 100, 500]}
                checkboxSelection={selectedAssemblies}
                disableDensitySelector
                slots={{ Toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    }
                }}
                />
        </div>
    );
};

export default AssemblyList;