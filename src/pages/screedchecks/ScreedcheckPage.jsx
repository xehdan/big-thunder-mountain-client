import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import http from "../../http";
import {Button, Card, CardContent, Grid} from "@mui/material";
import {PDFDownloadLink} from "@react-pdf/renderer";
import ComplaintProtocol from "../../components/pdfGen/ComplaintProtocol";
import {Print} from "@mui/icons-material";
import screedcheckProtocol from "../../components/pdfGen/ScreedcheckProtocol";
import {UserContext} from "../../context/UserContext";
import ScreedcheckProtocol from "../../components/pdfGen/ScreedcheckProtocol";
import {Skeleton} from "@mui/lab";
import pjson from "../../../package.json";

const ScreedcheckPage = () => {
    let {id} = useParams();
    const [screedcheck, setScreedcheck] = useState([])
    const [customer, setCustomer] = useState([])
    const user = useContext(UserContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const readScreedcheck = async () => {
            setLoading(true)
            await http.get(`/api/screedcheck/${id}`, {
                params: {
                    detail: "true"
                }
            })
                .then((response) => {
                    setScreedcheck(response.data.screedcheck)
                    const customerId = response.data.screedcheck.Project.customerId
                    http.get(`/api/customer/${customerId}`, {
                        params: {
                            detail: "true"
                        }
                    })
                        .then((response2) => {
                            setCustomer(response2.data.customer);
                        })
                        .then(() => {
                            setLoading(false)
                        })
                })


        }
        return readScreedcheck
    }, [id])


    const LinkBehavior = React.forwardRef((props, ref) => (
        <PDFDownloadLink
            document={
                <ScreedcheckProtocol
                    title={`Screedcheck Checklist - ${customer.lastName ? customer.lastName + ', ' + customer.firstName : ''} ${customer.company ? customer.company : ''}`}
                    author={user.firstName + ' ' + user.lastName}
                    subject={`Screedcheck `}
                    keywords="tbf"
                    creator={`${pjson.name}-${pjson.version}`}
                    screedcheck={screedcheck}

                />}
            fileName={`${screedcheck.transactionId.slice(-12)} - Screedcheck`}
            ref={ref}
            to="/"
            {...props}
            role={undefined}
        />
    ));


    return (
        <Grid container spacing={2} sx={{margin: 3}}>
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

            <Grid item xl={3} xs={12}>
                <Card>
                    <CardContent>
                        {loading ? <Skeleton/> : <Button startIcon={<Print/>} component={LinkBehavior} variant="outlined">
                            Print Protocol
                        </Button> }
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ScreedcheckPage;