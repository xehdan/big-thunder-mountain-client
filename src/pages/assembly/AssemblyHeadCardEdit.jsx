import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControlLabel,
    FormGroup,
    TextField
} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DatePicker} from "@mui/x-date-pickers";
import http from "../../http";

AssemblyHeadCardEdit.propTypes = {
    assemblyDate: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    assembly: PropTypes.object.isRequired,
    setAssembly: PropTypes.func.isRequired
};

function AssemblyHeadCardEdit(props) {
    const [assemblyDate, setAssemblyDate] = useState(moment(props.assemblyDate))
    const customInputRef = useRef();
    const [idiotenCheck, setIdiotenCheck] = useState(false);
    const assembly = props.assembly

    const handleChange = (event) => {
        setIdiotenCheck(event.target.checked);
    };

    const processAssemblyDateUpdate = async () => {
        await http.patch(`/api/assembly/${assembly.id}`, {
            "assembly_date": assemblyDate
        })
            .then((response) => {
                if (response.status === 200) {
                    props.setAssembly(prevState => ({
                        ...prevState,
                        assembly_date: assemblyDate,
                        updatedAt: new Date()
                    }));
                    props.onClose()
                } else {
                    window.alert(`An error occured. Check console`)
                    console.error(response)
                }
            })
            .catch((e) => {
                window.alert(`An error occured. Check console \n ${e}`)
                console.error(e)
            })
    };


    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Edit assembly date</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Changing the assembly date requires the consultant to check assembly schedules first and change only in accordance with customers.
                </DialogContentText>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={idiotenCheck} onChange={handleChange}/>} label="I know what I'm doing" />
                </FormGroup>
               <LocalizationProvider dateAdapter={AdapterMoment}>
                   <DatePicker
                       id="assemblyDate"
                       label="Assembly Date"
                       disabled={!idiotenCheck}
                       required
                       openTo="day"
                       views={['year', 'month', 'day']}
                       value={assemblyDate}
                       slotProps={{ textField: { fullWidth: true, variant: 'standard', margin: 'dense' } }}
                       onChange={(newValue) => {
                           setAssemblyDate(newValue);
                       }}
                   />
               </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button disabled={!idiotenCheck} onClick={processAssemblyDateUpdate}>Update</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AssemblyHeadCardEdit;