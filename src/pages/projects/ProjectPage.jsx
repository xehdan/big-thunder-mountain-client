import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import http from "../../http";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography
} from "@mui/material"
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {ExpandMore} from "@mui/icons-material";

const ProjectPage = () => {
    let {id} = useParams();
    const [project, setProject] = useState([])
    const [customer, setCustomer] = useState([])
    const [screedcheckHeads, setScreedcheckHeads] = useState([])
    const [assemblies, setAssemblies] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const readProject = async () => {
            const response = await http.get(`/api/project/${id}`, {
                params: {
                    detail: "true"
                }
            });
            setProject(response.data.project)
            setScreedcheckHeads(response.data.project.ScreedcheckHeads)
            setAssemblies(response.data.project.AssemblyHeads)
        }
        return readProject
    }, [])

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
    }, [])

    return (
        <Grid container spacing={2} sx={{ margin: 3}}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <div>
                            {project.transactionId}
                        </div>
                        <div>
                            <Typography variant="h3" component="h1">{customer.firstName} {customer.lastName}</Typography>
                        </div>
                        <div title={moment(project.createdAt).format('DD MMMM YYYY, hh:mm')}>
                            Created: {moment(project.createdAt).fromNow()}
                        </div>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={6} xs={12}>
                {screedcheckHeads.map((head, _index) => (
                    <Card key={_index}>
                        <CardContent>
                            <Typography variant="h4" component="h2">
                                Screedcheck: {head.id}
                            </Typography>
                            <Typography>
                                Date of Screedcheck: {moment(head.datetime_of_screedcheck).format('DD MMMM YYYY, hh:mm')}
                            </Typography>
                            <Typography>
                                Screedchecker: {head.screedchecker}
                            </Typography>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Details</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {JSON.stringify(head.ScreedcheckDetail)}
                                </AccordionDetails>
                            </Accordion>

                        </CardContent>
                        <CardActions>
                            <Button onClick={() => navigate(`/screedcheck/${head.id}`)} size="small">See Screedcheck</Button>
                        </CardActions>
                    </Card>
                ))}

            </Grid>
            <Grid item lg={6} xs={12}>
                {assemblies.map((head, _index) => (
                    <Card key={_index}>
                        <CardContent>
                            <Typography variant="h4" component="h2">
                                Assembly: {head.id}
                            </Typography>
                            <Typography>
                                Date of Screedcheck: {moment(head.assembly_date).format('DD MMMM YYYY, hh:mm')}
                            </Typography>
                            <Typography>
                                mechanic: {head.mechanic}
                            </Typography>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Floors</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {JSON.stringify(head.AssemblyFloors)}
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>AssemblyAdditionalAssemblyTasks</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {JSON.stringify(head.AssemblyAdditionalAssemblyTasks)}
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>AssemblyControlChecks</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {JSON.stringify(head.AssemblyControlChecks)}
                                </AccordionDetails>
                            </Accordion>

                        </CardContent>
                        <CardActions>
                            <Button onClick={() => navigate(`/assembly/${head.id}`)} size="small">See Assembly</Button>
                        </CardActions>
                    </Card>
                ))}

            </Grid>
        </Grid>


    );
};

export default ProjectPage;