import React, {useEffect, useState} from 'react';
import {Card, CardMedia, CircularProgress, Grid, Typography, Button} from "@mui/material";
import HotelList from "../../components/booking/hotel/HotelList";
import RequestList from "../../components/booking/requests/RequestList";
import StandardMap from "../../components/map/StandardMap";
import http from "../../http";

import stayRequests from '../../components/booking/requests/dummyData.json'
import {Add, LocalHotel} from "@mui/icons-material";

function BookingDashboard() {
    const [markers, setMarkers] = useState([])
    const [hotels, setHotels] = useState([])
    const [loaded, setLoaded] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [mapCenter, setMapCenter] = useState([10.0186865, 48.50576])

    const [flyToCenter, setFlyToCenter] = useState(null)

    function handleClick(coordinates)  {
        setFlyToCenter(coordinates)
    }

    useEffect(() => {
        const readAllHotels = async () => {
            const response = await http.get("api/hotel?detail=true");
            setHotels(response.data.hotel);


            let markerings = []
            for (let hotelKey in response.data.hotel) {
                markerings.push(
                    {
                        name:  response.data.hotel[hotelKey].name,
                        coordinates:  response.data.hotel[hotelKey].HotelAddresses[0].geocoordinates.coordinates,
                        color: '#9d1e1e'
                    }
                )
            }

            for (let requestKey in stayRequests) {
                const request = stayRequests[requestKey]
                markerings.push({
                    name: `${request.type} - ${request.nightsToStay} Nights`,
                    coordinates: request.geocoordinates.coordinates,
                    color: '#75c475'
                })
            }
            markers.push(markerings)
            setMarkers(markerings)
            setLoaded(true)

        }
        return readAllHotels
        // eslint-disable-next-line
    }, [])



    return (
        <Grid container columnSpacing={2} rowSpacing={4} sx={{ marginTop: 2, paddingX: 3}} >
            <Grid item xs={12}>
                <Typography variant="h2" component="h1" >Booking</Typography>
            </Grid>
            <Grid item xs={12} xl={5}>
                <Card>
                    <CardMedia>
                        {loaded ? <StandardMap chosenFlyToCenter={flyToCenter} showHQ={true} height={'470px'} mapCenter={mapCenter} markers={markers} /> : <Card style={{ minHeight: '470px', height: '100%'}}><CircularProgress /></Card>}
                    </CardMedia>
                </Card>
            </Grid>
            <Grid item xs={12} xl={7} >
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item xs={10}><Typography variant="h3" gutterBottom>Request List</Typography></Grid>
                    <Grid item xs={2} sx={{ textAlign: 'right' }}><Button variant="outlined" color="success" startIcon={<Add/>}>New Request</Button></Grid>
                </Grid>
                 <RequestList clickHandler={handleClick} requests={stayRequests}/>
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item xs={10}><Typography variant="h3" gutterBottom>Hotel List</Typography></Grid>
                    <Grid item xs={2} sx={{ textAlign: 'right' }}><Button variant="contained" color="success" startIcon={<LocalHotel/>}>New Hotel</Button></Grid>
                </Grid>
                <HotelList clickHandler={handleClick} mapCenter={mapCenter} hotels={hotels}/>
            </Grid>
        </Grid>
    );
}

export default BookingDashboard;