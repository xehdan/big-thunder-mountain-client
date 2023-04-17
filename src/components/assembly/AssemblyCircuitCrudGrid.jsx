import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import http from "../../http";
import {Avatar, Stack, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import moment from "moment";
import {Bathtub, Bed, BedroomBaby, HelpCenter, Kitchen, Weekend, Work} from "@mui/icons-material";

AssemblyCircuitCrudGrid.propTypes = {
    assemblyId: PropTypes.number.isRequired,
    manifolds: PropTypes.array,
    floors: PropTypes.array
};

function AssemblyCircuitCrudGrid(props) {
    const [assemblyId, setAssemblyId] = useState(props.assemblyId);
    const [circuits, setCircuits] = useState({})
    const [manifolds, setManifolds] = useState(props.manifolds)
    const [floors, setFloors] = useState(props.floors)

    useEffect(() => {
        const readAllCircuits = async () => {
            await http.get(`/api/assembly/circuitsByAssembly/${assemblyId}`)
                .then((response) => {
                    setCircuits(response.data.circuit)
                })
                .catch((response) => console.error(response))


        };
        return readAllCircuits

    }, [assemblyId])

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


    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50,
            editable: false
        },
        {
            field: 'avatar',
            headerName: '',
            width: 50,
            renderCell: (params) => getAvatar(params.row.room)
        },
        {
            field: 'room',
            headerName: 'Room',
            width: 200,
        },
        {
            field: 'length_of_pipe',
            headerName: 'Pipe length',
            width: 100,
            type: 'number',
            editable: true
        },
        {
            field: 'manifold',
            headerName: 'Manifold',
            width: 200,
            type: 'singleSelect',
            editable: true,
            valueGetter: (params) => params.row.AssemblyManifold.id,
            getOptionValue: (value) => value.id,
            getOptionLabel: (value) => `M...${value.transactionId.substring(value.transactionId.length - 5)}`,
            valueOptions: ({row}) => {
                const options = []
                manifolds.map((element) => options.push(element))
                return options
            }, //[{id: 1, name: 'Manifold 1'}, {id: 2, name: 'Manifold 2'}],
        },
        {
            field: 'floor',
            headerName: 'Floor',
            width: 120,
            type: 'singleSelect',
            editable: true,
            valueGetter: (params) => params.row.AssemblyManifold.AssemblyFloor.id,
            getOptionValue: (value) => value.id,
            getOptionLabel: (value) => value.floor_level,
            valueOptions: ({row}) => {
                const options = []
                floors.map((element) => options.push(element))
                return options
            }
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            width: 180,
            editable: false,
            valueGetter: (params) => moment(params.row.createdAt).format('lll')
        },
        {
            field: 'updatedAt',
            headerName: 'Updated',
            width: 180,
            editable: false,
            valueGetter: (params) => moment(params.row.updatedAt).format('lll')
        },
    ]

    return (
        <>
           {/* <Stack>
            {manifolds.map((element, index) => <Typography key={index}>{element.transactionId}</Typography>) }
            </Stack>*/}
           <DataGrid
                sx={{
                    height: 500,
                }}
                rows={circuits}
                columns={columns}
                editMode="row"
            />
        </>
    );
}

export default AssemblyCircuitCrudGrid;