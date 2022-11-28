import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import http from "../../http";
import {Card, CardContent, Grid, Chip, Button, CardActions, Stack} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import {Approval, CalendarMonthSharp, DoDisturb, HourglassBottom, Print} from "@mui/icons-material";
import {PDFDownloadLink} from "@react-pdf/renderer";
import ComplaintProtocol from "../../components/pdfGen/ComplaintProtocol";


function ComplaintPage(props) {
    let {id} = useParams();
    const navigate = useNavigate()

    const [complaint, setComplaint] = useState({})
    const [complaintPosition, setComplaintPosition] = useState([])


    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 200
        },
        {
            field: 'complaintTasks',
            headerName: 'Complaint Tasks',
            width: 250
        },
        {
            field: 'authorized',
            headerName: 'Authorized',
            width: 100,
            type: 'boolean'
        },
        {
            field: 'discount',
            headerName: 'Discount',
            width: 150,
            type: 'boolean'
        },
        {
            field: 'expenses',
            headerName: 'Expenses',
            width: 100,
            type: 'number'
        },
        {
            field: 'complaintOpinion',
            headerName: 'Complaint Opinion',
            width: 200,
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 200
        },
        {
            field: 'updatedAt',
            headerName: 'Updated At',
            width: 200
        }
    ]

    useEffect(() => {
        const readComplaint = async () => {
            const response1 = await http.get(`api/complaint/${id}`, {
                params: {
                    "detail": true
                }
            });
            setComplaint(response1.data.complaint);
            setComplaintPosition(response1.data.complaint.ComplaintPositions)
        };
        return readComplaint
    }, [id, props])

    const LinkBehavior = React.forwardRef((props, ref) => (
        <PDFDownloadLink
            document={
            <ComplaintProtocol
                title="test"
                author="tbf"
                subject="tbf"
                keywords="tbf"
                creator="test"

            />}
            fileName="somename.pdf"
            ref={ref}
            to="/"
            {...props}
            role={undefined}
        />
    ));



    return (
        <Grid container spacing={2} sx={{margin: 3}}>
            <Grid item xs={12} lg={4}>
                <Card>
                    <CardContent>
                        <h1>Complaint ID: {id}</h1>
                        <p>Transaction ID: {complaint.transactionId}</p>
                        <div>Status: <Chip label={complaint.status} /></div>
                        <p>Completed: {complaint.completed ? 'yes' : 'no' } </p>
                        <p>Created At:  {complaint.createdAt}</p>
                        <p>Last Update:  {complaint.updatedAt}</p>
                         </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} lg={3}>
                <Card>
                    <CardContent>
                        <h2>Address</h2>
                        <p>Lorem Ipsum</p>
                        <p>Lorem Ipsum</p>
                        <p>Lorem Ipsum</p>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} lg={3}>
                <Card>
                    <CardContent>
                        <h2>Project ID: {complaint.projectId}</h2>
                        <p>Created At:  {complaint.createdAt}</p>
                        <p>Last Update:  {complaint.updatedAt}</p>
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => navigate(`/project/${complaint.projectId}`)}>Go To Project</Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} lg={2}>
                <Card>
                    <CardContent>
                    <Stack spacing={2} sx={{ marginTop: 2, marginBottom: 2}}>
                        <Button label="Approve" startIcon={<Approval/>} color="success" variant="contained">Approve</Button>
                        <Button label="Standy" startIcon={<HourglassBottom/>} color="warning" variant="contained">Standby</Button>
                        <Button label="Decline" startIcon={<DoDisturb/>} color="error" variant="contained">Decline</Button>
                    </Stack>
                    <Stack spacing={2}>
                        <Button component={LinkBehavior} startIcon={<Print/>}>Protocol</Button>
                        <Button label="Set to review" startIcon={<CalendarMonthSharp/>}>Set Review</Button>
                    </Stack>
                    </CardContent>

                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card>
                    <DataGrid sx={{height: 400, width: '100%'}} columns={columns} rows={complaintPosition}/>
                </Card>
            </Grid>
        </Grid>
    );
}

export default ComplaintPage;