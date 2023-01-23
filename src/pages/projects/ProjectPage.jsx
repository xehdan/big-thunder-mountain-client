import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import http from "../../http";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button,
    Card,
    CardContent, Chip,
    Grid, Stack, Tooltip,
    Typography
} from "@mui/material"
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {Approval, CalendarMonthSharp, DoDisturb, ExpandMore, HourglassBottom, Print} from "@mui/icons-material";
import ScreedcheckCards from "../../components/project/ScreedcheckCards";
import AssemblyCards from "../../components/project/AssemblyCards";
import CustomerAddressCard from "../../components/customer/CustomerAddressCard";

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
            <Grid item xs={12} xl={2}>
                <Card sx={{ minHeight: '220px'}}>
                    <CardContent>
                        <Tooltip title={`Created: ${moment(project.createdAt).format('LLL')} -- Last Updated: ${moment(project.updatedAt).format('LLL')}`}>
                            <Typography sx={{fontSize: 14}} color="text.secondary"
                                        gutterBottom> {project.transactionId}</Typography>

                        </Tooltip>

                        <Typography variant="h2" component="h1" sx={{ paddingY: 2}}>Project</Typography>
                        <Typography>Status: <Chip size="small" label='Undefined'/></Typography>
                        <Typography>Completed: yes </Typography>
                        {project.deletedAt ?
                            <Typography>Deleted: {moment(project.deletedAt).format('LLL')}</Typography> : ''}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} xl={5}>
                <CustomerAddressCard address={customerDeliveryAddress} addressType={"Delivery Address"}/>
            </Grid>
            <Grid item xs={12} xl={5}>
                <CustomerAddressCard address={customerInvoiceAddress} addressType={"Invoice Address"}/>
            </Grid>


            <Grid item xs={12}>
                {screedcheck ? screedcheck.map((sc, index) => (
                    <ScreedcheckCards sc={sc} index={index}/>
                )) : <Card>
                    <CardContent>
                        <Typography variant="body">No Screedchecks found or assigned yet to this project</Typography>
                        <Button>Create Screedcheck</Button>
                    </CardContent>
                </Card>}
            </Grid>
            <Grid item xs={12}>
                {assembly ? assembly.map((as, index) => (
                    <AssemblyCards as={as} index={index}/>
                )) : <Card>
                    <CardContent>
                        <Typography variant="body">No Assembly found or assigned yet to this project</Typography>
                        <Button>Create Assembly</Button>
                    </CardContent>
                </Card>}
            </Grid>
        </Grid>
    );
};

export default ProjectPage;