import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {DataGrid, GridActionsCellItem, GridToolbar} from "@mui/x-data-grid";
import http from "../../http";
import {Add, Edit, Visibility} from "@mui/icons-material";
import {Button, Card, Grid, Typography} from "@mui/material";
import moment from "moment";
import AssemblyTable from "../../components/assembly/AssemblyTable";

function AssemblyList() {
    const [assemblies, setAssemblies] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [selectedAssemblies, setSelectedAssemblies] = useState([]);

    useEffect(() => {
        const readAllAssemblies = async () => {
            const response = await http.get("api/assembly/withProjectCustomer");
            setAssemblies(response.data.assemblyHead);
        };
        return readAllAssemblies
    }, [])

    return (
        <Grid container sx={{marginTop: 5}}>
            <Grid item xs={12} sx={{paddingX: 3}}>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography variant="h2" component="h1" gutterBottom>Assemblies</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{textAlign: 'right'}}>
                        <Button variant="outlined" color="success" startIcon={<Add/>}>New Assembly</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <AssemblyTable assemblies={assemblies}/>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AssemblyList;