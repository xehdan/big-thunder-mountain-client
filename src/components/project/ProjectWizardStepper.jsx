import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, Stack, Typography, useTheme} from "@mui/material";

ProjectWizardStepper.propTypes = {
    number: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
};

function ProjectWizardStepper(props) {
    const theme = useTheme();
    const {active, number, title, subtitle} = props


    return (
        <Stack
            onClick={(e) => props.testFunction(e)}
            direction="row"
            spacing={3}
            style={{
                cursor: 'pointer'
            }}
            sx={{
                paddingY: 5,
                paddingX: 6,
                background: active ? theme.palette.primary.main : '',
                borderRadius: 2
        }}>
            <Avatar variant="square"
                    sx={{
                        bgcolor: active ? 'white' : theme.palette.primary.main,
                        color: active ? theme.palette.primary.main : 'white',
                        width: 56,
                        height: 56
                }}>
                {number}
            </Avatar>
            <div>
                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        color: active ? 'white' : theme.palette.primary.main
                }}
                >
                    {title}
                </Typography>
                <Typography
                    sx={{
                        fontSize: 13,
                        color: theme.palette.secondary
                    }}
                >
                    {subtitle}
                </Typography>
            </div>
        </Stack>
    );
}

export default ProjectWizardStepper;