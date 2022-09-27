import React, {useEffect, useState} from 'react';
import {Box} from "@mui/material";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import http from "../../http";
import {Link} from "react-router-dom";
import {Contacts, Edit, Mail, Note, Phone, Visibility} from "@mui/icons-material";

const ContactTable = (props) => {

    const [contacts, setContacts] = useState([]);
    useEffect(() => {
        const readAllCustomers = async () => {
            const response = await http.get(`/api/customer/contacts/${props.customerId}`);
            //const responseArr = Object.values(response.data.customer);
            setContacts(response.data.customerContacts);
        };
        return readAllCustomers
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
            field: 'title',
            headerName: 'Title',
            width: 100,
            valueGetter: getContactTitle
        },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
        },
        {
            field: 'email',
            headerName: 'E-Mail',
            width: 150,
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone',
            width: 150
        }, {
            field: 'actions',
            type: 'actions',
            width: 150,
            align: 'right',
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<Mail/>}
                    label="Mail"
                    onClick={() => sendMail(params.row.email)}
                />,
                <GridActionsCellItem
                    icon={<Phone/>}
                    label="Phone"
                    onClick={() => phone(params.row.phoneNumber)}
                />,
                <GridActionsCellItem
                    icon={<Note/>}
                    label="Letter"
                    onClick={() => window.alert('Wordprocessing will open here 😉')}
                />,
            ],
        },

    ];


    return (

        <DataGrid
            rows={contacts}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
        />

    )
};

export default ContactTable;