import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Container, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import CustomerCreate from "../../../components/address/CustomerCreate";
import CustomerSelect from "../../../components/customer/CustomerSelect";

Customer.propTypes = {
};

function Customer(props) {
    const [customerExists, setCustomerExists] = useState(null);

    const handleCustomer = (event, newCustomer) => {
        /*if(customerExists === "existing") {
            setNewCustomerData(null)
        }*/
        setCustomerExists(newCustomer)
    }

    return (
        <>
        <Container>
            <Typography variant="h3" component="h2">Step 1</Typography>
            <Typography variant="subtitle1" gutterBottom>Enter personal details for project. In case
                of multiple addresses enter the invoice address here. Assembly Locations follow
                later in the process </Typography>
            <Container sx={{textAlign: 'center', marginY: 5}}>
                <Typography variant="body">This is a </Typography>
                <ToggleButtonGroup exclusive value={customerExists} onChange={handleCustomer}
                                   size="small">
                    <ToggleButton value="new">New</ToggleButton>
                    <ToggleButton value="existing">Existing</ToggleButton>
                </ToggleButtonGroup>
                <Typography variant="body"> customer</Typography>
            </Container>

            {customerExists === "new" ?
                <Container maxWidth="md">
                    <CustomerCreate />
                </Container>
                : null
            }
        </Container>
    {customerExists === "existing" ?
        <CustomerSelect />
        : null
    }
        </>
    );
}

export default Customer;