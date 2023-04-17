import React, {useState} from 'react';
import PropTypes from "prop-types";
import {Card, CardContent, Grid, Stack, Tooltip, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import moment from "moment";
import {AspectRatio, HeatPump, Tune} from "@mui/icons-material";

function AssemblyRooms(props) {
    const flo = props.floors;

    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        id: false,
        deletedAt: false,
        transactionId: false,
        createdAt: false,
        updatedAt: false
    });

    const columnsCircuit = [
        {
            field: 'id',
            headerName: 'ID',
            type: 'number',
            width: 50
        }, {
            field: 'transactionId',
            headerName: 'Transaction ID',
            width: 80
        }, {
            field: 'room',
            headerName: 'Room',
            width: 225
        }, {
            field: 'length_of_pipe',
            headerName: 'Pipelenght',
            type: 'number',
            width: 100,
            valueGetter: params => {
                return `${params.row.length_of_pipe} m`
            }
        }, {
            field: 'createdAt',
            headerName: 'Created',
            width: 195,
            valueGetter: params => {
                return moment(params.row.createdAt).format('LLL')
            }
        }, {
            field: 'updatedAt',
            headerName: 'Last Update',
            width: 195,
            valueGetter: params => {
                return moment(params.row.updatedAt).format('LLL')
            }
        }, {
            field: 'deletedAt',
            headerName: 'Deleted',
            width: 195,
            valueGetter: (params) => {
                if (params.row.deletedAt != null) {
                    return moment(params.row.deletedAt).format('LLL')
                } else {
                    return ''
                }
            }
        }
    ]

    return (
        flo.map((floor, index) => (
            <div key={index}>
                <Tooltip
                    title={`Created: ${moment(floor.createdAt).format('LLL')} -- Last Updated: ${moment(floor.updatedAt).format('LLL')}`}>
                    <Typography sx={{fontSize: 14}} color="text.secondary"
                                gutterBottom> {floor.transactionId}</Typography>
                </Tooltip>
                <Typography variant="h4" sx={{ marginBottom: 1}}>Floor: {floor.floor_level}</Typography>
                {floor.AssemblyManifolds.length > 0 ?
                <Grid container spacing={2} sx={{marginBottom: 3}}>
                    {floor.AssemblyManifolds.map((manifold, index) => (
                        <Grid key={index} item xs={12} xl={4}>
                            <Card>
                                <CardContent>
                                    <Tooltip
                                        title={`Created: ${moment(manifold.createdAt).format('LLL')} -- Last Updated: ${moment(manifold.updatedAt).format('LLL')}`}>
                                        <Typography sx={{fontSize: 14}} color="text.secondary"
                                                    gutterBottom> {manifold.transactionId}</Typography>
                                    </Tooltip>
                                    <Grid container sx={{marginBottom: 2}}>
                                        <Grid item xs={6}>
                                            <Typography
                                                variant="h5">{index + 1}. Manifold</Typography>
                                            <Typography>{manifold.AssemblyCircuits.length} Circuits</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Stack direction="row" justifyContent="end" sx={{padding: 2}}
                                                   spacing={3}>
                                                {manifold.has_control_unit ?
                                                    <Tooltip title='Manifold has control unit'>
                                                        <Tune color="success"/>
                                                    </Tooltip> :
                                                    <Tooltip title="Manifold has no control unit">
                                                        <Tune color="error"/>
                                                    </Tooltip>
                                                }
                                                {manifold.is_connected ?
                                                    <Tooltip title='Manifold is connected to heatinggenerator'>
                                                        <HeatPump color="success"/>
                                                    </Tooltip> :
                                                    <Tooltip title='Manifold is not connected to heatinggenerator'>
                                                        <HeatPump color="error"/>
                                                    </Tooltip>
                                                }
                                            </Stack>

                                        </Grid>

                                    </Grid>

                                    {manifold.deletedAt ? <Typography>Deleted
                                        At: {moment(manifold.deletedAt).format('lll')}</Typography> : ''}
                                    <DataGrid
                                        sx={{height: 300, width: '100%'}}
                                        density="compact"
                                        columns={columnsCircuit}
                                        rows={manifold.AssemblyCircuits}
                                        pageSize={props.pageSize}
                                        rowsPerPageOptions={[5]}
                                        disableSelectionOnClick
                                        columnVisibilityModel={columnVisibilityModel}
                                        onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                                        /*componentsProps={{
                                            toolbar: {
                                                showQuickFilter: true,
                                                quickFilterProps: {debounceMs: 500},
                                            },
                                        }}
                                        components={{
                                            Toolbar: GridToolbar,
                                        }}*/
                                    />
                                </CardContent>
                            </Card>

                        </Grid>
                    ))}
                </Grid> : <Typography variant="body2">No manifolds set yet</Typography>}
            </div>
        )))
}

AssemblyRooms.propTypes = {
    floors: PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired
}

export default AssemblyRooms;