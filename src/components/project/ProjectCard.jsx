import React, {useEffect, useState} from 'react';
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import http from "../../http";
import moment from "moment";
import {useNavigate} from "react-router-dom";

const ProjectCard = (props) => {
    const [product, setProduct] = useState({});
    const navigate = useNavigate()

    useEffect(() => {
        const readProduct = async () => {
            const response = await http.get(`/api/system/${props.project.systemId}`);
            setProduct(response.data.system);
        };

        return readProduct
    }, [])

    return (
        <Card>
            <CardContent>
                <Typography sx={{ fontSize: 14}} color="text.secondary" gutterBottom>
                    {props.project.transactionId}
                </Typography>
                <Typography variant="h4" component="div">
                    <Grid container>
                        <Grid item xs={6}>
                            <img src={process.env.PUBLIC_URL + product.logo_path } alt={`System ${product.system_name}`} />
                        </Grid>
                        <Grid item xs={6}>

                        </Grid>

                    </Grid>
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary" title={moment(props.project.createdAt).format('DD MMMM YYYY, hh:mm')}>
                    Created {moment(props.project.createdAt).fromNow()}
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={() => navigate(`/project/${props.project.id}`)} size="small">See Project</Button>
            </CardActions>
        </Card>
    );
};

export default ProjectCard;