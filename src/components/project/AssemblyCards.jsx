import React, {useState} from 'react';
import PropTypes from "prop-types";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardContent,
    Grid,
    Stack, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip,
    Typography
} from "@mui/material";
import {AspectRatio, AssignmentTurnedIn, CalendarMonth, ExpandMore, Person, Timelapse} from "@mui/icons-material";
import moment from "moment";
import AssemblyAdditionalTasks from "../assembly/AssemblyAdditionalTasks";
import AssemblyControlChecks from "../assembly/AssemblyControlChecks";
import AssemblyRooms from "../assembly/AssemblyRooms";


function AssemblyCards(props) {
    const as = props.as;
    const index = props.index;

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} xl={3}>
                        <Stack spacing={2}>
                            <Card>
                                <CardContent>
                                    <Tooltip title={`Created: ${moment(as.createdAt).format('LLL')} -- Last Updated: ${moment(as.updatedAt).format('LLL')}`}>
                                        <Typography sx={{fontSize: 14}} color="text.secondary"
                                                    gutterBottom> {as.transactionId}</Typography>
                                    </Tooltip>
                                    <Typography variant="h2" component="h2">{index+1}. Assembly</Typography>
                                    <Stack direction="row" justifyContent="space-evenly" sx={{ padding: 4}}>
                                        {as.space ?
                                            <Tooltip title={`Assembly space set to ${as.space} sqm`}>
                                                <AspectRatio color="success"/>
                                            </Tooltip> :
                                            <Tooltip title="Assembly space not set yet">
                                                <AspectRatio color="error"/>
                                            </Tooltip>
                                        }
                                        {as.assembly_date ?
                                            <Tooltip title={`Assembly Date set to ${moment(as.assembly_date).format('LLL')}`}>
                                                <CalendarMonth color="success" />
                                            </Tooltip> :
                                            <Tooltip title="Assembly Date not set">
                                                <CalendarMonth color="error" />
                                            </Tooltip>
                                        }
                                        {as.estimated_duration ?
                                            <Tooltip title={`Estiamted Duration set to ${as.estimated_duration} ${as.estimated_duration > 1 ? 'Days' : 'Day'}`}>
                                                <Timelapse color="success" />
                                            </Tooltip> :
                                            <Tooltip title={`Estiamted Duration not set`}>
                                                <Timelapse color="error" />
                                            </Tooltip>
                                        }
                                        {as.mechanic ?
                                            <Tooltip title={`Mechanics (${as.mechanic}) set`}>
                                                <Person color="success"/>
                                            </Tooltip> :
                                            <Tooltip title="Mechanics not set">
                                                <Person color="error" />
                                            </Tooltip>
                                        }
                                        {as.completed ?
                                            <Tooltip title="Assembly completed">
                                                <AssignmentTurnedIn color="success" />
                                            </Tooltip> :
                                            <Tooltip title="Assembly not completed">
                                                <AssignmentTurnedIn color="error" />
                                            </Tooltip>
                                        }
                                    </Stack>
                                    <TableContainer component={Box}>
                                        <Table sx={{ mindWidth: 150 }} size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Assembly space</TableCell>
                                                    <TableCell>{as.space} sqm</TableCell>
                                                </TableRow>
                                                    <TableRow>
                                                        <TableCell>Planned assembly date</TableCell>
                                                        <TableCell>{moment(as.assembly_date).format('ll')}</TableCell>
                                                    </TableRow>
                                                <TableRow>
                                                    <TableCell>Estimated duration</TableCell>
                                                    <TableCell>{as.estimated_duration} {as.estimated_duration > 1 ? 'Days' : 'Day'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Mechanic</TableCell>
                                                    <TableCell>{as.mechanic}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Start assembly</TableCell>
                                                    <TableCell>{as.timestamp_start ? moment(as.timestamp_start).format('LLL') : 'n.n'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>End assembly</TableCell>
                                                    <TableCell>{as.timestamp_end ? moment(as.timestamp_end).format('LLL') : 'n.n'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Actual duration</TableCell>
                                                    <TableCell>{as.timestamp_start && as.timestamp_end ? Math.round(moment(as.timestamp_end).diff(moment(as.timestamp_start), "days", true) * 100) / 100 : 'n.n'} days</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Typography variant="h5" compoentn="h4" sx={{ marginTop: 2}}>Notes:</Typography>
                                    {as.notes ? <Typography variant="body2">{as.note_for_assembly}</Typography> : <Typography variant="subtitle1">No notes saved</Typography>}

                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} xl={9}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore/>}
                                aria-controls="Panel Floors"
                                id="panel-floors">
                                <Stack direction="row" spacing={3}>
                                    <Typography variant="h4" component="h4">Floors</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{as.AssemblyFloors.length} {as.AssemblyFloors.length === 1 ? 'Floor' : 'Floors'}</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <AssemblyRooms floors={as.AssemblyFloors} pageSize={5} />
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore/>}
                                aria-controls="Panel Assembly Additional Assembly Tasks"
                                id="panel-assembly-additional-assembly-tTasks">
                                <Stack direction="row" spacing={3}>
                                    <Typography variant="h4" component="h4">Additional Assembly Tasks</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{as.AssemblyAdditionalAssemblyTasks.length} {as.AssemblyAdditionalAssemblyTasks.length === 1 ? 'Task' : 'Tasks'}</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                    <AssemblyAdditionalTasks rows={as.AssemblyAdditionalAssemblyTasks} pageSize={5}/>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore/>}
                                aria-controls="Panel Assembly Control Checks"
                                id="panel-assembly-control-checks">
                                <Stack direction="row" spacing={3}>
                                    <Typography variant="h4" component="h4">Control Checks</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{as.AssemblyControlChecks.length} {as.AssemblyControlChecks.length === 1 ? 'Check' : 'Checks'}</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <AssemblyControlChecks rows={as.AssemblyControlChecks} pageSize={5}/>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

AssemblyCards.propTypes = {
    as: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
}

export default AssemblyCards;