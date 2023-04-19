import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, Grid, IconButton, Skeleton, Typography} from "@mui/material";
import StandardMap from "../../components/map/StandardMap";
import AssemblyTable from "../../components/assembly/AssemblyTable";
import http from "../../http";
import {ArrowLeft, ArrowRight} from "@mui/icons-material";
import moment from "moment";

function RoutePlanner(props) {
    const [assemblies, setAssemblies] = useState([])
    const [loading, setLoading] = useState(false)
    const [mapCenter, setMapCenter] = useState([10.0186865, 48.50576])
    const [flyToCenter, setFlyToCenter] = useState(null)
    const [markers, setMarkers] = useState([])
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [selectedCalendarweek, setSelectedCalendarweek] = useState(moment())

    function handleClick(coordinates) {
        setFlyToCenter(coordinates)
    }

    function getWindowDimensions() {
        const {innerWidth: width, innerHeight: height} = window;
        return {
            width,
            height
        };
    }

    useEffect(() => {
        const readAllAssemblies = async () => {
            const response = await http.get("api/assembly/range", {
                data: {
                    "startedDate": "2022-11-03 00:00:00",
                    "endDate": "2023-12-12 00:00:00"
                }
            });
            console.log(response)
            setAssemblies(response.data.assemblyHead);
        };
        return readAllAssemblies
    }, [])

    const updateSelectedCalendarWeek = (type: string) => () => {
        if (type === "next") {
            setSelectedCalendarweek((prevState) => moment(prevState).add(7, 'd'))
        } else if (type === "previous") {
            setSelectedCalendarweek((prevState) => moment(prevState).subtract(7, 'd'))
        } else {
            return null
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
                <Card>
                    {loading ?
                        <Skeleton variant="rectangular" height={getWindowDimensions().height - 65}/>
                        :
                        <StandardMap chosenFlyToCenter={flyToCenter} showHQ={true}
                                     height={getWindowDimensions().height - 65} mapCenter={mapCenter}
                                     markers={markers}/>
                    }
                </Card>
            </Grid>
            <Grid item xs={12} md={7}>
                <Grid container>
                    <Grid item xs={12} sx={{padding: 2}}>
                        <Card sx={{marginBottom: 2}}>
                            {loading ?
                                <Skeleton variant="rectangular" height={450}/>
                                :
                                <>
                                    <CardHeader
                                        title={`Assemblies for CW${moment(selectedCalendarweek).week()}`}
                                        subheader={`${moment(selectedCalendarweek).startOf('week').format('ll')} - ${moment(selectedCalendarweek).endOf('week').format('ll')} `}
                                        action={<><IconButton
                                            onClick={updateSelectedCalendarWeek('previous')}><ArrowLeft/></IconButton> {moment(selectedCalendarweek).week()}
                                            <IconButton
                                                onClick={updateSelectedCalendarWeek('next')}><ArrowRight/></IconButton></>}/>
                                    <AssemblyTable dense={true} height={450} assemblies={assemblies}/>
                                </>
                            }
                        </Card>
                        <Card>
                            <CardHeader title={'Teamslot'}/>
                            <CardContent>
                                <Typography>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aspernatur atque,
                                    aut blanditiis corporis ducimus eveniet exercitationem impedit ipsa, ipsam numquam
                                    quia rerum sunt? Ad alias deserunt dicta eius eum non officiis pariatur perferendis,
                                    reiciendis, repellendus sint vel voluptatum! Asperiores commodi enim error iusto
                                    magnam nemo quisquam sunt voluptatem. Animi assumenda dolore hic iste iure maxime
                                    officiis possimus voluptatibus. Aliquam, at beatae consectetur cumque cupiditate
                                    ducimus, et hic in labore libero nesciunt nulla, placeat porro quis reiciendis
                                    reprehenderit repudiandae saepe sequi! Adipisci amet autem blanditiis culpa deserunt
                                    dignissimos dolore dolorem doloribus earum esse est eum explicabo hic itaque iure
                                    iusto labore magni, modi nemo nesciunt nobis nostrum praesentium quae quam
                                    quibusdam, quo reiciendis saepe suscipit totam ullam velit voluptatem voluptatum!
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default RoutePlanner;