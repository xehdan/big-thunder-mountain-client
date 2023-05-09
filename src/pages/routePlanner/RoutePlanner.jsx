import React, {useCallback, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, Grid, IconButton, Skeleton, Stack, Typography} from "@mui/material";
import StandardMap from "../../components/map/StandardMap";
import AssemblyTable from "../../components/assembly/AssemblyTable";
import http from "../../http";
import {ArrowLeft, ArrowRight, Link, LinkOff} from "@mui/icons-material";
import moment from "moment";
import Scheduler from "./Scheduler";

function RoutePlanner(props) {
    const [assemblies, setAssemblies] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingTable, setLoadingTable] = useState(false)
    const [mapCenter, setMapCenter] = useState([10.0186865, 48.50576])
    const [flyToCenter, setFlyToCenter] = useState(null)
    const [markers, setMarkers] = useState([])
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [selectedCalendarweek, setSelectedCalendarweek] = useState(moment())
    const [selectedDate, setSelectedDate] = useState(moment())
    const [switchConnected, setSwitchConnected] = useState(true)

    const onSelectedDateChange = useCallback((event, inst) => {
        console.log(`Set date to ${selectedDate}`)
        setSelectedDate(event.date);
    });

    const changeSwitchConnection = (condition) => {
        switch (condition) {
            case true:
                setSwitchConnected(true)
                break;
            case false:
                setSwitchConnected(false)
                break;
            default:
                setSwitchConnected(true)
                break;
        }
    }

    function getWindowDimensions() {
        const {innerWidth: width, innerHeight: height} = window;
        return {
            width,
            height
        };
    }

    function getCustomerName(params) {
        const project = params.Project
        const customer = project.Customer
        if (customer.company) {
            return customer.company
        }
        return `${customer.firstName} ${customer.lastName}`
    }

    const readAllAssemblies = async () => {
        setLoadingTable(true)
        const cw = selectedCalendarweek
        await http.get("api/assembly/range", {
            params: {
                detail: 'true',
                startedDate: moment(cw).startOf('week').format("YYYY-MM-DD"),
                endDate: moment(cw).endOf('week').format("YYYY-MM-DD")
            }
        })
            .then(response => {
                setAssemblies(response.data.assemblyHead)
                const respo = response.data.assemblyHead;
                setMarkers([])
                respo.map(element => (
                    setMarkers((prevState) => [
                        ...prevState,
                        {
                            name: getCustomerName(element),
                            coordinates: element.Project.customerDeliveryAddress.geocoordinates.coordinates,
                            color: '#bcbcbc'
                        }
                    ])
                ))
            })
            .then(() => {
                    setLoadingTable(false)
                    setLoading(false)
            })
    };

    useEffect(() => {
        return readAllAssemblies
    }, [])

    const updateSelectedCalendarWeek = (type: string) => () => {
        if (type === "next") {
            setSelectedDate((prevState) => moment(prevState).add(7,'d'))
            setSelectedCalendarweek((prevState) => moment(prevState).add(7, 'd'))
            setLoadingTable(true)
            const cw = moment(selectedCalendarweek).add(7, 'd')
            http.get("api/assembly/range", {
                params: {
                    detail: 'true',
                    startedDate: moment(cw).startOf('week').format("YYYY-MM-DD"),
                    endDate: moment(cw).endOf('week').format("YYYY-MM-DD")
                }
            })
                .then(response => {
                    setAssemblies(response.data.assemblyHead)
                    const respo = response.data.assemblyHead;

                    setMarkers([])
                    respo.map(element => (
                        setMarkers((prevState) => [
                            ...prevState,
                            {
                                name: getCustomerName(element),
                                coordinates: element.Project.customerDeliveryAddress.geocoordinates.coordinates,
                                color: '#bcbcbc'
                            }
                        ])
                    ))
                })
                .then(() => {
                    setLoadingTable(false)
                    setLoading(false)
                })
        } else if (type === "previous") {
            setSelectedDate((prevState) => moment(prevState).subtract(7,'d'))
            setSelectedCalendarweek((prevState) => moment(prevState).subtract(7, 'd'))
            setLoadingTable(true)
            const cw = moment(selectedCalendarweek).subtract(7, 'd')
            http.get("api/assembly/range", {
                params: {
                    detail: 'true',
                    startedDate: moment(cw).startOf('week').format("YYYY-MM-DD"),
                    endDate: moment(cw).endOf('week').format("YYYY-MM-DD")
                }
            })
                .then(response => {
                    setAssemblies(response.data.assemblyHead)
                    const respo = response.data.assemblyHead;

                    setMarkers([])
                    respo.map(element => (
                        setMarkers((prevState) => [
                            ...prevState,
                            {
                                name: getCustomerName(element),
                                coordinates: element.Project.customerDeliveryAddress.geocoordinates.coordinates,
                                color: '#bcbcbc'
                            }
                        ])
                    ))
                })
                .then(() => {
                    setLoadingTable(false)
                    setLoading(false)
                })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
                <Card>
                    <StandardMap chosenFlyToCenter={flyToCenter} showHQ={true}
                                 height={getWindowDimensions().height - 65} mapCenter={mapCenter}
                                 markers={markers} />
                </Card>
            </Grid>
            <Grid item xs={12} md={7}>
                <Grid container>
                    <Grid item xs={12} sx={{padding: 2}}>
                        <Card sx={{marginBottom: 2}}>
                            {loading || loadingTable ?
                                <Skeleton variant="rectangular" height={450}/>
                                :
                                <>
                                    <CardHeader
                                        title={`Assemblies for CW${moment(selectedCalendarweek).week()}`}
                                        subheader={`${moment(selectedCalendarweek).startOf('week').format('DD. MMMM YYYY')} - ${moment(selectedCalendarweek).endOf('week').format('DD. MMMM YYYY')} `}
                                        action={<><IconButton
                                            onClick={updateSelectedCalendarWeek('previous')}><ArrowLeft/></IconButton> {moment(selectedCalendarweek).week()}
                                            <IconButton
                                                onClick={updateSelectedCalendarWeek('next')}><ArrowRight/></IconButton></>}/>
                                    <AssemblyTable loading={loadingTable} dense={true} height={450}
                                                   assemblies={assemblies}/>
                                </>
                            }
                        </Card>
                        <Stack justifyContent="center"  alignItems="center" direction="row">
                            { switchConnected ?
                                <IconButton onClick={() => changeSwitchConnection(false)} color="success" title="Disconnect Switching"><Link/></IconButton> :
                                <IconButton onClick={() => changeSwitchConnection(true)} color="error" title="Connect Switching"><LinkOff/></IconButton> }
                        </Stack>
                        <Card>
                            <CardHeader title={'Teamslot'}/>
                                <Scheduler selectedDate={selectedDate} onSelectedDateChange={onSelectedDateChange}/>

                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default RoutePlanner;