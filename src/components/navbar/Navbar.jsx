import React, {useContext, useEffect, useState} from 'react';
import {styled, alpha} from '@mui/material/styles';
import {AppBar, Toolbar, IconButton, Typography, Box, InputBase, Badge, CircularProgress} from "@mui/material";
import {AccountCircle, Mail, Menu, More, Notifications, Search as SearchIcon} from "@mui/icons-material";
import './navbar.css';
import {UserContext} from "../../context/UserContext";
import {useNavigate} from "react-router-dom";
import http from "../../http";

const pjson = require('../../../package.json')


function Navbar(props) {
    const navigate = useNavigate()
    const user = useContext(UserContext)
    const [userTasks, setUserTasks] = useState(0);
    const [isLoading, setLoading] = useState(false)

    const readTasks = async () => {
        setLoading(true)
        const response = await http.get(`api/task/owner/count/${user.username}`);
        setUserTasks(response.data.count)
        setLoading(false)
    }

    useEffect(() => {
        return readTasks
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        const interval = setInterval(async () => {

            await readTasks()

        }, 10000);
        return () => clearInterval(interval);
    })


    // eslint-disable-next-line no-unused-vars
    const [anchorEl, setAnchorEl] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

    const Search = styled('div')(({theme}) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        minWidth: '850px',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({theme}) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({theme}) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            color: '#6b6b6b',
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '20ch',
            },
        },
    }));

    const menuId = 'primary-search-account-menu';
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    // eslint-disable-next-line no-unused-vars
    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const mobileMenuId = 'primary-search-account-menu-mobile';

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="menu"

                        sx={{mr: 2}}
                    >
                        <Menu sx={{color: '#ffffff'}}/>
                    </IconButton>
                    <img src={require('../../assets/ICON_white.svg').default} alt="thermisto Icon"
                         style={{maxHeight: '50px'}}/>
                    <Typography sx={{color: '#ffffff'}} variant="h6" component="div">
                        {pjson.name}
                    </Typography>
                    <Box sx={{flexGrow: 1}}/>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon sx={{color: '#ffffff'}}/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{'aria-label': 'search'}}
                        />
                    </Search>
                    <Box sx={{flexGrow: 1}}/>
                    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <Mail sx={{color: '#ffffff'}}/>
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label={`show ${userTasks} new notifications`}
                            color="inherit"
                            onClick={() => navigate('/task')}
                        >
                            {isLoading ?
                                <Badge badgeContent={<CircularProgress size="12px" sx={{ color: '#ffffff'}} />} color="info">
                                    <Notifications sx={{color: '#ffffff'}}/>
                                </Badge>
                                : <>
                            {userTasks > 0 ?
                                <Badge badgeContent={userTasks} color="error" max={99}>
                                    <Notifications sx={{color: '#ffffff'}}/>
                                </Badge>
                                :
                                <Notifications sx={{color: '#ffffff'}}/>
                            }</>}


                    </IconButton>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle sx={{color: '#ffffff'}}/>
                    </IconButton>
        </Box>
    <Box sx={{display: {xs: 'flex', md: 'none'}}}>
        <IconButton
            size="large"
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
        >
            <More sx={{color: '#ffffff'}}/>
        </IconButton>
    </Box>
</Toolbar>
</AppBar>
</Box>
)
    ;
}

export default Navbar;