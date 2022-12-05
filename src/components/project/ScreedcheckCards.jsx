import React from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
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
                    <Grid item xs={12} sm={4}>
                        <Stack spacing={2}>
                            <Card>
                                <CardContent>
                                    <Typography sx={{fontSize: 14}} color="text.secondary"
                                                gutterBottom> {sc.transactionId}</Typography>
                                    <Typography variant="h2" component="h2">{index+1}. Screedcheck</Typography>
                                    <Typography>By: {sc.screedchecker}</Typography>
                                    <Typography>Date: {moment(sc.datetime_of_screedcheck).format('YYYY-MM-DD hh:mm')}</Typography>
                                    <Typography>CreatedAt: {moment(sc.createdAt).format('YYYY-MM-DD hh:mm')}</Typography>
                                    <Typography>Last
                                        Updated: {moment(sc.updatedAt).format('YYYY-MM-DD hh:mm')}</Typography>
                                    {sc.deletedAt ?
                                        <Typography>Deleted{moment(sc.deletedAt).format('YYYY-MM-DD hh:mm')}</Typography> : ''}
                                </CardContent>
                            </Card>
                            {sc.ScreedcheckDetail ? <ScreedcheckDetailCard screedcheckDetail={sc.ScreedcheckDetail}/> : <Card><CardContent><Typography variant="h3" component="h1">Screedcheck not completed or transmitted yet</Typography></CardContent></Card>}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        {sc.ScreedcheckDetail ? <>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore/>}
                                    aria-controls="Panel ScreedcheckDetail Rooms"
                                    id="panel-screedcheckDetail-rooms">
                                    <Typography variant="h4" component="h4">Rooms</Typography>
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
                                    <Typography variant="h4" component="h4">Components</Typography>
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
                                    <Typography variant="h4" component="h4">Results</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ScreedcheckDetailResults rows={sc.ScreedcheckDetail.ScreedcheckResults}
                                                              pageSize={5}/>
                                </AccordionDetails>
                            </Accordion>
                        </> : <Card><CardContent><Typography variant="h3" component="h1">Screedcheck not completed or transmitted yet</Typography></CardContent></Card> }
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