import React, {useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardContent,
    Grid,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import moment from "moment";
import ScreedcheckDetailCard from "../screedcheck/ScreedcheckDetailCard";
import {ExpandMore} from "@mui/icons-material";
import ScreedcheckDetailRooms from "../screedcheck/ScreedcheckDetailRooms";
import ScreedcheckDetailComponents from "../screedcheck/ScreedcheckDetailComponents";
import ScreedcheckDetailResults from "../screedcheck/ScreedcheckDetailResults";
import PropTypes from "prop-types";

function ScreedcheckCards(props) {
    const sc = props.sc;
    const index = props.index;

    return (
        <Card key={index}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} xl={3}>
                        <Stack spacing={2}>
                            <Card>
                                <CardContent>
                                    <Tooltip title={`Created: ${moment(sc.createdAt).format('LLL')} -- Last Updated: ${moment(sc.updatedAt).format('LLL')}`}>
                                        <Typography sx={{fontSize: 14}} color="text.secondary"
                                                    gutterBottom> {sc.transactionId}</Typography>

                                    </Tooltip>
                                    <Typography variant="h3" component="h2">{index+1}. Screedcheck</Typography>
                                    <Typography>By: {sc.screedchecker}</Typography>
                                    <Typography>Date: {moment(sc.datetime_of_screedcheck).format('LLL')}</Typography>
                                    {sc.deletedAt ?
                                        <Typography>Deleted{moment(sc.deletedAt).format('LLL')}</Typography> : ''}
                                </CardContent>
                            </Card>
                            {sc.ScreedcheckDetail ? <ScreedcheckDetailCard screedcheckDetail={sc.ScreedcheckDetail}/> : null}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} xl={9}>
                        {sc.ScreedcheckDetail ? <>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore/>}
                                    aria-controls="Panel ScreedcheckDetail Rooms"
                                    id="panel-screedcheckDetail-rooms">
                                    <Stack direction="row" spacing={3}>
                                        <Typography variant="h4" component="h4" >Rooms</Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{sc.ScreedcheckDetail.ScreedcheckDetailRooms.length} {sc.ScreedcheckDetail.ScreedcheckDetailRooms.length === 1 ? 'Room' : 'Rooms'}</Typography>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ScreedcheckDetailRooms rows={sc.ScreedcheckDetail.ScreedcheckDetailRooms}
                                                            pageSize={5}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore/>}
                                    aria-controls="Panel ScreedcheckDetail Components"
                                    id="panel-screedcheckDetail-components">
                                    <Stack direction="row" spacing={3}>
                                        <Typography variant="h4" component="h4">Components</Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{sc.ScreedcheckDetail.ScreedcheckDetailComponents.length} {sc.ScreedcheckDetail.ScreedcheckDetailComponents.length === 1 ? 'Component' : 'Components'}</Typography>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ScreedcheckDetailComponents rows={sc.ScreedcheckDetail.ScreedcheckDetailComponents}
                                                                 pageSize={5}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore/>}
                                    aria-controls="Panel ScreedcheckDetail Results"
                                    id="panel-screedcheckDetail-results">
                                    <Stack direction="row" spacing={3}>
                                        <Typography variant="h4" component="h4">Results</Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{sc.ScreedcheckDetail.ScreedcheckResults.length} {sc.ScreedcheckDetail.ScreedcheckResults.length === 1 ? 'Result': 'Results'}</Typography>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ScreedcheckDetailResults rows={sc.ScreedcheckDetail.ScreedcheckResults}
                                                              pageSize={5}/>
                                </AccordionDetails>
                            </Accordion>
                        </> : <Card><CardContent><Typography variant="body">Screedcheck not completed or transmitted yet</Typography></CardContent></Card> }
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

ScreedcheckDetailCard.propTypes = {
    sc: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
}

export default ScreedcheckCards;