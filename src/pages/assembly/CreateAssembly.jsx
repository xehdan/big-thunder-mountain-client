import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Grid,
    TextField,
    Typography,
    Button,
    FormControlLabel,
    FormGroup,
    Checkbox,
    Stack,
    Box,
    InputAdornment, Card, CardContent, Chip, Skeleton, FormControl
} from "@mui/material";
import http from "../../http";
import moment from "moment/moment";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";
import 'ckeditor5-custom-build/build/translations/de';

const AssemblyCreate = props => {
    const projectId = 5
    const [project, setProject] = useState({})
    const [loading, setLoading] = useState(true)

    const [assembly, setAssembly] = useState({})
    const [settings, setSettings] = useState({
        dateToStandby: true
    })


    useEffect(() => {
        const readProject = async () => {
            //setData([])

            const response = await http.get(`/api/project/${projectId}`, {
                params: {
                    detail: true,
                }
            });
            setProject(response.data.project);
            setLoading(false)
        }

        return readProject;
    }, [projectId]);

    const handleSettingsChange = (e) => {
        const value = e.target.checked

        let fieldName
        if (e.target.id) {
            fieldName = e.target.id
        } else if (e.target.name) {
            fieldName = e.target.name
        }
        setSettings(existingValues => ({
            ...existingValues,
            [fieldName]: value
        }))
    }
    const handleAssemblyChange = (e) => {
        const value = e.target.checked

        let fieldName
        if (e.target.id) {
            fieldName = e.target.id
        } else if (e.target.name) {
            fieldName = e.target.name
        }
        setAssembly(existingValues => ({
            ...existingValues,
            [fieldName]: value
        }))
    }

    return (
        <Grid container spacing={2} sx={{margin: 3}}>
            <Grid item xs={12}>

                <Typography variant="h1">Create Assembly</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardContent>
                        {loading ? <Skeleton variant="rectangular"/> :
                            <>
                                <Typography variant="h5" gutterBottom>Project details</Typography>
                                <Typography variant="body2">TransactionID: {project.transactionId}</Typography>
                                <Typography
                                    variant="body2">Created: {moment(project.createdAt).format('LLL')}</Typography>
                                <Typography variant="body2">Last
                                    Update: {moment(project.updatedAt).format('LLL')}</Typography>
                                {/*{project.Customer.company != null ?
                            <Typography variant="body2">Customer: {project.Customer.company}</Typography> : null}*/}
                                {project.Customer.firstName != null ?
                                    <Typography
                                        variant="body2">Customer: {project.Customer.firstName + ' ' + project.Customer.lastName}</Typography> : null}
                                <Typography variant="body2">Delivery
                                    Address: {project.customerDeliveryAddress.street + ' ' + project.customerDeliveryAddress.housenumber + ', ' + project.customerDeliveryAddress.zipcode + ' ' + project.customerDeliveryAddress.city + ', ' + project.customerDeliveryAddress.state + ' ' + project.customerDeliveryAddress.country}</Typography>
                            </>}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>Screedcheck details</Typography>
                        {loading ? <Skeleton variant="text"/> :
                            project.ScreedcheckHeads.map((sc, index) => (
                                    <Stack key={index} direction="row" spacing={1}>
                                        <Typography variant="body2">{index + 1}. Screedcheck by {sc.screedchecker} </Typography>
                                        {sc.datetime_of_screedcheck != null ? ' on ' +  <Typography variant="body2">moment(sc.datetime_of_screedcheck).format('LLL') </Typography>
                                            :
                                            <Chip size="small" label="not planned yet"/>}
                                    </Stack>))
                            }
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Stack spacing={2} >
                            <TextField
                                name="estimated_duration"
                                variant="standard"
                                label="Approx. Duration"
                                onChange={handleAssemblyChange}
                                value={assembly.estimated_duration}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">day/s</InputAdornment>,
                                }}
                            />
                            <FormGroup>
                                <FormControlLabel name="dateToStandby" onChange={handleSettingsChange}
                                                  value={settings.dateToStandby} control={<Checkbox defaultChecked/>}
                                                  label="Set Assembly to standy"/>
                            </FormGroup>
                            {settings.dateToStandby ? null : <TextField variant="standard" label="mechanic"/>}
                            <TextField
                                variant="standard"
                                type="number"
                                label="space"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">sqm</InputAdornment>
                                }}
                            />
                            <TextField variant="standard" type="number" label="Number of Floors"/>
                            <FormControl variant="standard">
                                <CKEditor
                                    editor={Editor}
                                    config={{
                                        language: 'de',
                                        height: '400px',
                                    }}
                                    onInit={(editor) => {
                                        // You can store the "editor" and use when it is needed.
                                        // console.log("Editor is ready to use!", editor);
                                        editor.editing.view.change((writer) => {
                                            writer.setStyle(
                                                "height",
                                                "600px",
                                                editor.editing.view.document.getRoot()
                                            );
                                        });
                                    }}
                                    data={assembly.note_for_assembly}
                                    onChange={ ( event, editor ) => {
                                        const data = editor.getData();
                                        setAssembly(existingValues => ({
                                            ...existingValues,
                                            ['note_for_assembly']: data
                                        }))
                                    } }
                                />
                            </FormControl>
                        </Stack>
                            <Button variant="contained" color="success">Create Assembly</Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

AssemblyCreate.propTypes = {};

export default AssemblyCreate;