import React from 'react';
import PropTypes from 'prop-types';
import {Box, CircularProgress, Typography} from "@mui/material";

const CircularProgressWithLabel = props => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                size={90}
                variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography component="div" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
};

CircularProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired
};

export default CircularProgressWithLabel;