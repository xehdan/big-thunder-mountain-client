import React, {useState} from 'react';
import {
    Drawer,
    Toolbar,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemButton,
    ListItemText,
    Divider,
    ListSubheader
} from '@mui/material';
import {
    AccountTree,
    Biotech,
    CalendarMonth,
    ContactPage,
    Dashboard,
    Hotel,
    Mail,
    Plumbing,
    Task
} from '@mui/icons-material'
import {Link} from "@mui/material";
import {Link as RouterLink, useLocation} from 'react-router-dom'


function Sidebar() {
    const drawerWidth = 240;
    const location = useLocation()
    const menuItems = [
        {
            headline: 'General',
            items: [{
                name: 'Dashboard',
                icon: <Dashboard color="primary"/>,
                to: '/'
            }, {
                name: 'Task',
                icon: <Task color="primary"/>,
                to: '/task'
            }]
        }, {
            headline: 'Management',
            items: [{
                name: 'Projects',
                icon: <AccountTree color="primary"/>,
                to: '/projects'
            }, {
                name: 'Assemblies',
                icon: <Plumbing color="primary"/>,
                to: '/assemblies'
            }, {
                name: 'Screedchecks',
                icon: <Biotech color="primary"/>,
                to: '/screedchecks'
            }, {
                name: 'Customers',
                icon: <ContactPage color="primary"/>,
                to: '/customers'
            },]
        },
        {
            headline: 'Tools',
            items: [{
                name: 'Calendar',
                icon: <CalendarMonth color="primary"/>,
                to: '/calendar'
            }, {
                name: 'Mailer',
                icon: <Mail color="primary"/>,
                to: '/mailer'
            }, {
                name: 'Booking',
                icon: <Hotel color="primary"/>,
                to: '/booking'
            }]
        }

    ]

    const [activeElement, setActiveElement] = useState();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'},
            }}
        >
            <Toolbar/>
            <Box sx={{overflow: 'auto'}}>
                <List>
                    {menuItems.map((menuItem, index) => (
                        <>
                            <ListSubheader key={menuItem.headline}>
                                {menuItem.headline}
                            </ListSubheader>
                            {menuItem.items.map((item, index2) => (
                                <ListItem selected={(item.to.substring(0,4) === location.pathname.substring(0,4)) ? true : false } disablePadding key={`${item.name}-${index2}`}>
                                    <Link component={RouterLink} key={`${item}-${index2}`} to={item.to} underline="none"
                                          sx={{width: '100%'}}>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={item.name}/>
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            ))}
                            <Divider/>
                        </>
                    ))}

                </List>


            </Box>
        </Drawer>
    );
}

export default Sidebar;