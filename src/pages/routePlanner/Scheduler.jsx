import React, {useCallback, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import http from "../../http";
import {Skeleton, Stack, Tooltip, Typography} from "@mui/material";
import {Eventcalendar, localeDe} from "@mobiscroll/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import {MbscResource} from "@mobiscroll/react";
import {Biotech, Plumbing, Traffic, WorkspacePremium} from "@mui/icons-material";
import moment from "moment/moment";

Scheduler.propTypes = {
    selectedDate: PropTypes.isRequired,
    onSelectedDateChange: PropTypes.func.isRequired,
};

function Scheduler(props) {
    const [loading, setLoading] = useState(true)
    const [employees, setEmployees] = useState([])
    const [myEvents, setEvents] = useState([])

    const blockoutDates = [
        {
            recurring: {
                repeat: 'weekly',
                weekDays: 'SA,SU'
            }
        }
    ]
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark');
    const view = useMemo(() => {
        return {
            timeline: {
                type: 'week',
                resolutionHorizontal: 'day',
                currentTimeIndicator: true,
                weekNumbers: true
            }
        };
    }, []);

    const myCustomResourceTemplate = (resource: MbscResource) => {
        return (
            <div>
                <Typography>{resource.firstName} {resource.lastName} {getFlagEmoji(resource.nationality)}</Typography>
                <Stack direction="row" spacing={1}>
                    {resource.canDriveCar ? <Tooltip title="Can drive car"><Traffic /></Tooltip> : null}
                    {resource.isAllowedToDrill ? <Tooltip title="Can drill"><WorkspacePremium/></Tooltip> : null}
                    {resource.isAllowedToAssembly ? <Tooltip title="Can do assembly"><Plumbing/></Tooltip> : null}
                    {resource.isAllowedToDoScreedcheck ? <Tooltip title="Can do screedcheck"><Biotech/></Tooltip> : null}
                    {resource.canSpeakGerman ? <Tooltip title="Speaks german"><Typography>{getFlagEmoji('DE')}</Typography></Tooltip> : null}
                    {resource.canSpeakEnglish ? <Tooltip title="Speaks english"><Typography>{getFlagEmoji('GB')}</Typography></Tooltip> : null }
                </Stack>
            </div>)
    }

    function getFlagEmoji(countryCode) {
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char =>  127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    const onPageLoading = useCallback((event, inst) => {
        const start = event.firstDay.toISOString();
        const end = event.lastDay.toISOString();

        //console.log(`Fetching Dates from ${fromDay} till ${toDay}`)
        setTimeout(async () => {
            setEvents([])
            const response = await http.get(`api/assembly/range?detail=true&startedDate=${start}&endDate=${end}`)
            const heads = response.data.assemblyHead
            heads.map((el, index) => {
                let employ = []
                el.Employees.map((element) => (
                    employ.push(element.id)
                ))
                setEvents((prevState) => [
                    ...prevState,
                    {
                        id: el.id,
                        transactionId: el.transactionId,
                        title: `AS${el.id} | ${el.space} sqm | ${el.Project.customerDeliveryAddress.zipcode} ${el.Project.customerDeliveryAddress.city}`,
                        space: el.space,
                        start: el.assembly_date,
                        end: moment(el.assembly_date).add(el.estimated_duration, 'd').toISOString(),
                        duration: el.estimated_duration,
                        completed: el.completed,
                        controlChecks: el.AssemblyControlChecks,
                        additionalTasks: el.AssemblyAdditionalAssemblyTasks,
                        resource: employ,
                        employees: el.Employees,
                        assemblyFloors: el.AssemblyFloors,
                        project: el.Project
                    }
            ])})

        });

    }, [])

    useEffect(() => {
        const readAllEmployees = async () => {
            const response = await http.get(`api/employee`);
            setEmployees(response.data.employees)

            setLoading(false)
        };
        return readAllEmployees
    }, [])

    return (
        <div>
            { loading ? <Skeleton variant="rectangular" height={450}/> :

                <Eventcalendar
                    themeVariant={prefersDarkMode ? 'dark' : 'light'}
                    locale={localeDe}
                    invalid={blockoutDates}
                    view={view}
                    data={myEvents}
                    selectedDate={props.selectedDate}
                    onSelectedDateChange={props.onSelectedDateChange}
                    renderResource={myCustomResourceTemplate}
                    onPageLoading={onPageLoading}
                    resources={employees}
                    clickToCreate={false}
                    dragToCreate={false}
                    dragToMove={false}
                    dragToResize={false}
                    eventDelete={false}
                />

            }
        </div>
    );
}

export default Scheduler;