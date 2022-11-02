import React, {useEffect, useState} from 'react';
import {
    useParams
} from "react-router-dom";
import http from "../../http";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import ContactTable from "../../components/contact/ContactTable";
import AddressTable from "../../components/contact/AddressTable";
import CustomerTimeline from "../../components/customer/CustomerTimeline";
import ProjectCard from "../../components/project/ProjectCard";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}




function CustomerPage() {
    let {id} = useParams();
    const [customer, setCustomer] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [projects, setProjects] = useState([])

    useEffect(() => {
        const readCustomer = async () => {
            const response = await http.get(`/api/customer/${id}`, {
                params: {
                    detail: "true"
                }
            });
            setCustomer(response.data.customer);
        };
        return readCustomer
    }, [id])

    useEffect(() => {
        const readProjects = async () => {
            const response = await http.get(`/api/project/customer/${id}`);
            setProjects(response.data.projects);
        };
        return readProjects
    }, [id])

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    /*function stringToColor(string) {
        let hash = 0;
        let i;

        /!* eslint-disable no-bitwise *!/
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /!* eslint-enable no-bitwise *!/

        return color;
    }*/

    return (
        <Grid container spacing={2} sx={{ margin: 3}}>
            <Grid item md={3} xs={4}>
                <Card>
                    <CardContent>
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            {/*<CustAvatar name={ customer.company ? customer.company[0] : `${customer.firstName[0]}${customer.lastName[0]}` } />*/}

                            {/*<Avatar sx={{ height: 80, width: 80 }}>{ customer.company ? customer.company[0] : `${customer.firstName[0]}${customer.lastName[0]}` }</Avatar>*/}
                            <Typography variant="h3" component="h1">
                                {customer.company ? customer.company : `${customer.firstName} ${customer.lastName}`}
                            </Typography>
                        <Chip label="ABC" />
                        <Grid container sx={{ marginY:  3 }}>
                        <Grid item xs={6} >
                            <Grid container>
                                <Grid item xs={1}><Avatar variant="square">{projects.length > 0 ? projects.length : '0'}</Avatar></Grid>
                                <Grid item xs={11}>Project</Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container>
                                <Grid item xs={1}><Avatar variant="square">{projects.length > 0 ? projects.length : '0'}</Avatar></Grid>
                                <Grid item xs={11}>Project</Grid>
                            </Grid>
                        </Grid>
                        </Grid>
                        </div>
                            <Typography variant="h5" component="h2">
                                Details
                            </Typography>
                        <Divider/>
                        <p>First Name: {customer.firstName}</p>
                        <p>Last Name: {customer.lastName}</p>
                        <p>Company: {customer.company}</p>
                        <p>Customer Type: <Chip label="ABC" /></p>
                        <p>Customer Group: </p>

                    </CardContent>
                </Card>
            </Grid>
            <Grid item md={9} xs={6}>
                <Card>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="customers tabs">
                        <Tab label="Overview" />
                        <Tab label="Contacts" />
                        <Tab label="Addresses" />
                        <Tab label="All Details" />

                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <CustomerTimeline/>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <ContactTable customerId={customer.id} isCustomer />
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <AddressTable customerId={customer.id} />
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        <Box sx={{ height: 400, width: '100%', overflowY: 'scroll' }}>
                            {JSON.stringify(customer)}
                        </Box>
                    </TabPanel>

                </Card>
            </Grid>
            <Grid item md={3} xs={12}>
                {projects.map((project, _index) => (
                    <ProjectCard key={_index} project={project} />
                ))}
            </Grid>
        </Grid>
    );
}

export default CustomerPage;