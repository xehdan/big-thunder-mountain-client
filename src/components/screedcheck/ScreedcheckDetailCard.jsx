import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Stack, Table, TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import {
    LocalParking,
    Gavel,
    ElectricBolt,
    Water, DoorFront, Check, DoNotDisturb, Plumbing, AssignmentTurnedIn, AssignmentLate
} from "@mui/icons-material";

function ScreedcheckDetailCard(props) {
    const sc = props.screedcheckDetail

    return (
        <Card>
            <CardContent>
                <Stack direction="row" >
                    <Tooltip title={`Created: ${moment(sc.createdAt).format('YYYY-MM-DD hh:mm')} -- Last Updated: ${moment(sc.updatedAt).format('YYYY-MM-DD hh:mm')}`}>
                        <Typography sx={{fontSize: 14}} color="text.secondary"
                                    gutterBottom> {sc.transactionId}</Typography>

                    </Tooltip>
                       </Stack>

                <Typography variant="h4" component="h3">Details</Typography>
                <Stack direction="row" justifyContent="space-evenly" sx={{ padding: 4}}>
                    {sc.is_parking_space_available ?
                        <Tooltip title="Parking available">
                            <LocalParking color="success" />
                        </Tooltip> :
                        <Tooltip title="Parking not available">
                            <LocalParking color="error" />
                        </Tooltip>
                        }
                    {sc.county_parking_permission_necessary ?
                        <Tooltip title={"County Parking Permission needed"}>
                            <Gavel color="error" />
                        </Tooltip>
                         : <Tooltip title={"County Parking Permission not needed"}>
                            <Gavel color="success"/>
                        </Tooltip>}
                    {sc.highvoltage_current_available ?
                        <Tooltip title="Highvoltage current available">
                            <ElectricBolt color="success" />
                        </Tooltip> :
                        <Tooltip title="Highvoltage current not available">
                            <ElectricBolt color="error" />
                        </Tooltip> }
                    {sc.water_available ?
                        <Tooltip title="Water available">
                            <Water color="success" />
                        </Tooltip>
                         :
                        <Tooltip title="Water not available">
                            <Water color="error" />
                        </Tooltip>
                    }
                    {sc.entrance_street_level ?
                        <Tooltip title="Entrance on street level">
                            <DoorFront color="success" />
                        </Tooltip>:
                        <Tooltip title="Entrance not on street level">
                            <DoorFront color="error" />
                        </Tooltip>
                    }
                    {sc.assembly_possible ?
                        <Tooltip title="Assembly possible">
                            <Plumbing color="success" />
                        </Tooltip>:
                        <Tooltip title="Assembly not possible">
                            <Plumbing color="error" />
                        </Tooltip>
                    }
                    {sc.screedcheck_completed ?
                        <Tooltip title="Screedcheck completed">
                            <AssignmentTurnedIn color="success" />
                        </Tooltip>:
                        <Tooltip title="Screedcheck incomplete">
                            <AssignmentLate color="error" />
                        </Tooltip>
                    }
                </Stack>
                <TableContainer component={Box}>
                    <Table sx={{ minWidth: 150 }} size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell>Distance to closest parkingspot</TableCell>
                                <TableCell>{sc.distance_to_parking_space} m</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Floor cover</TableCell>
                                <TableCell>{sc.floor_cover_removed === true ? 'removed' : 'not removed'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Manifold origin</TableCell>
                                <TableCell>{sc.manifold_from}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Heating Generator</TableCell>
                                <TableCell>{sc.heating_generator}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Recommended Spacing</TableCell>
                                <TableCell>{sc.recommended_spacing} mm</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Further checks necessary</TableCell>
                                <TableCell>{sc.further_checks_necessary === true ? <Check color="error" size="inherit"/> : <DoNotDisturb color="success" size="inherit"/>}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Created</TableCell>
                                <TableCell>{moment(sc.createdAt).format('YYYY-MM-DD hh:mm')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Last update</TableCell>
                                <TableCell>{moment(sc.updatedAt).format('YYYY-MM-DD hh:mm')}</TableCell>
                            </TableRow>
                            {sc.deletedAt ? <TableRow>
                                <TableCell>Deleted</TableCell>
                                <TableCell>{moment(sc.deletedAt).format('YYYY-MM-DD hh:mm')}</TableCell>
                            </TableRow>: ''}
                            <TableRow>
                                <TableCell>Preferred assembly date</TableCell>
                                <TableCell> {moment(sc.preferred_assembly_date).format('YYYY-MM-DD ')}</TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h5" component="h4" sx={{ marginTop: 2}}>Notes:</Typography>
                {sc.notes ? <Typography variant="body2">{sc.notes}</Typography> : <Typography variant="subtitle1">No notes saved</Typography>}

            </CardContent>
        </Card>
    );
}

ScreedcheckDetailCard.propTypes = {
    screedcheckDetail: PropTypes.object.isRequired
}

export default ScreedcheckDetailCard;