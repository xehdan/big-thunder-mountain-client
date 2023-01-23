import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import http from "../../http";
import {Card, CardContent, Grid} from "@mui/material";

const ScreedcheckPage = () => {
    let {id} = useParams();
    const [screedcheck, setScreedcheck] = useState([])
    const [customer, setCustomer] = useState([])

    useEffect(() => {
        const readScreedcheck = async () => {
            const response = await http.get(`/api/screedcheck/${id}`, {
                params: {
                    detail: "true"
                }
            });
            setScreedcheck(response.data.screedcheck)
        }
        return readScreedcheck
    }, [id])

    useEffect(() => {
        const readCustomer = async () => {
            const response = await http.get(`/api/customer/${id}`, {
                params: {
                    detail: "true"
                }
            });
            setCustomer(response.data.customer);
        };
        return readCustomer
    }, [id])

    return (
        <Grid container spacing={2} sx={{ margin: 3}}>
            <Grid item xl={3} xs={4}>
                <Card>
                    <CardContent>
                        {JSON.stringify(screedcheck)}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        {JSON.stringify(customer)}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ScreedcheckPage;