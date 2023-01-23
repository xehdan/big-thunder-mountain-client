import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import {
    Autocomplete, Backdrop, Box,
    Button,
    Card, CardActions,
    CardContent,
    Checkbox,
    Chip, CircularProgress, FormControlLabel, FormGroup,
    Grid,
    Input, Skeleton, Switch, TextField,
    Tooltip,
    Typography
} from "@mui/material";
import moment from "moment/moment";
import CustomerAddressCard from "../../../components/customer/CustomerAddressCard";
import axios from "axios";
import http from "../../../http";
import {useNavigate} from "react-router-dom";

const UploadPage = props => {

    const navigate = useNavigate()
    const [file, setFile] = useState()
    const [system, setSystem] = useState([])
    const [mapLoad, setMapLoad] = useState(true)
    const [screedcheckers, setScreedcheckers] = useState([])
    const [setting, setSetting] = useState({
        notification: true,
        create_screedcheck: true,
        create_assembly: false,
        create_reminder: false,
        screedchecker: null,
        system: "swift"
    });

    const handleSettingsChange = (e) => {
        const value = e.target.checked

        let fieldName
        if (e.target.id) {
            fieldName = e.target.id
        } else if (e.target.name) {
            fieldName = e.target.name
        }
        setSetting(existingValues => ({
            ...existingValues,
            [fieldName]: value
        }))
    }

    useEffect( () => {
        const readAllScreedcheckers = async () => {
            const response = await http.get("api/employee/screedcheckers");
            setScreedcheckers(response.data.employees)
        };
        return readAllScreedcheckers
    }, [])

    function getGeocords(json) {
        // var orderAssembly = json.order_head.orderAssembly
        // var orderInvoice = json.order_head.orderInvoice

        //const search_text = "7049 Almaden Lane, Carlsbad 92009, CA, USA"
        const search_text = `${json.street} ${json.housenumber}, ${json.zipcode} ${json.city}, ${json.state}, ${json.country}`

        const coord = axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search_text}.json`, {
            params: {
                autocomplete: false,
                limit: 1,
                access_token: process.env.REACT_APP_MAPBOX_API_KEY,
                language: 'de'
            }
        })
            .then((response) => {
                if (
                    !response ||
                    !response.data ||
                    !response.data.features ||
                    !response.data.features.length
                ) {
                    console.error('Invalid response:');
                    console.error(response);
                    return;
                }
                const feature = response.data.features[0];
                console.log("Feature", feature)
                return response.data.features[0];
                //json['geometry'] = feature.geometry
            })
        const dataPromise = coord.then((response) => response)

        return dataPromise

    }


    function parseJSONFile(event) {
        var uploadedFile = event.target.files[0];

        if (uploadedFile.type !== "text/javascript" && uploadedFile.type !== "application/x-javascript") {
            alert("Wrong file type == " + uploadedFile.type);
            return false;
        }

        if (uploadedFile) {
            var readFile = new FileReader();
            readFile.onload = function (e) {
                try {
                    var contents = e.target.result;
                    var json = JSON.parse(contents);
                    getGeocords(json.order_head.orderAssembly)
                        .then(data => {

                            //const context = data.context

                            var city
                            if (data.context.filter(option => option.id.startsWith('locality')).length > 0 ) {
                                city = (data.context.filter(option => option.id.startsWith('place')))[0].text_de + '-' + (data.context.filter(option => option.id.startsWith('locality')))[0].text_de
                            } else{
                                city = (data.context.filter(option => option.id.startsWith('place')))[0].text_de
                            }



                            json.order_head.orderAssembly['geocoordinates'] = data.geometry
                            json.order_head.orderAssembly['street'] = data.text_de
                            json.order_head.orderAssembly['housenumber'] = data.address
                            json.order_head.orderAssembly['city'] = city
                            json.order_head.orderAssembly['state'] = (data.context.filter(option => option.id.startsWith('region')))[0].text_de
                            json.order_head.orderAssembly['country'] = (data.context.filter(option => option.id.startsWith('country')))[0].text_de

                        })
                        .then(() => {
                            getGeocords(json.order_head.orderInvoice)
                                .then(data => {

                                    var city
                                    if (data.context.filter(option => option.id.startsWith('locality')).length > 0) {
                                        city = (data.context.filter(option => option.id.startsWith('place')))[0].text_de + '-' + (data.context.filter(option => option.id.startsWith('locality')))[0].text_de
                                    } else{
                                        city = (data.context.filter(option => option.id.startsWith('place')))[0].text_de
                                    }

                                    json.order_head.orderInvoice['geocoordinates'] = data.geometry
                                    json.order_head.orderInvoice['street'] = data.text_de
                                    json.order_head.orderInvoice['housenumber'] = data.address
                                    json.order_head.orderInvoice['city'] = city
                                    json.order_head.orderInvoice['state'] = (data.context.filter(option => option.id.startsWith('region')))[0].text_de
                                    json.order_head.orderInvoice['country'] = (data.context.filter(option => option.id.startsWith('country')))[0].text_de
                                })
                                .then(() => {
                                    setFile(json)
                                    setMapLoad(false)
                                })
                        })
                } catch (e) {
                    console.error("Error while parsing: ", e)
                }
            };
            readFile.readAsText(uploadedFile);
        } else {
            console.log("Failed to load file");
        }
    }

    async function fireInThaHouse(e) {
        try {
            await http.post(`api/customer`, {
                firstName: file.order_head.firstName,
                lastName: file.order_head.lastName,
                customerTypeId: 1,
                CustomerAddresses: [
                    {
                        typeOfAddress: 1,
                        street: file.order_head.orderInvoice.street,
                        housenumber: file.order_head.orderInvoice.housenumber,
                        zipcode: file.order_head.orderInvoice.zipcode,
                        city: file.order_head.orderInvoice.city,
                        state: file.order_head.orderInvoice.state,
                        country: file.order_head.orderInvoice.country,
                        geocoordinates: file.order_head.orderInvoice.geocoordinates
                    }, {
                        typeOfAddress: 2,
                        street: file.order_head.orderAssembly.street,
                        housenumber: file.order_head.orderAssembly.housenumber,
                        zipcode: file.order_head.orderAssembly.zipcode,
                        city: file.order_head.orderAssembly.city,
                        state: file.order_head.orderAssembly.state,
                        country: file.order_head.orderAssembly.country,
                        geocoordinates: file.order_head.orderAssembly.geocoordinates
                    }
                ]
            })
                .then((response) => {
                    if (response.status === 200) {
                        //console.log(response.data)
                        //navigate(`/customer/${response.data.customer.id}`)
                        try {
                            http.post(`api/project`, {
                                systemId: 1,
                                projectOrderId: 1,
                                statusId: 3,
                                customerId: response.data.customer.id,
                                customerInvoiceAddressId: response.data.customer.CustomerAddresses[0].id,
                                customerDeliveryAddressId: response.data.customer.CustomerAddresses[1].id,
                                ScreedcheckHeads: [
                                    {
                                        screedchecker: "Chuck Norris"
                                    }
                                ]
                            })
                                .then((response2) => {
                                    if (response2.status === 200) {
                                        console.log(response2.data)
                                        navigate(`/project/${response2.data.project.id}`)
                                    } else {
                                        console.error(response2)
                                    }
                                })
                        } catch (e) {
                            console.log(e.message)
                            console.log(e)
                        }
                    } else {
                        console.error(response)
                        return;
                    }
                })

        } catch (e) {
            console.log(e.message)
            console.log(e)
        }
    }

    return (
            <Grid container spacing={2} sx={{margin: 3}}>
                <Grid item xs={12}>
                    <Card>
                        <CardActions>
                            <Input
                                accept="application/json"
                                //sx={{display: 'none'}}
                                id="sample-input"
                                type="file"
                                onChange={parseJSONFile}
                            />
                        </CardActions>
                    </Card>
                </Grid>
                {file ?
                    <>
                        <Grid item xs={12}>
                            <Card sx={{minHeight: '220px'}}>
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs={12} sm={4}>
                                            <Tooltip
                                                title={`Created: ${moment(file.order_head.createdAt).format('LLL')}`}>
                                                <Typography sx={{fontSize: 14}} color="text.secondary"
                                                            gutterBottom> {file.order_head.uuid}</Typography>

                                            </Tooltip>

                                            <Typography variant="h2" component="h1"
                                                        sx={{paddingY: 2}}>Project</Typography>
                                            <Typography>Status: <Chip size="small"
                                                                      label={file.order_head.status}/></Typography>
                                            {file.order_head.company ?
                                                <Typography>Company: {file.order_head.company}</Typography> : null}
                                            {file.order_head.firstName && file.order_head.lastName ?
                                                <Typography>Name: {file.order_head.title} {file.order_head.firstName} {file.order_head.lastName}</Typography> : null}
                                            <Typography>Quotation ID: {file.order_head.quotationId}</Typography>

                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormGroup>
                                                <Grid container>
                                                    <Grid item xs={6}>
                                                        <FormControlLabel control={<Checkbox
                                                            checked={file.order_head.acceptedPrepFloor}/>}
                                                                          label="Accepted Floor Prep"/>
                                                        <FormControlLabel control={<Checkbox
                                                            checked={file.order_head.acceptedPrepPlumber}/>}
                                                                          label="Accepted Plumber Prep"/>
                                                        <FormControlLabel control={<Checkbox
                                                            checked={file.order_head.acceptedPrepAssembly}/>}
                                                                          label="Accepted Assembly Prep"/>
                                                        <FormControlLabel control={<Checkbox
                                                            checked={file.order_head.acceptedTermsAndCondition}/>}
                                                                          label="Accepted Terms and Condition"/>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormControlLabel control={<Checkbox
                                                            checked={file.order_head.acceptedPrepSite}/>}
                                                                          label="Accepted Prep Site"/>
                                                        <FormControlLabel control={<Checkbox
                                                            checked={file.order_head.acceptedToBeAuthorized}/>}
                                                                          label="Accepted to be authorized"/>
                                                        <FormControlLabel control={<Checkbox
                                                            checked={file.order_head.acceptedCancellationPolicy}/>}
                                                                          label="Accepted Cancellation Policy"/>
                                                    </Grid>
                                                </Grid>
                                            </FormGroup>
                                        </Grid>
                                    </Grid>

                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} xl={6}>
                            {mapLoad ? <Card><Skeleton variant="rectangular" height={300}/></Card> :
                                <CustomerAddressCard address={file.order_head.orderAssembly}
                                                     addressType={"Delivery Address"} calculateRoute/>}
                        </Grid>
                        <Grid item xs={12} xl={6}>
                            {mapLoad ? <Card><Skeleton variant="rectangular" height={300}/></Card> :
                                <CustomerAddressCard address={file.order_head.orderInvoice}
                                                     addressType={"Invoice Address"} calculateRoute/>}
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography component="h2" variant="h3">Notes:</Typography>
                                    <Typography
                                        variant="body">{file.order_head.notice ? file.order_head.notice : 'No notes were transmitted'}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sx={{mt: 3}}>
                            <Card>
                                <CardContent>
                                    <FormGroup>
                                        <FormControlLabel control={<Switch
                                            defaultChecked
                                            checked={setting.notification}
                                            name="notification"
                                            onChange={handleSettingsChange}
                                        />} label="Send Customer confirmation for project creation"/>
                                        <FormControlLabel control={<Switch
                                            defaultChecked
                                            checked={setting.create_screedcheck}
                                            name="create_screedcheck"
                                            onChange={handleSettingsChange}
                                        />} label="Create default Screedcheck"/>
                                        {setting.create_screedcheck ?
                                            <Autocomplete
                                                value={setting.screedchecker}
                                                disablePortal
                                                getOptionLabel={(option) => (option.firstName?option.firstName:'')}
                                                isOptionEqualToValue={(option, value) => option.id === value}
                                                renderOption={(props, option) => (
                                                    <Box component="li" sx={{ mr: 2, flexShrink: 0}} {...props} key={option.id}>
                                                        {option.id + ' ' + option.firstName + ' ' + option.lastName}
                                                    </Box>
                                                )}
                                                onChange={(e, newValue) => {
                                                        setSetting(existingValues => ({
                                                            ...existingValues,
                                                            ['screedchecker']: newValue.id
                                                        }))
                                                    }
                                                }
                                                options={screedcheckers}
                                                sx={{ width: 300 }}
                                                renderInput={(params) =>
                                                    <TextField
                                                        {...params}
                                                        label="Screedchecker"
                                                    />
                                            }
                                            />
                                             : null }
                                        <FormControlLabel control={<Switch
                                            checked={setting.create_assembly}
                                            name="create_assembly"
                                            onChange={handleSettingsChange}
                                        />} label="Create Assembly"/>
                                        <FormControlLabel control={<Switch
                                            checked={setting.create_reminder}
                                            name="create_reminder"
                                            onChange={handleSettingsChange}
                                        />} label="Set reminder in 2 Weeks"/>

                                        { /* <Autocomplete
                                            value={setting.system}
                                            isOptionEqualToValue={(option, value) => option.system_name === value}
                                            onChange={(e, newValue) => {
                                                setSetting(existingValues => ({
                                                    ...existingValues,
                                                    ['system']: newValue.system_name
                                                }))
                                            }}
                                            id="system"
                                            sx={{width: '100%'}}
                                            options={system}
                                            autoHighlight
                                            //getOptionLabel={(option) => option.system_name}
                                            renderOption={(props, option) => (
                                                <Box component="li"
                                                     sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
                                                    <img
                                                        loading="lazy"
                                                        width="40"
                                                        src={`http://localhost:3000/${option.logo_path}`}
                                                        //srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                        alt={option.system_name}
                                                    />
                                                    {option.system_name}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="standard"
                                                    label="Choose a System"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                                    }}
                                                />
                                            )}
                                        />*/}
                                    </FormGroup>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sx={{mt: 3}}>
                            <Card>
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            Please check all data and adapt to your needs.
                                        </Grid>
                                        <Grid item xs={6} sx={{textAlign: 'right'}}>
                                            <Button onClick={() => fireInThaHouse()} color="success"
                                                    variant="contained">Fire in tha house</Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </> : null}
            </Grid>
    );
};

UploadPage.propTypes = {};

export default UploadPage;