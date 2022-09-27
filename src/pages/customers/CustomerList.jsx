import http from "../../http";
import {useEffect, useState} from "react";
import {
    DataGrid, GridActionsCellItem,
    GridToolbar
} from "@mui/x-data-grid";
import {Avatar, Chip, Button} from '@mui/material';
import {
    ConnectWithoutContact,
    Google,
    YouTube,
    Delete,
    Security,
    FileCopy,
    Mail,
    Visibility, Edit, Contacts
} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import CustAvatar from "../../components/customComp/CustAvatar";

function CustomerList() {
    let navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);



    function getCustomerType(params) {
        if (params.row.CustomerType.shortName === 'B2B') {
            return <Chip size="small" label={params.row.CustomerType.shortName} sx={{ color: 'primary.light'}}/>
        } else if(params.row.CustomerType.shortName === 'B2C') {
            return <Chip size="small" label={params.row.CustomerType.shortName} sx={{ color: 'primary.dark'}} />
        } else {
            return <Chip size="small" label={params.row.CustomerType.shortName} />
        }
    }

    function getAquisiton(params){
        let value = 'SEO/SEA'

        switch (value) {
            case "SEO/SEA":
                return <Avatar sx={{ width: 24, height: 24}}><Google sx={{ width: 15, height: 15}}/></Avatar>;
                break;
            case "Youtube":
                return <Avatar sx={{ width: 24, height: 24}}><YouTube sx={{ width: 15, height: 15}}/></Avatar>
                break;
            case "WOM":
                return <Avatar sx={{ width: 24, height: 24}}><ConnectWithoutContact sx={{ width: 15, height: 15}}/></Avatar>
                break;
            default:
                return "Unknown";
        }


    }

    function getInvoiceInfos(params) {
        let invoiceInfo = [];
        let addressArray = params.row.CustomerAddresses
        addressArray.map((item, index) => {
            if (item.typeOfAddress === 1) {
                invoiceInfo.push(`${item.zipcode} ${item.city}`)
            }
            return null
        })
        return invoiceInfo
    }

    function getAssemblyInfo(params) {
        let assemblyInfo = [];
        let addressArray = params.row.CustomerAddresses
        addressArray.map((item, index) => {
            if (item.typeOfAddress === 2) {
                assemblyInfo.push(`${item.zipcode} ${item.city}`)
            }
            return null
        })
        return assemblyInfo
    }


    function getFullName(params) {
        let name;
        if (params.row.company){
            name = params.row.company
        } else {
            name = `${params.row.lastName}, ${params.row.firstName}`
        }
        return name;
    }


    function getAvatar(params) {
        let name;
        if (params.row.company){
            name = params.row.company[0]
        } else {
            name = `${params.row.firstName[0]}${params.row.lastName[0]}`
        }
        //<Avatar sx={{ bgcolor: stringToColor(name) }}>{name}</Avatar>
        return <CustAvatar name={name}/>
    }

    function getCustomerGroup(params) {
        let groupArray = params.row
        if (groupArray.CustomerGroup){
            //console.log(groupArray.CustomerGroup.shortName)
            return <Chip size="small" label={groupArray.CustomerGroup.shortName} />
        } else {
            return null
        }
    }


    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50,
        },
        {
            field: 'avatar',
            headerName: 'Avatar',
            width: 100,
            align: 'center',
            //renderCell: getAvatar
            renderCell: (params) => <CustAvatar name={ params.row.company ? params.row.company[0] : `${params.row.firstName[0]}${params.row.lastName[0]}` } />
        },
        {
            field: 'name',
            headerName: 'Name/Company' ,
            width: 350,
            valueGetter: getFullName
        },
        {
            field: 'invoiceInfo',
            headerName: 'Invoice Params',
            width: 250,
            valueGetter: getInvoiceInfos
        },
        {
            field: 'assemblyInfo',
            headerName: 'Assembly Params',
            width: 250,
            valueGetter: getAssemblyInfo
        },
        {
            field: 'customerType',
            headerName: 'Customer Type',
            width: 150,
            align: 'center',
            renderCell: getCustomerType
        },
        {
            field: 'customerGroup',
            headerName: 'Customer Group',
            width: 150,
            align: 'center',
            renderCell: getCustomerGroup
        },
        {
            field: 'aquisition',
            headerName: 'Aquisition',
            width: 100,
            align: 'center',
            renderCell: getAquisiton
        },
        {
            field: 'actions',
            type: 'actions',
            width: 150,
            align: 'right',
            getActions: (params) => [
                <Link  to={`/customer/${params.id}`}>
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
                />,
                <GridActionsCellItem
                    icon={<Contacts />}
                    label="Contacts"
                    //onClick={duplicateUser(params.id)}
                    showInMenu
                />,
            ],
        },
        ];

    const goToCustomerPage = (params) =>
        navigate({
            pathname: `/customer/${params}`
        });

    useEffect(() => {
        const readAllCustomers = async () => {
            const response = await http.get("/api/customer?detail=true");
            //const responseArr = Object.values(response.data.customer);
            setCustomers(response.data.customer);
        };
        return readAllCustomers
    }, [])


    return (
        <div style={{ height: '80vh', width: '100%'}}>
            <DataGrid
                columns={columns}
                rows={customers}
                autoPageSize
                pageSize={20}
                rowsPerPageOptions={[20, 100, 500]}
                checkboxSelection={selectedCustomers}
                disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    }
                }}
            />
        </div>


    );
}

export default CustomerList;