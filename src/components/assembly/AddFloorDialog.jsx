import React, {useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, IconButton, InputAdornment,
    Stack,
    TextField, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import PropTypes from "prop-types";

const AddFloorDialog = props => {
    const [selectedFloor, setSelectedFloor] = useState(null)
    const [numberOfFloor, setNumberOfFloor] = useState(null)
    const [tempFloor, setTempFloor] = useState(null);

    const handleFloor = (event, newAlignment) => {
        if (newAlignment === "Upperfloor") {
            setTempFloor("Upperfloor")
            setSelectedFloor("Upperfloor")
        } else {
            setSelectedFloor(newAlignment);
        }
    };

    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogTitle>Add Floor</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select which floor to add
                    </DialogContentText>
                        <ToggleButtonGroup
                            orientation="vertical"
                            value={selectedFloor}
                            exclusive
                            onChange={handleFloor}
                            aria-label="Select Floor to add"
                        >
                            <ToggleButton value="Topfloor" variant="outlined" sx={{paddingX: 2}} >
                                <img style={{maxWidth: 523}} src={require('../../assets/Floorselect_01.png')}
                                     alt="Topfloor"/>
                            </ToggleButton>
                            <ToggleButton value="Upperfloor" variant="outlined" sx={{paddingX: 2}}>
                                <img style={{maxWidth: 523}} src={require('../../assets/Floorselect_03.png')}
                                     alt="Upperfloor"/>
                            </ToggleButton>
                            <ToggleButton value="Groundfloor" variant="outlined" sx={{paddingX: 2}}>
                                <img style={{maxWidth: 523}} src={require('../../assets/Floorselect_04.png')}
                                     alt="Groundfloor"/>
                            </ToggleButton>
                            <ToggleButton value="Basement" variant="outlined" sx={{paddingX: 2}}>
                                <img style={{maxWidth: 523}}
                                     src={require('../../assets/Floorselect_05.png')} alt="Basement"/>
                            </ToggleButton>
                        </ToggleButtonGroup>

                    {tempFloor === "Upperfloor" ?
                        <TextField
                            sx={{ width: 200 }}
                            type="number"
                            variant={"standard"}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">.Floor</InputAdornment>
                            }}
                            onChange={(event) => {
                                setSelectedFloor(`${event.target.value}. Floor`);
                            }}
                            value={numberOfFloor}
                        />: null }

                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Cancel</Button>
                    <Button onClick={() => props.handlePost(selectedFloor)} disabled={selectedFloor === null || selectedFloor === ""}>Add {selectedFloor}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

AddFloorDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handlePost: PropTypes.func.isRequired
};

export default AddFloorDialog;