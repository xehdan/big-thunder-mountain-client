import React from 'react';
import {Box, FormControlLabel, MenuItem, Radio, RadioGroup, TextField} from "@mui/material";

function CreateCustomer(props) {
    const addresses = [
        {
            value: 'Sir',
            label: 'Sir'
        },
        {
            value: 'Madam',
            label: 'Madam'
        }
    ]


    return (
        <div>
            <h1>Create Customer</h1>
            <Box
                component="form"
                autocomplete="off"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                >
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel value="B2C" control={<Radio />} label="B2C" />
                    <FormControlLabel value="B2B" control={<Radio />} label="B2B" />
                </RadioGroup>
                <TextField label="Company Name" variant="standard"/>
                <TextField label="First Name" variant="standard"/>
                <TextField label="Last Name" variant="standard"/>
                <TextField label="Address" select value={addresses}>{addresses.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}</TextField>
            </Box>
        </div>
    );
}

export default CreateCustomer;