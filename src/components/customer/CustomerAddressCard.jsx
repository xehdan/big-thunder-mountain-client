import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardMedia, Chip, CircularProgress, Stack, Tooltip, Typography} from "@mui/material";
import PropTypes from "prop-types";
import moment from "moment/moment";
import TinyMap from "../map/TinyMap";
import {Skeleton} from "@mui/lab";
import axios from "axios";
function CustomerAddressCard(props) {
    const customerAddress = props.address
    const addressTypes = props.addressType
    const [loading, setLoading] = useState(true);
    const [loadingHQ, setLoadingHQ] = useState(true);
    const [loadingOG, setLoadingOG] = useState(true);
    const [routeHQ, setRouteHQ] = useState();
    const [routeOG, setRouteOG] = useState();

    useEffect(() => {


            function loadHQRoute() {
                const profile = "mapbox/driving";
                const coordinates = `10.020968%2C48.505725%3B${customerAddress.geocoordinates.coordinates[0]}%2C${customerAddress.geocoordinates.coordinates[1]}`;
                const distance = axios.get(`https://api.mapbox.com/directions/v5/${profile}/${coordinates}`, {
                    params: {
                        access_token: process.env.REACT_APP_MAPBOX_API_KEY
                    }
                })
                    .then((response) => {
                        if (
                            !response ||
                            !response.data ||
                            !response.data.routes ||
                            !response.data.routes.length
                        ) {
                            console.error('Invalid response:');
                            console.error(response)
                            return;
                        }
                        setRouteHQ(response.data.routes[0])
                        //console.log(`Distance from HQ to ${customerAddress.street}: `, response.data.routes)
                        setLoadingHQ(false)
                    })
            }
            function loadOGRoute() {
                const profile = "mapbox/driving";
                const coordinates = `7.9401533%2C48.4215594%3B${customerAddress.geocoordinates.coordinates[0]}%2C${customerAddress.geocoordinates.coordinates[1]}`;
                const distance = axios.get(`https://api.mapbox.com/directions/v5/${profile}/${coordinates}`, {
                    params: {
                        access_token: process.env.REACT_APP_MAPBOX_API_KEY
                    }
                })
                    .then((response) => {
                        if (
                            !response ||
                            !response.data ||
                            !response.data.routes ||
                            !response.data.routes.length
                        ) {
                            console.error('Invalid response:');
                            console.error(response)
                            return;
                        }
                        setRouteOG(response.data.routes[0])
                        //console.log(`Distance from OG to ${customerAddress.street}: `, response.data.routes)
                        setLoadingOG(false)
                    })
            }
            //setLoading2(true)


        if (props.address.geocoordinates) {
            //console.log("Hello you", props.address.geocoordinates.coordinates)
            if (props.calculateRoute) {
                loadHQRoute()
                loadOGRoute()
            }
            setLoading(false)
        }

    }, [props.address])

    return (



        <Card>
            <Stack direction="row" spacing={3}>
                { loading ?
                    <Skeleton animation="wave" variant="rectangular" width={'50%'} height={'250px'} /> :
                    <TinyMap width={'50%'} center={customerAddress} showHQ={true}/>
                }

                <CardContent>
                    <Tooltip
                        title={`Created: ${moment(customerAddress.createdAt).format('LLL')} -- Last Updated: ${moment(customerAddress.updatedAt).format('LLL')}`}>
                        <Typography sx={{fontSize: 14}} color="text.secondary"
                                    gutterBottom> {customerAddress.transactionId}</Typography>
                        </Tooltip>
                    <Typography variant="h5">
                        {addressTypes}
                    </Typography>
                    {
                        customerAddress.company ? <Typography>{customerAddress.company}</Typography> : null
                    }
                    {
                        customerAddress.firstName && customerAddress.lastName ? <Typography>{customerAddress.title} {customerAddress.firstName} {customerAddress.lastName}</Typography> : null
                    }
                    {
                        customerAddress.email ? <Typography>{customerAddress.email}</Typography> : null
                    }
                    {
                        customerAddress.phone ? <Typography>{customerAddress.phone}</Typography> : null
                    }
                    <Typography sx={{mt: 1.5}}>
                        {customerAddress.street} {customerAddress.housenumber}
                    </Typography>
                    <Typography>
                        {customerAddress.zipcode} {customerAddress.city}
                    </Typography>
                    <Typography>
                        {customerAddress.state}
                    </Typography>
                    <Typography>
                        {customerAddress.country}
                    </Typography>
                </CardContent>
                {props.calculateRoute ? <CardContent>
                    <Typography variant="h6">Distance from:</Typography>
                    { loadingHQ ? <Skeleton/> : <Typography>HQ: {(routeHQ.distance / 1000).toFixed(2)} km</Typography>}
                    { loadingHQ ? <Skeleton/> : <Typography sx={{fontSize: 14}} color="text.secondary">{moment.utc(routeHQ.duration*1000).format('HH:mm')} h via {routeHQ.legs[0].summary}</Typography>}
                    { loadingHQ ? <Skeleton/> : (routeHQ.country_crossed ? <Chip label="Includes Country Crossing" color="error" /> : null )}


                    { loadingOG ? <Skeleton sx={{ mt: 2 }}/> : <Typography sx={{ mt: 2 }}>OG: {(routeOG.distance / 1000).toFixed(2)} km</Typography>}
                    { loadingOG ? <Skeleton/> : <Typography sx={{fontSize: 14}} color="text.secondary">{moment.utc(routeOG.duration*1000).format('HH:mm')} h via {routeOG.legs[0].summary}</Typography>}
                    { loadingOG ? <Skeleton/> : (routeOG.country_crossed ? <Chip label="Includes Country Crossing" color="error" /> : null )}

                    {/*{JSON.stringify(routeHQ)}*/}
                </CardContent> : null}
            </Stack>

        </Card>
    );
}

CustomerAddressCard.propTypes = {
    address: PropTypes.object.isRequired,
    addressType: PropTypes.string.isRequired,
    calculateRoute: PropTypes.bool,
}

export default CustomerAddressCard;