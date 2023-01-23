import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    FormControl, Grid,
    InputLabel,
    MenuItem, NativeSelect, Paper,
    Select, Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import {Factory, Person2} from "@mui/icons-material";
import axios from "axios";

CustomerCreate.propTypes = {
    //newCustomerData: PropTypes.object.isRequired
};

function CustomerCreate(props) {
    const [newCustomerData, setNewCustomerData] = useState({
        title: ''
    })

    const [customerType, setCustomerType] = useState(null);
    const [mapboxResult, setMapboxResult] = useState(null);

    const handleCustomerType = (event, newCustomerType) => {
        if (customerType === "B2C") {
            setNewCustomerData(existingValues => {
                const copy = {...existingValues}
                delete copy['firstName']
                delete copy['lastName']
                return copy
            })
        } else if (customerType === "B2B") {
            setNewCustomerData(existingValues => {
                const copy = {...existingValues}
                delete copy['company']
                return copy
            })
        }
        setCustomerType(newCustomerType)
    }


    const handleChange = (e) => {
        const value = e.target.value
        let fieldName
        if (e.target.id) {
            fieldName = e.target.id
        } else if (e.target.name) {
            fieldName = e.target.name
        }
        setNewCustomerData(existingValues => ({
            ...existingValues,
            [fieldName]: value
        }))
    }


    const checkAddress = async () => {
        try {
            const {street, housenumber, zipcode, city} = newCustomerData

            const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${street}%20${housenumber}%2C%20${zipcode}%20${city}.json?limit=3&proximity=ip&types=place%2Cpostcode%2Caddress&language=de&access_token=${process.env.REACT_APP_MAPBOX_API_KEY}`);
            //console.log(response)
            setMapboxResult(response.data.features[0])
            const resp = response.data.features[0]
            let cityname

            if (resp.context.find(elem => elem.id.startsWith("locality"))) {
                cityname = resp.context.find(elem => elem.id.startsWith("place")).text + '-' + resp.context.find(elem => elem.id.startsWith("locality")).text
            } else {
                cityname = resp.context.find(elem => elem.id.startsWith("place")).text
            }

            setNewCustomerData(existingValues => ({
                ...existingValues,
                ['zipcode']: resp.context.find(elem => elem.id.startsWith("postcode")).text,
                ['state']: resp.context.find(elem => elem.id.startsWith("region")).text,
                ['country']: resp.context.find(elem => elem.id.startsWith("country")).text,
                ['city']: cityname,
                ['geocoordinates']: resp.geometry
            }))
        } catch (e) {
            console.error(e)
        }
    }


    return (
        <>
            <Grid container>
                <Grid item xs={6}>
                    <Typography variant="h4" component="h3">New Customer</Typography>
                </Grid>
                <Grid item xs={6} sx={{textAlign: 'right'}}>
                    <ToggleButtonGroup exclusive value={customerType} onChange={handleCustomerType}
                                       size="small">
                        <ToggleButton value="B2B"> <Factory/> Business</ToggleButton>
                        <ToggleButton value="B2C"> <Person2/> Consumer</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>

            </Grid>
            {customerType === "B2B" ?
                <>
                    <TextField
                        label="Company"
                        margin="dense"
                        autoFocus
                        id="company"
                        type="text"
                        fullWidth
                        variant="standard"

                        required
                        value={newCustomerData.company}
                        onChange={(e) => handleChange(e)}
                    /> </> : ''}
            {customerType === "B2C" ?
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                        <FormControl variant="standard" sx={{mt: 1, minWidth: 120}} margin="none" fullWidth>
                            <InputLabel required id="titleSelectLabel">Title</InputLabel>
                            <Select
                                labelId="titleSelectLabel"
                                id='titleSelect'
                                required
                                autoFocus
                                value={newCustomerData.title}
                                name="title"
                                onChange={(e) => handleChange(e)}
                            >
                                <MenuItem value="female">Madam</MenuItem>
                                <MenuItem value="male">Sir</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                        <TextField
                            label="First Name"
                            margin="dense"
                            id="firstName"
                            type="text"
                            fullWidth
                            required
                            value={newCustomerData.firstName}
                            onChange={(e) => handleChange(e)}
                            variant="standard"
                        />
                        </Grid>
                        <Grid item xs={5}>
                        <TextField
                            label="Last Name"
                            margin="dense"
                            id="lastName"
                            type="text"
                            fullWidth
                            required
                            value={newCustomerData.lastName}
                            onChange={(e) => handleChange(e)}
                            variant="standard"
                        />
                        </Grid>
                    </Grid>
                </> : ''}

            {customerType != null ?
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <TextField
                                label="Street"
                                margin="dense"
                                id="street"
                                type="text"
                                fullWidth
                                value={newCustomerData.street}
                                onChange={(e) => handleChange(e)}
                                variant="standard"
                                required/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                label="Housenumber"
                                margin="dense"
                                id="housenumber"
                                type="text"
                                fullWidth
                                value={newCustomerData.housenumber}
                                onChange={(e) => handleChange(e)}
                                variant="standard"
                                required
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                                label="Zipcode"
                                required
                                //InputLabelProps={{shrink: true}}
                                margin="dense"
                                id="zipcode"
                                type="text"
                                fullWidth
                                value={newCustomerData.zipcode}
                                onChange={(e) => handleChange(e)}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                label="City"
                                required
                                //InputLabelProps={{shrink: true}}
                                margin="dense"
                                id="city"
                                type="text"
                                fullWidth
                                value={newCustomerData.city}
                                onChange={(e) => handleChange(e)}
                                variant="standard"
                            />
                        </Grid>
                    </Grid>
                    <Stack direction="row" columnGap={2}>

                        <TextField
                            label="State"
                            required
                            //InputLabelProps={{shrink: true}}
                            margin="dense"
                            id="state"
                            type="text"
                            fullWidth
                            value={newCustomerData.state}
                            onChange={(e) => handleChange(e)}
                            variant="standard"
                        />
                        <TextField
                            label="Country"
                            required
                            //InputLabelProps={{shrink: true}}
                            margin="dense"
                            id="country"
                            type="text"
                            fullWidth
                            value={newCustomerData.country}
                            onChange={(e) => handleChange(e)}
                            variant="standard"
                        />
                    </Stack>

                    <TextField
                        label="Geocords"
                        required
                        //InputLabelProps={{shrink: true}}
                        margin="dense"
                        id="geocords"
                        type="text"
                        fullWidth
                        disabled
                        value={newCustomerData.geocoordinates ? `${newCustomerData.geocoordinates.coordinates[0]},${newCustomerData.geocoordinates.coordinates[1]}` : 'check first'}
                        variant="standard"
                    />

                    <Button disabled={
                        (newCustomerData.street === undefined || newCustomerData.street.length === 0) ||
                        (newCustomerData.housenumber === undefined || newCustomerData.housenumber.length === 0) ||
                        ((newCustomerData.zipcode === undefined || newCustomerData.zipcode.length === 0) &&
                            (newCustomerData.city === undefined || newCustomerData.city.length === 0))
                    } onClick={() => checkAddress()}>Check Address</Button>

                    {mapboxResult != null ? <Paper>
                        {JSON.stringify(mapboxResult)}
                    </Paper> : ''}


                </> : null}
        </>
    );
}

export default CustomerCreate;