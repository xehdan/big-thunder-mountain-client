import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import http from "../../http";
import {
    Autocomplete,
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader, CircularProgress,
    Grid,
    Slider,
    Stack,
    TextField,
    Typography,
    Skeleton
} from "@mui/material";
import {PDFDownloadLink} from "@react-pdf/renderer";
import {Domain, LocationCity, LocationOn, Mail, Person, Print, Tag} from "@mui/icons-material";
import screedcheckProtocol from "../../components/pdfGen/ScreedcheckProtocol";
import {UserContext} from "../../context/UserContext";
import ScreedcheckProtocol from "../../components/pdfGen/ScreedcheckProtocol";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import pjson from "../../../package.json";
import { PDFViewer } from '@react-pdf/renderer';
import {Calendar} from "@mui/x-date-pickers/internals/components/icons";
import moment from "moment/moment";
import CustomerAddressCard from "../../components/customer/CustomerAddressCard";
import {DatePicker, DateTimePicker} from "@mui/x-date-pickers";
import * as ics from 'ics'
import {createEvent} from "ics";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";

const ScreedcheckPage = () => {
    let {id} = useParams();
    const [screedcheck, setScreedcheck] = useState({})
    const [customer, setCustomer] = useState({})
    const [project, setProject] = useState({})
    const user = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const [executionDate, setExecutionDate] = useState(moment())
    const [screedcheckerOpen, setScreedcheckerOpen] = useState(false)
    const [screedcheckerOptions, setScreedcheckerOptions] = useState([])
    const loading2 = screedcheckerOpen && screedcheckerOptions.length === 0;

    const [screedchecker, setScreedchecker] = useState(null);
    const [screedcheckDuration, setScreedcheckDuration] = useState(null);

    useEffect(() => {
        let active = true;

        if(!loading2) {
            return undefined;
        }
        (async () => {
            let response = await http.get(`/api/employee/screedcheckers`)
            if (active) {
                setScreedcheckerOptions([...response.data.employees])
            }
        })();

        return () => {
            active = false
        };
    }, [loading2])

    useEffect(() => {
        if (!screedcheckerOpen) {
            setScreedcheckerOptions([])
        }
    }, [screedcheckerOpen])


    useEffect(() => {
        const readScreedcheckers = async() => {
            let active = true;

            if(!loading2) {
                return undefined;
            }
            await http.get(`/api/employee/screedcheckers`)
                .then(response => {
                    if (active) {
                        setScreedcheckerOptions(response.data.employees)
                    }
                })
                .then(() => {
                    active = false
                })

        }
        return readScreedcheckers
    }, [loading2])

    useEffect(() => {

        const readScreedcheck = async () => {
            setLoading(true)
            await http.get(`/api/screedcheck/${id}`, {
                params: {
                    detail: "true"
                }
            })
                .then((response) => {
                    setScreedcheck(response.data.screedcheck)
                    setProject(response.data.screedcheck.Project)
                    setScreedchecker(response.data.screedcheck.screedcheckerId)
                    setExecutionDate(moment(response.data.screedcheck.datetime_of_screedcheck))
                    const customerId = response.data.screedcheck.Project.customerId
                    http.get(`/api/customer/${customerId}`, {
                        params: {
                            detail: "true"
                        }
                    })
                        .then((response2) => {
                            setCustomer(response2.data.customer);

                            console.log(screedcheck)
                        })
                        .then(() => {
                            setLoading(false)
                        })
                })


        }
        return readScreedcheck
    }, [id])


    const LinkBehavior = React.forwardRef((props, ref) => (
        <PDFDownloadLink
            document={
                <ScreedcheckProtocol
                    title={`Screedcheck Checklist - ${customer.lastName ? customer.lastName + ', ' + customer.firstName : ''} ${customer.company ? customer.company : ''}`}
                    author={user.firstName + ' ' + user.lastName + '@thermisto'}
                    subject={`Screedcheck `}
                    keywords="tbf"
                    creator={`${pjson.name}-${pjson.version}`}
                    screedcheck={screedcheck}
                    project={project}
                    customer={customer}

                />}
            fileName={`${screedcheck.transactionId.slice(-12)} - Screedcheck`}
            ref={ref}
            to="/"
            {...props}
            role={undefined}
        />
    ));

    const handleNewDuration = (event, newValue) => {
        setScreedcheckDuration(newValue)
    }

    async function handleDownload() {
        const event = {
            start: [2023, 2, 30, 6, 30],
            duration: { hours: 6, minutes: 30 },
            title: 'Bolder Boulder',
            description: 'Annual 10-kilometer run in Boulder, Colorado',
            location: 'Folsom Field, University of Colorado (finish line)',
            url: 'http://www.bolderboulder.com/',
            geo: { lat: 40.0095, lon: 105.2669 },
            categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
            status: 'CONFIRMED',
            busyStatus: 'BUSY',
            organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
            attendees: [
                { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
                { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
            ]
        }


            const filename = 'ExampleEvent.ics'
            const file = await new Promise((resolve, reject) => {
                createEvent(event, (error, value) => {
                    if (error) {
                        reject(error)
                    }

                    resolve(new File([value], filename, { type: 'plain/text' }))
                })
            })
            const url = URL.createObjectURL(file);

            // trying to assign the file URL to a window could cause cross-site
            // issues so this is a workaround using HTML5
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = filename;

            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);

            URL.revokeObjectURL(url);
        }

    return (
            loading === true ? <Skeleton /> :
                <Grid container spacing={2} sx={{margin: 3}}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h3">Screedcheck</Typography>
                                <Stack  direction="vertical" spacing={2}>
                                    <Typography gutterBottom variant={"h4"}>System </Typography>
                                    <img src={screedcheck.Project.System.logo_path} alt={"thermisto System " + screedcheck.Project.System.system_name }
                                         style={{maxHeight: '35px', transform: 'translateY(-3px)', marginLeft: '10px'}}/>
                                </Stack>
                                <Stack direction="vertical">
                                    {customer.lastName ? <><Person/> <Typography
                                        sx={{marginRight: 2}}>{customer.firstName + ' ' + customer.lastName}</Typography></> : ''}
                                    {customer.company ? <><Domain/> <Typography
                                        sx={{marginRight: 2}}>{customer.company} </Typography></> : ''}
                                    <><LocationOn/> <Typography
                                        sx={{marginRight: 2}}>{project.customerDeliveryAddress !== undefined ? project.customerDeliveryAddress.zipcode + ' ' + project.customerDeliveryAddress.city :
                                        <Skeleton/>}</Typography></>
                                    <><Calendar/> <Typography
                                        sx={{marginRight: 2}}>{screedcheck.createdAt ? moment(screedcheck.createdAt).format('lll') :
                                        <Skeleton/>}</Typography></>
                                    <><Tag/> <Typography>{screedcheck.transactionId}</Typography></>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Card>
                                        <CustomerAddressCard address={project.customerDeliveryAddress} addressType="Assembly Address"/>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card>
                                    <CardHeader
                                        /*avatar={
                                            <Avatar sx={{bgcolor: '#f7a700'}} alt="Logo th" src={require('../../assets/ICON_white.svg').default} />
                                        }*/
                                        title="Plan screedcheck"
                                        subheader={(customer.firstName ? customer.firstName + ' ' + customer.lastName : customer.company) + ', ' + (project.customerDeliveryAddress !== undefined ? project.customerDeliveryAddress.zipcode + ' ' + project.customerDeliveryAddress.city :
                                            <Skeleton/> )}/>
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Autocomplete
                                                id="asynchronous-demo"
                                                sx={{ width: '100%' }}
                                                open={screedcheckerOpen}
                                                onOpen={() => {
                                                    setScreedcheckerOpen(true);
                                                }}
                                                onClose={() => {
                                                    setScreedcheckerOpen(false);
                                                }}
                                                onChange={(e, newValue) => (
                                                    setScreedchecker(newValue.id)
                                                )}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                getOptionLabel={(option) => (option.firstName + ' ' + option.lastName)}
                                                options={screedcheckerOptions}
                                                loading={loading2}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Screedchecker"
                                                        margin="dense"
                                                        variant="standard"
                                                        fullWidth
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <React.Fragment>
                                                                    {loading2 ? <CircularProgress color="inherit" size={20} /> : null}
                                                                    {params.InputProps.endAdornment}
                                                                </React.Fragment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                                <DateTimePicker
                                                    id="executionDateTime"
                                                    label="Execution Date Time"
                                                    required
                                                    openTo="day"
                                                    ampm={false}
                                                    views={['year', 'month', 'day', 'hours', 'minutes']}
                                                    value={executionDate}
                                                    onChange={(newValue) => {
                                                        setExecutionDate(newValue);
                                                    }}
                                                    slotProps={{ textField: { fullWidth: true, variant: 'standard', margin: 'dense' } }}

                                                />
                                            </LocalizationProvider>
                                            <Stack spacing={2} direction="row" alignItems="center">
                                                <Typography>Duration</Typography>
                                            <Slider aria-label="duration"
                                                    value={screedcheckDuration}
                                                    onChange={handleNewDuration}
                                                    step={10}
                                                    min={10}
                                                    max={120}
                                                    defaultValue={45}
                                                    valueLabelDisplay="auto"
                                            />
                                                <Typography>{screedcheckDuration} Minutes</Typography>
                                            </Stack>

                                            {
                                                executionDate != null && screedcheckDuration != null ?
                                                    <>
                                                        <Typography>Screedcheck is planned for {moment(executionDate).format('LLL')} for {screedcheckDuration} minutes</Typography>
                                                        <Button startIcon={<Mail/>} variant="outlined">Send Appointment to customer</Button>
                                                        <Button onClick={handleDownload} startIcon={<Calendar/>} variant="outlined">Download to calendar</Button>
                                                    </> : <Typography>Values not set</Typography>
                                            }

                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {/*<Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        {JSON.stringify(customer)}
                                    </CardContent>
                                </Card>
                            </Grid>*/}
                        </Grid>
                    </Grid>

                    <Grid item xl={8} xs={12}>
                        <Card>
                            <CardContent>
                                {loading ? <Skeleton/>
                                    :
                                    /*<Button startIcon={<Print/>} component={LinkBehavior} variant="outlined">
                                        Print Protocol
                                    </Button>*/
                                    <PDFViewer width={800} height={1200}>
                                        <ScreedcheckProtocol
                                            title={`Screedcheck Checklist - ${customer.lastName ? customer.lastName + ', ' + customer.firstName : ''} ${customer.company ? customer.company : ''}`}
                                            author={user.firstName + ' ' + user.lastName + '@thermisto'}
                                            subject={`Screedcheck `}
                                            keywords="tbf"
                                            creator={`${pjson.name}-${pjson.version}`}
                                            screedcheck={screedcheck}
                                            project={project}
                                            customer={customer}
                                        />
                                    </PDFViewer>
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
    );
};

export default ScreedcheckPage;