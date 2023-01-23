import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardContent,
    Container,
    Grid, Button,
    Stack,
    TextField,
    Typography, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import {EuroSymbol, Plumbing} from "@mui/icons-material";
import {DataGrid} from "@mui/x-data-grid";
import AddressSelect from "../../../components/address/AddressSelect";

const Addresses = props => {
    const [assemblyAddress, setAssemblyAddress] = useState(null);
    const [invoiceAddress, setInvoiceAddress] = useState(null);
    const [addresstype, setAddressType] = useState("new");
    const [addressData, setAddressData] = useState({});
    const [selectedAddress, setSelectedAddress] = useState([])

    const handleAddressType = (e) => {
        setAddressType(e.target.value)
    }

    const handleAddressChange = (e) => {
        const value = e.target.value
        let fieldName
        if (e.target.id) {
            fieldName = e.target.id
        } else if (e.target.name) {
            fieldName = e.target.name
        }
        setAddressData(existingValues => ({
            ...existingValues,
            [fieldName]: value
        }))
    }

    const changeInvoiceAddress = () => {
      setInvoiceAddress(addressData)
    }

    const changeAssemblyAddress = () => {
        setAssemblyAddress(addressData)
    }

    return (
        <Container>
            <Typography variant="h3" component="h2">Step 2</Typography>
            <Typography variant="subtitle1" gutterBottom>Each project requires assembly and invoice location. You can
                select out of exisiting records or add new ones.</Typography>
            <>
                <Grid container spacing={2}>
                    <Grid item xs={5}>

                        <Grid container columnSpacing={2}>
                            <Grid item xs={12}>
                                <ToggleButtonGroup value={addresstype} onChange={handleAddressType}>
                                    <ToggleButton value="new">New</ToggleButton>
                                    <ToggleButton value="existing">Existing</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            {addresstype === "new" ? <>
                                <Grid item xs={10}>
                                    <TextField
                                        label="Street"
                                        margin="dense"
                                        id="street"
                                        type="text"
                                        fullWidth
                                        value={addressData.street}
                                        onChange={(e) => handleAddressChange(e)}
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
                                        value={addressData.housenumber}
                                        onChange={(e) => handleAddressChange(e)}
                                        variant="standard"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        label="Zipcode"
                                        required
                                        //InputLabelProps={{shrink: true}}
                                        margin="dense"
                                        id="zipcode"
                                        type="text"
                                        fullWidth
                                        value={addressData.zipcode}
                                        onChange={(e) => handleAddressChange(e)}
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
                                        value={addressData.city}
                                        onChange={(e) => handleAddressChange(e)}
                                        variant="standard"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="State"
                                        required
                                        //InputLabelProps={{shrink: true}}
                                        margin="dense"
                                        id="state"
                                        type="text"
                                        fullWidth
                                        value={addressData.state}
                                        onChange={(e) => handleAddressChange(e)}
                                        variant="standard"
                                    />
                                </Grid>
                                <Grid item xs={6}>

                                    <TextField
                                        label="Country"
                                        required
                                        //InputLabelProps={{shrink: true}}
                                        margin="dense"
                                        id="country"
                                        type="text"
                                        fullWidth
                                        value={addressData.country}
                                        onChange={(e) => handleAddressChange(e)}
                                        variant="standard"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Geocords"
                                        required
                                        //InputLabelProps={{shrink: true}}
                                        margin="dense"
                                        id="geocords"
                                        type="text"
                                        fullWidth
                                        disabled
                                        //value={newCustomerData.geocoordinates ? `${newCustomerData.geocoordinates.coordinates[0]},${newCustomerData.geocoordinates.coordinates[1]}` : 'check first'}
                                        variant="standard"
                                    />

                                </Grid>
                            </> : null }
                            {addresstype === "existing" ?
                            <Grid item xs={12}>
                                <AddressSelect selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} customerId={3}/>
                            </Grid> : null
                            }


                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <Stack direction="column" spacing={2}>
                            <Button disabled={selectedAddress === []} variant="outlined" startIcon={<EuroSymbol/>} onClick={changeInvoiceAddress}>Invoice</Button>
                            <Button disabled variant="outlined" startIcon={<Plumbing/>} onClick={changeAssemblyAddress}>Assembly</Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={5}>
                        <Card sx={{mb: 1}}>
                            <CardContent>
                                {assemblyAddress === null ?
                                    <Typography><em>No assembly address set</em></Typography> : <>
                                        <Typography variant="h5">Assembly Address</Typography>
                                        <Typography>{assemblyAddress.street} {assemblyAddress.housenumber}</Typography>
                                        <Typography>{assemblyAddress.zipcode} {assemblyAddress.city}</Typography>
                                        <Typography>{assemblyAddress.state} {assemblyAddress.country}</Typography>
                                    </>
                                }
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                {invoiceAddress === null ?
                                    <Typography><em>No invoice address set</em></Typography> : <>
                                        <Typography variant="h5">Invoice Address</Typography>
                                        <Typography>{invoiceAddress.street} {invoiceAddress.housenumber}</Typography>
                                        <Typography>{invoiceAddress.zipcode} {invoiceAddress.city}</Typography>
                                        <Typography>{invoiceAddress.state} {invoiceAddress.country}</Typography>
                                    </>
                                }
                            </CardContent>
                        </Card>
                        {JSON.stringify(selectedAddress)}
                    </Grid>
                </Grid>
            </>
        </Container>
    );
};

Addresses.propTypes = {};

export default Addresses;