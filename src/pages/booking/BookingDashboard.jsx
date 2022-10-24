import React, {useState} from 'react';
import {Button, Card, CardMedia, Grid, Typography} from "@mui/material";
import HotelList from "../../components/booking/hotel/HotelList";
import RequestList from "../../components/booking/requests/RequestList";
import StandardMap from "../../components/map/StandardMap";
import hotels from '../../components/booking/hotel/dummyData.json'


function BookingDashboard() {
    const [markers, setMarkers] = useState(hotels)

    /*function generateMarkers() {
        setMarkers(hotels)
        console.log(markers)
    }*/

    return (
        <Grid container spacing={2} sx={{ margin: 3}}>
            <Grid item xs={12} sm={4}>
                <Card>
                    <CardMedia>
                        <StandardMap markers={markers} height={'470px'}/>
                    </CardMedia>
                </Card>
            </Grid>
            <Grid item xs={12} sm={8} >
                <Typography variant="h3" gutterBottom>Request List</Typography>
                <RequestList/>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h3" gutterBottom>Hotel List</Typography>
                <HotelList/>
            </Grid>
        </Grid>
    );
}

export default BookingDashboard;