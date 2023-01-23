import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Container,
    FormControlLabel,
    FormGroup,
    Switch, Autocomplete, Box, TextField, Typography
} from "@mui/material";
import http from "../../../http";

Settings.propTypes = {

};

function Settings(props) {
    const [system, setSystem] = useState([])

    const [setting, setSetting] = useState({
        notification: true,
        create_screedcheck: true,
        create_assembly: false,
        create_reminder: false,
        system: "swift"
    });

    const handleSettingsChange = (e) => {
        const value = e.target.checked

        let fieldName
        if (e.target.id) {
            fieldName = e.target.id
        } else if (e.target.name) {
            fieldName = e.target.name
        }
        setSetting(existingValues => ({
            ...existingValues,
            [fieldName]: value
        }))
    }


    useEffect( () => {
        const readAllCustomers = async () => {
            const response = await http.get("api/system");
            setSystem(response.data.systems)
        };
        return readAllCustomers
    }, [])


    return (
        <Container>
            <Typography variant="h3" component="h2">Step 3</Typography>
            <Typography variant="subtitle1" gutterBottom>You can modify settings here about notifications, further processings and other options.</Typography>
            <Container maxWidth="md" sx={{marginY: 5}}>
            <FormGroup>
                <FormControlLabel control={<Switch
                    defaultChecked
                    checked={setting.notification}
                    name="notification"
                    onChange={handleSettingsChange}
                /> } label="Send Customer confirmation for project creation"/>
                <FormControlLabel control={<Switch
                    defaultChecked
                    checked={setting.create_screedcheck}
                    name="create_screedcheck"
                    onChange={handleSettingsChange}
                /> } label="Create default Screedcheck"/>
                <FormControlLabel control={<Switch
                    checked={setting.create_assembly}
                    name="create_assembly"
                    onChange={handleSettingsChange}
                /> } label="Create Assembly"/>
                <FormControlLabel control={<Switch
                    checked={setting.create_reminder}
                    name="create_reminder"
                    onChange={handleSettingsChange}
                /> } label="Set reminder in 2 Weeks"/>

                <Autocomplete
                    value={setting.system}
                    isOptionEqualToValue={(option, value) => option.system_name === value}
                    onChange={(e, newValue) => {
                        setSetting(existingValues => ({
                            ...existingValues,
                            ['system']: newValue.system_name
                        }))
                    }}
                    id="system"
                    sx={{ width: '100%' }}
                    options={system}
                    autoHighlight
                    //getOptionLabel={(option) => option.system_name}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            <img
                                loading="lazy"
                                width="40"
                                src={`http://localhost:3000/${option.logo_path}`}
                                //srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                alt={option.system_name}
                            />
                            {option.system_name}
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="Choose a System"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                        />
                )}
                />
            </FormGroup>
            </Container>
        </Container>
    );
}

export default Settings;