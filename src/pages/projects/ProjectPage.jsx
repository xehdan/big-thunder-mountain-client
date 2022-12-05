import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import http from "../../http";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button,
    Card,
    CardContent, Chip,
    Grid, Stack,
    Typography
} from "@mui/material"
import moment from "moment/moment";
import {useNavigate} from "react-router-dom";
import {Approval, CalendarMonthSharp, DoDisturb, ExpandMore, HourglassBottom, Print} from "@mui/icons-material";
import ScreedcheckDetailRooms from "../../components/screedcheck/ScreedcheckDetailRooms";
import ScreedcheckDetailComponents from "../../components/screedcheck/ScreedcheckDetailComponents";
import ScreedcheckDetailResults from "../../components/screedcheck/ScreedcheckDetailResults";
import ScreedcheckDetailCard from "../../components/screedcheck/ScreedcheckDetailCard";
import ScreedcheckCards from "../../components/project/ScreedcheckCards";

const ProjectPage = () => {
    let {id} = useParams();
    const [project, setProject] = useState({})
    const [customerDeliveryAddress, setCustomerDeliveryAddress] = useState({})
    const [customerInvoiceAddress, setCustomerInvoiceAddress] = useState({})
    const [screedcheck, setScreedcheck] = useState([])
    const [assembly, setAssembly] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const readProject = async () => {
            const response = await http.get(`/api/project/${id}`, {
                params: {
                    detail: "true"
                }
            });
            setProject(response.data.project)
            setCustomerDeliveryAddress(response.data.project.customerDeliveryAddress)
            setCustomerInvoiceAddress(response.data.project.customerInvoiceAddress)
            setScreedcheck(response.data.project.ScreedcheckHeads)
            setAssembly(response.data.project.AssemblyHeads)
        }
        return readProject
    }, [id])


    return (
        <Grid container spacing={2} sx={{margin: 3}}>
            <Grid item xs={12} lg={4}>
                <Card>
                    <CardContent>
                        <Typography sx={{fontSize: 14}} color="text.secondary"
                                    gutterBottom> {project.transactionId}</Typography>
                        <Typography variant="h1" component="h1">Project</Typography>
                        <Typography>Status: <Chip size="small" label='Undefined'/></Typography>
                        <Typography>Completed: yes </Typography>
                        <Typography>Created At: {moment(project.createdAt).format('YYYY-MM-DD hh:mm')}</Typography>
                        <Typography>Last Update: {moment(project.updatedAt).format('YYYY-MM-DD hh:mm')}</Typography>
                        {project.deletedAt ?
                            <Typography>Deleted: {moment(project.deletedAt).format('YYYY-MM-DD hh:mm')}</Typography> : ''}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} lg={3}>
                <Card>
                    <CardContent>
                        <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                            {customerDeliveryAddress.transactionId}
                        </Typography>
                        <Typography variant="h5" component="div">
                            Delivery Address
                        </Typography>
                        <Typography sx={{mt: 1.5}}>
                            {customerDeliveryAddress.street} {customerDeliveryAddress.housenumber}
                        </Typography>
                        <Typography>
                            {customerDeliveryAddress.zipcode} {customerDeliveryAddress.city}
                        </Typography>
                        <Typography>
                            {customerDeliveryAddress.state}
                        </Typography>
                        <Typography>
                            {customerDeliveryAddress.country}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} lg={3}>
                <Card>
                    <CardContent>
                        <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                            {customerInvoiceAddress.transactionId}
                        </Typography>
                        <Typography variant="h5" component="div">
                            Invoice Address
                        </Typography>
                        <Typography sx={{mt: 1.5}}>
                            {customerInvoiceAddress.street} {customerInvoiceAddress.housenumber}
                        </Typography>
                        <Typography>
                            {customerInvoiceAddress.zipcode} {customerInvoiceAddress.city}
                        </Typography>
                        <Typography>
                            {customerInvoiceAddress.state}
                        </Typography>
                        <Typography>
                            {customerInvoiceAddress.country}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} lg={2}>
                <Card>
                    <CardContent>
                        <Stack spacing={2} sx={{marginTop: 2, marginBottom: 2}}>
                            <Button label="Approve" startIcon={<Approval/>} color="success"
                                    variant="contained">Approve</Button>
                            <Button label="Standy" startIcon={<HourglassBottom/>} color="warning"
                                    variant="contained">Standby</Button>
                            <Button label="Decline" startIcon={<DoDisturb/>} color="error"
                                    variant="contained">Decline</Button>
                        </Stack>
                        <Stack spacing={2}>
                            <Button startIcon={<Print/>}>Protocol</Button>
                            <Button label="Set to review" startIcon={<CalendarMonthSharp/>}>Set Review</Button>
                        </Stack>
                    </CardContent>

                </Card>
            </Grid>

            <Grid item xs={12}>
                {screedcheck ? screedcheck.map((sc, index) => (
                    <ScreedcheckCards sc={sc} index={index}/>
                )) : <Card>
                    <CardContent>
                        No Screedchecks found or assigned yet to this project
                    </CardContent>
                </Card>}
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography>{JSON.stringify(assembly)}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>


    );
};

export default ProjectPage;