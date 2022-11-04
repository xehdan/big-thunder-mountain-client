import React, {useState} from 'react';
import {
    Card,
    CardContent,
    FormControlLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from "@mui/material";

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
    // eslint-disable-next-line
    const [custType, setCustType] = useState('');



    return (
            <Grid container spacing={2} sx={{ margin: 3}}
                  component="form"
                  autoComplete="off">
                <Grid item xs={12} xl={6}>
                    <Card>
                        <CardContent>

                            <Stack>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    required
                                >
                                    <FormControlLabel value="B2C" control={<Radio />} label="B2C" />
                                    <FormControlLabel value="B2B" control={<Radio />} label="B2B" />
                                </RadioGroup>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} xl={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom>1. Personal Info</Typography>
                            <Stack spacing={2}>
                                <TextField label="Address" select>{addresses.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}</TextField>
                                <TextField variant="outlined" label="Company Name" />
                                <TextField variant="outlined" label="VAT-ID" />
                                <TextField variant="outlined" label="First Name" />
                                <TextField variant="outlined" label="Last Name" />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} xl={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom>2. Delivery</Typography>
                            <Stack spacing={2}>
                                <Grid container>
                                    <Grid item xs={12} md={9}>
                                        <TextField fullWidth variant="outlined" required label="Street"  />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth variant="outlined" required label="Housenumber"/>
                                    </Grid>
                                </Grid>
                                <TextField variant="outlined" label="Floor" />
                                <Grid container>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth variant="outlined" required label="Zipcode"  />
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <TextField fullWidth variant="outlined" required label="City"/>
                                    </Grid>
                                </Grid>
                                <TextField variant="outlined" required label="State"/>
                                <TextField variant="outlined" required label="Country"/>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} xl={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom>3. Invoice</Typography>
                            <Stack spacing={2}>
                                <Grid container>
                                    <Grid item xs={12} md={9}>
                                        <TextField fullWidth variant="outlined" required label="Street"  />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth variant="outlined" required label="Housenumber"/>
                                    </Grid>
                                </Grid>
                                <TextField variant="outlined" label="Floor" />
                                <Grid container>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth variant="outlined" required label="Zipcode"  />
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <TextField fullWidth variant="outlined" required label="City"/>
                                    </Grid>
                                </Grid>
                                <TextField variant="outlined" required label="State"/>
                                <TextField variant="outlined" required label="Country"/>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} xl={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom>4. Customer Group</Typography>
                            <Stack spacing={2}>
                                <TextField variant="outlined" required label="Customer Group"/>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} xl={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom>5. Contacts</Typography>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
    );
}

export default CreateCustomer;