import React, {forwardRef, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import http from "../../http";
import {
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
    Skeleton,
    Button,
    Tabs,
    Tab,
    Box,
    CardHeader,
    ListItemIcon, ListItemText, ListItem, List, Avatar, Tooltip, CardActions, IconButton
} from "@mui/material";
import {
    Add,
    Approval, Bathtub, Bed, BedroomBaby, Cancel,
    CheckBox, CheckBoxOutlineBlank, Delete,
    DoDisturb,
    Domain, Edit, HelpCenter,
    HourglassBottom, HouseSiding, Kitchen, Living,
    LocationOn, Mail,
    Person, Phone,
    Print, Save,
    Tag, Weekend, Work
} from "@mui/icons-material";
import {Calendar} from "@mui/x-date-pickers/internals/components/icons";
import moment from "moment";
import CustomerAddressCard from "../../components/customer/CustomerAddressCard";
import {TabPanel} from "@mui/lab";
import {DataGrid, GridActionsCellItem, GridRowModes, GridToolbarContainer} from "@mui/x-data-grid";
import AssemblyFloorCrudGrid from "../../components/assembly/AssemblyFloorCrudGrid";
import {deepOrange, deepPurple} from '@mui/material/colors';
import ManifoldCrud from "../../components/assembly/ManifoldCrud";
import AssemblyCircuitCrudGrid from "../../components/assembly/AssemblyCircuitCrudGrid";
import {PDFDownloadLink, PDFViewer} from "@react-pdf/renderer";
import ComplaintProtocol from "../../components/pdfGen/ComplaintProtocol";
import AssemblyProtocol from "../../components/pdfGen/AssemblyProtocol";
import AssemblyHeadCardEdit from "./AssemblyHeadCardEdit";
import AssemblyDateConfirmationMail from "./AssemblyDateConfirmationMail";


function AssemblyPage() {
    let {id} = useParams();
    const [project, setProject] = useState({});
    const [assembly, setAssembly] = useState({});
    const [manifolds, setManifolds] = useState([])
    const [floors, setFloors] = useState([])
    const [loading, setLoading] = useState(true)
    const [tabValue, setTabValue] = useState(0)
    const [openFloorAdd, setOpenFloorAdd] = useState(false);
    const [openHeadEdit, setOpenHeadEdit] = useState(false);
    const [openDateConfirmation, setOpenDateConfirmation] = useState(false);


    useEffect(() => {
        const readAll = async () => {
            await http.get(`/api/assembly/${id}`, {
                params: {
                    detail: "true"
                }
            })
                .then((response) => {
                    setAssembly(response.data.assembly)
                    setLoading(false)
                    console.log(assembly)
                    setManifolds([])
                    setFloors([])
                    response.data.assembly.AssemblyFloors.map(
                        (element, index) => (
                            setFloors((prevState) => [...prevState, element]),
                                element.AssemblyManifolds.map(
                                    (element2, index2) => setManifolds((prevState) =>
                                        [...prevState, element2]
                                    )
                                )))
                })
                .catch((response) => console.error(response))
        };
        return readAll

    }, [id, tabValue])

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    function TabPanel(props: TabPanelProps) {
        const {children, tabValue, index, ...other} = props;

        return (
            <div
                role="tabpanel"
                hidden={tabValue !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {tabValue === index && (
                    <Box sx={{p: 3}}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }


    const LinkBehavior = forwardRef((props, ref) => (
        <PDFDownloadLink
            document={
                <AssemblyProtocol
                    title="Assembly Checklist"
                    author="tbf"
                    subject="tbf"
                    keywords="tbf"
                    creator="test"
                    assembly={assembly}
                />}
            fileName={`AssemblyProtocol_${assembly.transactionId.substring(assembly.transactionId.length - 8)}_${assembly.Project.customerDeliveryAddress.zipcode + '_' + assembly.Project.customerDeliveryAddress.city}.pdf`}
            ref={ref}
            to="/"
            {...props}
            role={undefined}
        />
    ));

    const handleHeadEditClose = () => {
        setOpenHeadEdit(false)
    }
    const handleHeadEditOpen = () => {
        setOpenHeadEdit(true)
    }

    const handleDateConfirmationOpen = () => {
        setOpenDateConfirmation(true)
    }

    const handleDateConfirmationClose = () => {
        setOpenDateConfirmation(false)
    }

    return (
        loading === true ? <Skeleton sx={{padding: 50}}/> :
            <>
                <AssemblyHeadCardEdit setAssembly={setAssembly} assembly={assembly} assemblyDate={assembly.assembly_date} open={openHeadEdit} onClose={handleHeadEditClose}/>
                <Grid container spacing={2} sx={{margin: 3}}>
                    <Grid item xs={12} xl={4}>
                        <Card>
                            <CardHeader title={"Assembly"}
                                        subheader={
                                            <Stack direction="vertical" spacing={2}>
                                                <Typography variant={"h4"}>System </Typography>
                                                <img src={assembly.Project.System.logo_path}
                                                     alt={"thermisto System " + assembly.Project.System.system_name}
                                                     style={{
                                                         maxHeight: '35px',
                                                         transform: 'translateY(-3px)',
                                                         marginLeft: '10px'
                                                     }}/>
                                            </Stack>
                                        }
                                        action={<IconButton onClick={handleHeadEditOpen}><Edit/></IconButton>}
                            />
                            <CardContent>
                                <Grid container>

                                    {assembly.Project.Customer.lastName ?
                                        <Grid item xs={6} md={4}>
                                            <Person style={{float: 'left'}}/>
                                            <Typography sx={{marginLeft: 1}} variant="subtitle2">
                                                {assembly.Project.Customer.firstName + ' ' + assembly.Project.Customer.lastName}
                                            </Typography>
                                        </Grid> : null}


                                    {assembly.Project.Customer.company ?
                                        <Grid item xs={6} md={3}><Domain style={{float: 'left'}}/> <Typography
                                            sx={{marginLeft: 0.5}}
                                            variant="subtitle2">{assembly.Project.Customer.company} </Typography></Grid> : null}

                                    <Grid item xs={6} md={4}>
                                        <LocationOn style={{float: 'left'}}/>
                                        <Typography
                                            sx={{marginLeft: 0.5}}
                                            variant="subtitle2">{assembly.Project.customerDeliveryAddress !== undefined ? assembly.Project.customerDeliveryAddress.zipcode + ' ' + assembly.Project.customerDeliveryAddress.city :
                                            <Skeleton/>}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <Calendar style={{float: 'left'}}/>
                                        <Typography
                                            sx={{marginLeft: 0.5}}
                                            variant="subtitle2"
                                        >{assembly.assembly_date ? moment(assembly.assembly_date).format('ll') :
                                            <Skeleton/>}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Tag style={{float: 'left'}}/> <Typography
                                        variant="subtitle2">{assembly.transactionId}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} xl={8}>
                        <Card>
                            <CustomerAddressCard address={assembly.Project.customerDeliveryAddress}
                                                 addressType={"Assembly Address"} calculateRoute/>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                                <Tab label="Floors" {...a11yProps(0)} />
                                <Tab label="Manifolds" {...a11yProps(1)} />
                                <Tab label="Circuit" {...a11yProps(2)} />
                                <Tab label="Communication" {...a11yProps(2)} />
                            </Tabs>

                            <TabPanel tabValue={tabValue} index={0}>
                                <AssemblyFloorCrudGrid assemblyHeadId={assembly.id} openFloor={openFloorAdd}
                                                       assemblyFloor={assembly.AssemblyFloors}/>
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={1}>
                                <ManifoldCrud assemblyFloor={assembly.AssemblyFloors}/>
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={2}>
                                <CardContent>
                                    <Grid spacing={2} container>
                                        <AssemblyCircuitCrudGrid
                                            manifolds={manifolds}
                                            assemblyId={assembly.id}
                                            floors={floors}
                                        />
                                    </Grid>
                                </CardContent>
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={3}>
                                <Grid container>
                                    <Grid item xs={12} md={9}>
                                        <Typography>Communication</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Stack spacing={2} sx={{marginTop: 2, marginBottom: 2}}>
                                            <Button component={LinkBehavior} label="Print Protocol" startIcon={<Print/>}
                                                    variant="contained">Assembly Protocol</Button>
                                            <AssemblyDateConfirmationMail open={openDateConfirmation} onClose={handleDateConfirmationClose}/>
                                            <Button onClick={handleDateConfirmationOpen} startIcon={<Mail/>} variant="contained">Date confirmation</Button>
                                            <Button startIcon={<Phone/>} variant="contained">Note</Button>
                                            {/*
                                <Button label="Standy" startIcon={<HourglassBottom/>} color="warning" variant="contained">Standby</Button>
                                <Button label="Decline" startIcon={<DoDisturb/>} color="error" variant="contained">Decline</Button>*/}
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <CardContent>
                                </CardContent>
                            </TabPanel>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card>
                            <CardHeader title={"Additional Tasks"} action={<IconButton><Edit/></IconButton>}/>
                            <CardContent>
                                <List dense>
                                    {assembly.AssemblyAdditionalAssemblyTasks.map((element, index) => (
                                        <ListItem>
                                            <ListItemIcon>
                                                {element.completed ? <CheckBox/> : <CheckBoxOutlineBlank/>}
                                            </ListItemIcon>
                                            <ListItemText primary={`${element.task} on ${element.floor_level}`}
                                                          secondary={element.completed ? moment(element.timestamp_completed).format('lll') : 'not completed yet'}/>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card>
                            <CardHeader title={"Assembly Control Checks"} action={<IconButton><Edit/></IconButton>}/>
                            <CardContent>
                                <List dense>
                                    {assembly.AssemblyControlChecks.map((element, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                {element.completed ? <CheckBox/> : <CheckBoxOutlineBlank/>}

                                            </ListItemIcon>
                                            <ListItemText primary={element.task}
                                                          secondary={element.completed ? moment(element.timestamp_completed).format('lll') : 'not completed yet'}>

                                            </ListItemText>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

            </>
    );
}

export default AssemblyPage;