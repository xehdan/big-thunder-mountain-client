import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {DataGrid, GridActionsCellItem, GridRowModes, GridToolbarContainer} from "@mui/x-data-grid";
import {Box, Button} from "@mui/material";
import {Add, Cancel, Delete, Edit, Save} from "@mui/icons-material";
import moment from "moment";
import http from "../../http";
import AddFloorDialog from "./AddFloorDialog";

AssemblyFloorCrudGrid.propTypes = {
    assemblyFloor: PropTypes.array.isRequired,
    assemblyHeadId: PropTypes.number.isRequired
};

EditToolbar.propTypes = {
    //floorAdd: PropTypes.func.isRequired
    setRowModesModel: PropTypes.func.isRequired,
    setRows: PropTypes.func.isRequired,
    assemblyHeadId: PropTypes.number.isRequired
}


function EditToolbar(props) {
    const [openFloorAdd, setOpenFloorAdd] = useState(false);
    const {setRows, setRowModesModel} = props;


    const floorAdd = async (floor_level) => {
        //console.log(`Fire in the ${floor_level}`)
        await http.post(`/api/assembly/floor`, {
            "assemblyHeadId": props.assemblyHeadId,
            "floor_level": floor_level,
            "AssemblyManifolds": []
        })
            .then((response) => {
                if (response.status === 201) {
                    setRows((oldRows) => [...oldRows, response.data.floor])
                    setOpenFloorAdd(false)
                } else {
                    window.alert(`An error occured. Check console}`)
                    console.error(response)
                }
            })
            .catch((e) => {
                window.alert(`An error occured. Check console \n ${e}`)
            })
    }


    return (
        <>
            <AddFloorDialog open={openFloorAdd} handleClose={() => {
                setOpenFloorAdd(false)
            }} handlePost={floorAdd}/>
            <GridToolbarContainer>
                <Button color="primary" startIcon={<Add/>} onClick={() => {
                    setOpenFloorAdd(true)
                }}>
                    Add Floor
                </Button>
            </GridToolbarContainer>
        </>
    );
}

function AssemblyFloorCrudGrid(props) {
    const [rows, setRows] = useState(props.assemblyFloor);
    const [rowModesModel, setRowModesModel] = useState({});
    const [rowFloorModesModel, setRowFloorModesModel] = useState({});
    const assemblyHeadId = props.assemblyHeadId

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
    };

    const handleSaveClick = (row) => () => {
        setRowModesModel({...rowModesModel, [row.id]: {mode: GridRowModes.View}});
    };

    const handleDeleteClick = (params) => async () => {
        await http.delete(`/api/assembly/floor/${params.transactionId}`,)
            .then((response) => {
                if (response.status === 204) {
                    setRows(rows.filter((row) => row.id !== params.id));
                } else {
                    console.error(response)
                }
            })
            .catch((e) => {
                window.alert(`An error occured. Check console \n ${e}`)
            })
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow) => {
        const updatedRow = {...newRow, updatedAt: new Date()};
        await http.patch(`/api/assembly/floor/${updatedRow.transactionId}`, {
            "floor_level": updatedRow.floor_level
        })
            .then((response) => {
                if (response.status === 200) {
                } else {
                    window.alert(`An error occured. Check console}`)
                    console.error(response)
                }
            })
            .catch((e) => {
                window.alert(`An error occured. Check console \n ${e}`)
                console.error(e)
            })
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns =
        [
            {field: 'id', headerName: 'ID', width: 50, editable: false},
            {field: 'transactionId', headerName: 'Transactions ID', width: 300, editable: false},
            {
                field: 'floor_level',
                headerName: 'Floor Level',
                width: 150,
                editable: true
            },
            {
                field: 'AssemblyManifolds',
                headerName: 'Manifolds',
                type: 'number',
                width: 150,
                valueGetter: (params) => {
                    const count = params.row.AssemblyManifolds.length
                    return count
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
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                width: 100,
                editable: false,
                cellClassName: 'actions',
                getActions: (params) => {
                    const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;

                    if (isInEditMode) {
                        return [
                            <GridActionsCellItem
                                icon={<Save/>}
                                label="Save"
                                onClick={handleSaveClick(params.row)}
                            />,
                            <GridActionsCellItem
                                icon={<Cancel/>}
                                label="Cancel"
                                className="textPrimary"
                                onClick={handleCancelClick(params.row.id)}
                                color="inherit"
                            />,
                        ];
                    }

                    return [
                        <GridActionsCellItem
                            icon={<Edit/>}
                            label="Edit"
                            className="textPrimary"
                            onClick={handleEditClick(params.row.id)}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            icon={<Delete/>}
                            label="Delete"
                            onClick={handleDeleteClick(params.row)}
                            color="inherit"
                        />,
                    ];
                },
            },
        ];


    return (
        <DataGrid
            sx={{
                height: 500,
            }}
            /*experimentalFeatures={{newEditingApi: true}}*/
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => console.error(error)}
            slots={{
                toolbar: EditToolbar,
            }}
            slotProps={{
                toolbar: {setRows, setRowModesModel, assemblyHeadId},
            }}
        />
    );
}

export default AssemblyFloorCrudGrid;