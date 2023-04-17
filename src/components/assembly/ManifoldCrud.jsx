import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    IconButton, Stack,
    Tooltip,
    Typography
} from "@mui/material";
import moment from "moment/moment";
import {
    Add,
    Bathtub,
    Bed,
    BedroomBaby, Check,
    CheckCircle,
    HelpCenter,
    HouseSiding,
    Kitchen,
    Weekend,
    Work,
    Error
} from "@mui/icons-material";
import http from "../../http";

ManifoldCrud.propTypes = {
    assemblyFloor: PropTypes.array.isRequired,
};

function ManifoldCrud(props) {
    const [assemblyFloor, setAssemblyFloor] = useState(props.assemblyFloor)
    const [newAssemblyManifold, setNewAssemblyManifold] = useState({})


    const addManifold = async (element) => {
        const defaultManifold = {
            has_control_unit: true,
            is_connected: true,
            assemblyFloorId: element.id,
            AssemblyCircuits: []
        }

        await http.post(`/api/assembly/manifold`, defaultManifold)
            .then((response) => {
                if (response.status === 201) {

                    const updatedData = assemblyFloor.map(obj => {
                        if (obj.id === element.id) {
                            obj.AssemblyManifolds = obj.AssemblyManifolds ? [...obj.AssemblyManifolds, response.data] : [response.data]
                        }
                        return obj;
                    });


                    setAssemblyFloor(updatedData)


                } else {
                    window.alert(`An error occured. Check console`)
                    console.error(response)
                }
            })
            .catch((e) => {
                window.alert(`An error occured. Check console \n ${e}`)
            })
    }


    function getAvatar(room) {
        function stringToColor(string) {
            let hash = 0;
            let i;

            /* eslint-disable no-bitwise */
            for (i = 0; i < string.length; i += 1) {
                hash = string.charCodeAt(i) + ((hash << 5) - hash);
            }

            let color = '#';

            for (i = 0; i < 3; i += 1) {
                const value = (hash >> (i * 8)) & 0xff;
                color += `00${value.toString(16)}`.slice(-2);
            }
            /* eslint-enable no-bitwise */

            return color;
        }

        if (room.toLowerCase().includes('child') || room.toLowerCase().includes('kids')) {
            return <Avatar sx={{bgcolor: stringToColor(room)}} variant="square"><BedroomBaby/></Avatar>
        } else if (room.toLowerCase().includes('kitchen')) {
            return <Avatar sx={{bgcolor: stringToColor(room)}} variant="square"><Kitchen/></Avatar>
        } else if (room.toLowerCase().includes('living')) {
            return <Avatar sx={{bgcolor: stringToColor(room)}} variant="square"><Weekend/></Avatar>
        } else if (room.toLowerCase().includes('bath')) {
            return <Avatar sx={{bgcolor: stringToColor(room)}} variant="square"><Bathtub/></Avatar>
        } else if (room.toLowerCase().includes('bed')) {
            return <Avatar sx={{bgcolor: stringToColor(room)}} variant="square"><Bed/></Avatar>
        } else if (room.toLowerCase().includes('office')) {
            return <Avatar sx={{bgcolor: stringToColor(room)}} variant="square"><Work/></Avatar>
        } else {
            return <Avatar variant="square"><HelpCenter/></Avatar>
        }
    }


    return (
        <Grid spacing={2} container>
            {assemblyFloor.map((element, index) => (
                <Grid item xs={12} key={index}>
                    <Card>
                        <CardHeader title={element.floor_level} subheader={element.transactionId} avatar={<Tooltip
                            title={`Created: ${moment(element.createdAt).format('lll')} /\n Updated: ${moment(element.updatedAt).format('lll')} `}><Avatar><HouseSiding/></Avatar></Tooltip>}/>
                        <CardContent>
                            <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom># of
                                manifolds: {element.AssemblyManifolds.length}</Typography>
                            <Grid container spacing={1}>
                                {element.AssemblyManifolds.map((manifold, index2) => (

                                    <Grid item xs={6} key={index2}>
                                        <Card>
                                            <CardHeader avatar={<Tooltip
                                                title={`Created: ${moment(manifold.createdAt).format('lll')} /\n Updated: ${moment(manifold.updatedAt).format('lll')} `}><Avatar>{index2 + 1}</Avatar></Tooltip>}
                                                        title={`${index2 + 1}. Manifold`}
                                                        subheader={manifold.transactionId}
                                                        action={<IconButton aria-label="Add Circuit">
                                                            <Add/>
                                                        </IconButton>}/>
                                            <CardContent>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={4}>
                                                        <Stack spacing={1} direction="row">
                                                            {manifold.AssemblyCircuits.length <= manifold.estimatedSizing ? <Check color="success" /> : <Error color="error" />}
                                                            {manifold.AssemblyCircuits && manifold.estimatedSizing ? <Typography color={manifold.AssemblyCircuits.length <= manifold.estimatedSizing ? null :  "error"}  gutterBottom>{manifold.AssemblyCircuits.length} of {manifold.estimatedSizing} Circuits set</Typography> : null }
                                                        </Stack>
                                                    </Grid>
                                                    {manifold.AssemblyCircuits ? manifold.AssemblyCircuits.map((circuit, index3) => (
                                                        <Grid item xs={1} key={index3}>
                                                            <Tooltip
                                                                title={
                                                                    <span
                                                                        style={{ whiteSpace: 'pre-line' }}>
                                                                            {
                                                                                `${circuit.room}
                                                                                ${circuit.length_of_pipe} m
                                                                                ${circuit.transactionId}
                                                                                Created: ${moment(circuit.createdAt).format('lll')}
                                                                                Updated: ${moment(circuit.updatedAt).format('lll')} `
                                                                            }

                                                                    </span>}>
                                                                {getAvatar(circuit.room)}
                                                            </Tooltip>
                                                        </Grid>
                                                    )): <Typography>no circuits yet</Typography>}
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Typography></Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => {addManifold(element)}}>Add Manifold</Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default ManifoldCrud;