import React from 'react';
import {Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader} from "@mui/material";
import {AccountTree, Biotech, CalendarMonth, ContactPage, Dashboard, Hotel, Mail, Plumbing, Task} from "@mui/icons-material";

function SidebarContainer(props) {
    return (
        <Box sx={{ display: 'flex', height: '100vh', float: 'left'}}>
            <nav aria-label="General Management Tools">
                <List>
                    <ListSubheader>
                        General
                    </ListSubheader>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <Dashboard/>
                            </ListItemIcon>
                            <ListItemText primary="Dashboard"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <Task/>
                            </ListItemIcon>
                            <ListItemText primary="Tasks"/>
                        </ListItemButton>
                    </ListItem>
                    <ListSubheader>
                        Management
                    </ListSubheader>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <AccountTree/>
                            </ListItemIcon>
                            <ListItemText primary="Projects"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <Plumbing/>
                            </ListItemIcon>
                            <ListItemText primary="Assemblies"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <Biotech/>
                            </ListItemIcon>
                            <ListItemText primary="Screedchecks"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <ContactPage/>
                            </ListItemIcon>
                            <ListItemText primary="Customers"/>
                        </ListItemButton>
                    </ListItem>
                    <ListSubheader>
                        Tools
                    </ListSubheader>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <CalendarMonth/>
                            </ListItemIcon>
                            <ListItemText primary="Calendar"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <Mail/>
                            </ListItemIcon>
                            <ListItemText primary="Mailer"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <Hotel/>
                            </ListItemIcon>
                            <ListItemText primary="Booking"/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </nav>
        </Box>
    );
}

export default SidebarContainer;