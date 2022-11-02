import React from 'react';
import {AppBar, Toolbar, IconButton, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import './navbar.css';
import { ReactComponent as ReactLogo} from '../../assets/ICON_white.svg'
const pjson = require('../../../package.json')

function Navbar(props) {

    return (
        <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => {}}
                    edge="start"
                    sx={{
                        marginRight: 5,
                    }}
                >
                    <Menu />
                </IconButton>
                <ReactLogo style={{ maxHeight: '50px'}}/>
                <Typography variant="h6" noWrap component="div" color={'white'}>

                    {pjson.name}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;