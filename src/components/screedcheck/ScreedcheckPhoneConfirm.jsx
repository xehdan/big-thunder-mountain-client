import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent, CircularProgress,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Skeleton, Snackbar, Stack, TextField, Typography
} from "@mui/material";
import {
    Autorenew,
    Cancel,
    Check,
    Mail,
    Person,
    Phone,
    QuestionAnswer,
    Watch
} from "@mui/icons-material";
import {UserContext} from "../../context/UserContext";
import {DatePicker, DateTimePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {Calendar} from "@mui/x-date-pickers/internals/components/icons";
import http from "../../http";

const ScreedcheckPhoneConfirm = props => {
    const user = useContext(UserContext);
    const screedcheck = props.screedcheck
    const parentLoading = props.setLoading
    const [pressedCallButton, setPressedCallButton] = useState(false);
    const [readyForScreedcheck, setReadyForScreedcheck] = useState(null);
    const [getBackToDate, setGetBackToDate] = useState();
    const [desiredDateTime, setDesiredDateTime] = useState(null)

    const [screedcheckerOpen, setScreedcheckerOpen] = useState(false)
    const [screedcheckerOptions, setScreedcheckerOptions] = useState([])
    const loading = screedcheckerOpen && screedcheckerOptions.length === 0;

    const [screedchecker, setScreedchecker] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(true)
    const [snackbarText, setSnackbarText] = useState("");
    const [snackbarColor, setSnackbarColor] = useState();



    useEffect(() => {
            let active = true;

            if(!loading) {
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
        }, [loading])

    useEffect(() => {
        if (!screedcheckerOpen) {
            setScreedcheckerOptions([])
        }
    }, [screedcheckerOpen])

    const callCustomer = () => {
      window.alert("Calling 1234")
        setPressedCallButton(true)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    async function storeUpdate() {
        try {

            const screedcheckToStore = {
                screedcheckerId: screedchecker,
                datetime_of_screedcheck: desiredDateTime,
            }

            await http.patch(`/api/screedcheck/datetime/${screedcheck.id}`, screedcheckToStore)
                .then((response) => {
                    if (response.status === 200) {
                        console.log(response.status)
                        setSnackbarText(response.statusText)
                        setSnackbarColor("success")
                        setSnackbarOpen(true)
                        parentLoading(true)
                        props.setMainLoading(true)
                        props.setScreedcheck(null)
                    } else {
                        console.log(response)
                        setSnackbarText(response.statusText)
                        setSnackbarColor("error")
                    }
                })

        } catch (e) {
            console.error("ScreedcheckPhoneConfirm Error: ", e.message)
            console.error("ScreedcheckPhoneConfirm Error: ", e)
            setSnackbarText(e.message)
            setSnackbarColor("error")
        } finally {
            setSnackbarOpen(true)
            console.log("Finally")
        }


    }


    return (
        <>
                <Card>
                    <CardContent>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <Person/>
                                </ListItemIcon>
                                <ListItemText>
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
                                        loading={loading}
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
                                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Calendar />
                                </ListItemIcon>
                                <ListItemText>
                                        <DateTimePicker
                                            id="desiredDateTime"
                                            label="Desired Date Time"
                                            required
                                            openTo="day"
                                            ampm={false}
                                            views={['year', 'month', 'day', 'hours', 'minutes']}
                                            value={desiredDateTime}
                                            minDateTime={moment()}
                                            onChange={(newValue) => {
                                                setDesiredDateTime(newValue);
                                            }}
                                            renderInput={(params) => <TextField margin="dense"
                                                                                variant="standard" fullWidth {...params} />}
                                        />
                                </ListItemText>
                            </ListItem>
                            {desiredDateTime === null ? null :
                            <ListItem>
                                <ListItemIcon>
                                    <Phone />
                                </ListItemIcon>
                                <ListItemText>
                                    <Stack>
                                        <Typography>Start call</Typography>
                                        <Button  onClick={callCustomer} disabled={desiredDateTime === null} variant="contained" startIcon={<Phone/>}>01234/5678910</Button>

                                    </Stack>
                                </ListItemText>
                            </ListItem> }
                            {
                                pressedCallButton ?
                                    <>
                                        <ListItem>
                                            <ListItemIcon>
                                                <QuestionAnswer/>
                                            </ListItemIcon>
                                            <ListItemText>
                                                Hello, this is {user.fullName} from thermisto calling. I'm calling regarding your order
                                                placed on {moment(screedcheck.Project.ProjectOrder.createdAt).format('ll')} for your new underfloor heating. Before we do any assembly we want to make sure everything is ready to go.
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <QuestionAnswer/>
                                            </ListItemIcon>
                                            <ListItemText>
                                                Are you ready for the screedcheck?
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemButton
                                                selected={readyForScreedcheck === true}
                                                onClick={() => setReadyForScreedcheck(true)}>
                                                <ListItemIcon>
                                                    <Check />
                                                </ListItemIcon>
                                                <ListItemText>
                                                    Affirmative
                                                </ListItemText>
                                            </ListItemButton>
                                            <ListItemButton
                                                selected={readyForScreedcheck === false}
                                                onClick={() => setReadyForScreedcheck(false)}>
                                                <ListItemIcon>
                                                    <Cancel />
                                                </ListItemIcon>
                                                <ListItemText>
                                                    Negative
                                                </ListItemText>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <QuestionAnswer/>
                                            </ListItemIcon>
                                            <ListItemText>
                                                {readyForScreedcheck === true ? "Great, then we'll set an appointment for the screedcheck" : null}
                                                {readyForScreedcheck === false ? "When do you think you'll be ready for the screedcheck?" : null}
                                                {readyForScreedcheck === null ? <Skeleton/> : null}
                                            </ListItemText>
                                        </ListItem>

                                        {readyForScreedcheck === false && desiredDateTime !== null ?
                                            <>

                                            <ListItem>
                                                <ListItemIcon>
                                                    <Calendar />
                                                </ListItemIcon>
                                                <DatePicker
                                                    id="getBackToDate"
                                                    label="Get Back To Date"
                                                    required
                                                    openTo="month"
                                                    views={['year', 'month', 'day']}
                                                    value={getBackToDate}
                                                    onChange={(newValue) => {
                                                        setGetBackToDate(newValue);
                                                    }}
                                                    renderInput={(params) => <TextField margin="dense"
                                                                                        variant="standard" fullWidth {...params} />}
                                                />
                                            </ListItem>
                                                {getBackToDate !== null && desiredDateTime !== null ?
                                                    <>
                                                        <ListItem>
                                                            <ListItemIcon>
                                                                <Autorenew />
                                                            </ListItemIcon>
                                                            <ListItemText>
                                                                All right, then we'll give you a call on {moment(getBackToDate).format('ll')}
                                                            </ListItemText>
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemIcon>
                                                                <QuestionAnswer/>
                                                            </ListItemIcon>
                                                            <ListItemText>
                                                                If something occurs in the meantime please let us know and we're happy to assist.
                                                            </ListItemText>
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemIcon>
                                                                <QuestionAnswer/>
                                                            </ListItemIcon>
                                                            <ListItemText>
                                                                Any further questions by your side?
                                                            </ListItemText>
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemIcon>
                                                                <Autorenew />
                                                            </ListItemIcon>
                                                            <ListItemText>
                                                                Great, then we'll hear us on {moment(getBackToDate).format('ll')} for a follow up
                                                            </ListItemText>
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemIcon>
                                                                <QuestionAnswer/>
                                                            </ListItemIcon>
                                                            <ListItemText>
                                                                Goodbye
                                                            </ListItemText>
                                                        </ListItem>
                                                        <ListItem>
                                                            <Button onClick={() => window.alert("Saving negative way")} autoFocus={getBackToDate !== null && readyForScreedcheck === false} variant="contained" color={"success"}>
                                                                Save Data
                                                            </Button>
                                                        </ListItem>
                                                    </>
                                                    : null }
                                            </>
                                            : null }
                                    {readyForScreedcheck === true && desiredDateTime !== null ?
                                        <>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Calendar/>
                                                </ListItemIcon>
                                                <ListItemText>
                                                    My colleague will be in your distance, on {moment(desiredDateTime).format('ll')} around {moment(desiredDateTime).format('HH:mm')}. Would that be possible?
                                                </ListItemText>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Watch/>
                                                </ListItemIcon>
                                                <ListItemText>
                                                    The screedcheck will take about XX minutes
                                                </ListItemText>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Mail/>
                                                </ListItemIcon>
                                                <ListItemText>
                                                    Great, you'll get a confirmation with all the details after our call.
                                                </ListItemText>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                <QuestionAnswer/>
                                            </ListItemIcon>
                                                <ListItemText>
                                                    Any further questions by your side?
                                                </ListItemText>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Person/>
                                                </ListItemIcon>
                                                <ListItemText>
                                                    Great, then we'll see us on {moment(desiredDateTime).format('ll')} at around {moment(desiredDateTime).format('HH:mm')}
                                                </ListItemText>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <QuestionAnswer/>
                                                </ListItemIcon>
                                                <ListItemText>
                                                    Goodbye
                                                </ListItemText>
                                            </ListItem>
                                            <ListItem>
                                                <Button onClick={storeUpdate} variant="contained" color={"success"}>
                                                    Save Data
                                                </Button>
                                            </ListItem>
                                        </> : null
                                    }
                                </> : null}
                        </List>
                    </CardContent>
                </Card>
            {/*autoHideDuration={6000}*/}
            <Snackbar open={snackbarOpen} onClose={handleClose}  anchorOrigin={{vertical:'bottom', horizontal: 'right'}}>
                <Alert onClose={handleClose} severity={snackbarColor} sx={{ width: '100%'}}>
                    {snackbarText}
                </Alert>
            </Snackbar>
        </>
    );
};

ScreedcheckPhoneConfirm.propTypes = {
    screedcheck: PropTypes.object.isRequired
};

export default ScreedcheckPhoneConfirm;