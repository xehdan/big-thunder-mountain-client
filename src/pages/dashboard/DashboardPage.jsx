import React, {useContext, useState} from 'react';
import {Grid, Typography} from "@mui/material";
import BiCard from "../../components/dashboard/bi/BiCard";
import TaskGrid from "../../components/tasks/TaskGrid";
import UpcomingAssemblies from "../../components/assembly/UpcomingAssemblies";
import {UserContext} from "../../context/UserContext";

function DashboardPage(props) {
    const [preview, setPreview] = useState(14)
    const biGridSize = 3
    const user = useContext(UserContext)

    return (
        <Grid container sx={{marginTop: 5}}>
            <Grid item xs={12} spacing={2} sx={{paddingX: 3}}>
                <Typography gutterBottom variant='h1' component="h1">Good Morning {user.nickname}</Typography>
            </Grid>
            <Grid item xs={12} lg={8} spacing={2} sx={{paddingX: 3}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h2" component="h1">
                            Analysis this month
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={biGridSize}>
                        <BiCard title="Projects" to="project" previousMonthTotal={29} thisMonth={22} totalMonth={25}/>
                    </Grid>
                    <Grid item xs={12} sm={biGridSize}>
                        <BiCard title="Screedchecks" to="screedchecks" previousMonthTotal={91} thisMonth={22}
                                totalMonth={80}/>
                    </Grid>
                    <Grid item xs={12} sm={biGridSize}>
                        <BiCard title="Assemblies" to="assemblies" previousMonthTotal={20} thisMonth={12}
                                totalMonth={25}/>
                    </Grid>
                    <Grid item xs={12} sm={biGridSize}>
                        <BiCard title="Squaremeters" unit="sqm" previousMonthTotal={997} thisMonth={800}
                                totalMonth={1130}/>
                    </Grid>
                    <Grid item xs={12} sm={biGridSize}>
                        <BiCard title="Customers" to="customers" previousMonthTotal={8} thisMonth={15} totalMonth={15}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} lg={4} spacing={2} sx={{paddingX: 3}}>
                <Grid item xs={12}>
                    <Typography variant="h2" component="h1">
                        My Tasks
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TaskGrid taskOwner={user.userName}/>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{paddingX: 3}}>
                <Grid item xs={12}>
                    <Typography variant="h2" component="h1">Upcoming Assemblies</Typography>
                    <Typography variant="subtitle" component="p">in the next {preview} days</Typography>
                </Grid>
                <Grid item xs={12}>
                    <UpcomingAssemblies timespan={preview} />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default DashboardPage;