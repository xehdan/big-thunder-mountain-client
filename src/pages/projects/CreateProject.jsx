import React, {useState} from 'react';
import {
    Button,
    Card, CardActions,
    CardContent,
    Grid,
    Paper, Stack,
    Typography, useTheme
} from "@mui/material";
import {
    AddCircleOutline,
    ArrowRight,
} from "@mui/icons-material";
import ProjectWizardStepper from "../../components/project/ProjectWizardStepper";
import Customer from "./steps/Customer";
import Addresses from "./steps/Addresses";
import Settings from "./steps/Settings";

function ProjectCreate(props) {
    const theme = useTheme();
    const [processStep, setProcessStep] = useState(1);
    const [projectOrder, setProjectOrder] = useState({});


    function changeProcessStep(e) {
        setProcessStep(e)
    }

    return (
        <>
            <Paper
                square={true}
                elevation={0}
                style={{
                    width: '100%',
                    height: '20vh',
                    background: `${theme.palette.primary.main} linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 20%, ${theme.palette.primary.dark} 100%)`,
                }}
            >
                <Grid container sx={{paddingX: 10, marginTop: 3}}>
                    <Grid item xs={12} sx={{paddingY: 7}}>
                        <Typography variant="h2" component="h1"><AddCircleOutline fontSize="large"/> Project Wizard
                        </Typography>
                        <Typography variant="subtitle1">This wizard helps you create a new project. Please make sure to
                            fill all informations to make your life easier in the long run.</Typography>
                    </Grid>
                    <Card>
                        <Stack direction="row"
                               justifyContent="space-evenly"
                               alignItems="center"
                               spacing={2}
                               sx={{
                                   paddingX: 2,
                                   paddingY: 3,
                                   //background: '#f1f1f1',
                                   background: theme.palette.background.paper,
                                   borderBottom: `1px ${theme.palette.divider} solid`
                               }}>

                            <ProjectWizardStepper testFunction={() => changeProcessStep(1)} active={processStep === 1} number={1} title="Personal Details"
                                                  subtitle="Basic customer details"/>
                            <ProjectWizardStepper testFunction={() => changeProcessStep(2)} active={processStep === 2} number={2} title="Assembly & Invoice"
                                                  subtitle="Where to bill and assemble"/>
                            <ProjectWizardStepper testFunction={() => changeProcessStep(3)} active={processStep === 3} number={3} title="Project Settings"
                                                  subtitle="System settings and notifications"/>
                            <ProjectWizardStepper testFunction={() => changeProcessStep(4)} active={processStep === 4}
                                                   number={4} title="Summary" subtitle="Review and submit" />


                        </Stack>


                        <CardContent>
                            {processStep === 1 ?
                                <Customer/> : null
                            }

                            {processStep === 2 ?
                                <Addresses/>: null
                            }
                            {processStep === 3 ?
                                <Settings/> : null
                            }
                            {processStep === 4 ?
                                <Card>
                                    <CardContent>
                                        {JSON.stringify(projectOrder)}
                                    </CardContent>
                                </Card> : null
                            }


                        </CardContent>
                        <CardActions>
                            {processStep === 1 ?
                            <Grid container>
                                <Grid item xs={12} sx={{textAlign: 'right'}}>
                                    <Button onClick={() => {}}>Continue <ArrowRight/></Button>
                                </Grid>
                            </Grid> : null
                            }
                        </CardActions>
                    </Card>

                </Grid>
            </Paper>
            {/*<Container maxWidth="xl" style={{ top: '12rem', position: "relative "}}>
                <Container sx={{ marginY: 3}}>
                    <Typography variant="h1" component="h2">New project</Typography>
                    <Typography variant="body1">You are about to create a new project. Please make sure to fill all informations to make your life easier in the long run.</Typography>
                </Container>
                    <Card>
                        <CardContent>
                            <Stack direction="row"
                                   justifyContent="space-between"
                                   alignItems="center">
                                <Typography>Step 1</Typography>
                                <Typography>Step 2</Typography>
                                <Typography>Step 3</Typography>
                                <Typography>Step 4</Typography>
                            </Stack>
                        </CardContent>
                    </Card>
            </Container>*/
            }
        </>
    )
        ;
}

export default ProjectCreate;