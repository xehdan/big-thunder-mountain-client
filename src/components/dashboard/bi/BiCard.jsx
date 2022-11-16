import React from 'react';
import {Button, Card, CardActions, CardContent, LinearProgress, Link, Typography} from '@mui/material'
import {useNavigate} from "react-router-dom";

function BiCard(props) {
    const {title, thisMonth, totalMonth, previousMonthTotal, to} = props
    const completed = Math.round(((thisMonth/totalMonth) * 100) );
    const navigate = useNavigate()

    function getColor() {
        if (completed <= 33){
            return 'error'
        } else if (completed > 33 && completed <= 66) {
            return 'warning'
        } else if (completed > 66) {
            return 'success'
        } else {
            return 'secondary'
        }
    }


    function getDifferenceToPreviousMonth() {
        let result = totalMonth - previousMonthTotal;
        if (result <0) {
            return `${result * -1} less than last month`
        } else if (result > 0) {
            return `${result} more than last month`
        } else if (result === 0) {
            return `same than last month`
        } else {
            return 'no comparison possible';
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography sx={{ fontSize: 14}} color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h5" component="div">
                    {thisMonth}/{totalMonth} {props.unit ? props.unit : ''}
                </Typography>
                <LinearProgress color={getColor()} variant="determinate" value={ completed }/>
                <Typography variant="body2">
                    {getDifferenceToPreviousMonth()}
                </Typography>
            </CardContent>
            { to ? <>
                <CardActions>
                    <Button onClick={() => navigate(`/${to}`)} size="small">Check {title}</Button>
                </CardActions>
            </> : ''}

        </Card>
    );
}

export default BiCard;