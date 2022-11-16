import React, {useEffect, useState} from 'react';
import ComplaintTable from "../../components/complaint/ComplaintTable";
import http from "../../http";
import {Button, Card, Grid, Typography} from "@mui/material";
import {Add} from "@mui/icons-material";

function ComplaintList(props) {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const readAllComplaints = async () => {
            const response = await http.get(`api/complaint`);
            setComplaints(response.data.complaint);
        };
        return readAllComplaints
    }, [props])

    return (
        <Grid container sx={{marginTop: 5}}>
            <Grid item xs={12} spacing={2} sx={{paddingX: 3}}>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography variant="h2" component="h1" gutterBottom>Complaints</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{textAlign: 'right'}}>
                        <Button variant="outlined" color="success" startIcon={<Add/>}>New Complaint</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <ComplaintTable complaints={complaints}/>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ComplaintList;