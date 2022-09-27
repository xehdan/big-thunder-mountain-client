import React, {useEffect, useState} from 'react';
import {Box} from "@mui/material";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import http from "../../http";
import {Link} from "react-router-dom";
import {Contacts, Edit, Mail, Note, Phone, Visibility} from "@mui/icons-material";

const AddressTable = (props) => {

    const [addresses, setAddresses] = useState([]);
    useEffect(() => {
        const readAllAddresses = async () => {
            const response = await http.get(`/api/customer/address/${props.customerId}`);
            //const responseArr = Object.values(response.data.customer);
            setAddresses(response.data.customerAddresses);
        };
        return readAllAddresses
    }, [])


    function getContactTitle(params) {
        if (params.row.ContactTitle.gender === "male") {
            return "Mr."
        } else if (params.row.ContactTitle.gender === "female") {
            return "Mrs."
        } else {
            return "--"
        }
    }

    function sendMail(email) {
        window.location.href = `mailto:${email}`;
    }

    function phone(phoneNumber) {
        window.location.href = `tel:${phoneNumber}`
        //window.location.href = 'phon'
    }

    const columns = [
        {
            field: 'typeOfAddress',
            headerName: 'Type of Address',
            width: 100,
        },
        {
            field: 'street',
            headerName: 'Street',
            width: 150,
        },
        {
            field: 'housenumber',
            headerName: 'HouseNumber',
            width: 150,
        },
        {
            field: 'floor',
            headerName: 'Floor',
            width: 150,
        },
        {
            field: 'zipcode',
            headerName: 'Zipcode',
            width: 150
        },
        {
            field: 'city',
            headerName: 'City',
            width: 150
        },
        {
            field: 'state',
            headerName: 'State',
            width: 150
        },
        {
            field: 'country',
            headerName: 'Country',
            width: 150
        },

    ];


    return (

        <DataGrid
            rows={addresses}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
        />

    )
};

export default AddressTable;