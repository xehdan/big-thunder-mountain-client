import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Button,
    CalendarNav,
    CalendarToday,
    Eventcalendar,
    localeDe, Popup,
    Draggable,
    toast
} from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import http from "../../http";
import moment from "moment";
import './Scheduler.css'
import {
    CalendarMonth, CalendarTodayOutlined, CalendarViewWeek, Close, List,
} from "@mui/icons-material";
import {ToggleButtonGroup, ToggleButton, Stack} from "@mui/material";

const now = new Date();

const ThCalendar = () => {

    const [assemblies, setAssemblies] = useState([]);
    const [view, setView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calView, setCalView] = useState({
        calendar: {
            labels: true
        }
    });
    // eslint-disable-next-line no-unused-vars
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isOpen, setOpen] = useState(false);
    const [anchor, setAnchor] = useState(null);
    const [draggableMeeting, setDraggableMeeting] = useState();
    const [draggableRetreat, setDraggableRetreat] = useState();
    const [draggableBlank, setDraggableBlank] = useState();
    const [planningMode, setPlanningMode] = useState(false);
    const [tooltipInfo, setTooltipInfo] = useState({})

    const activatePlanningMode = (event, newPlanningMode) => {
        if (newPlanningMode === true) {
            setPlanningMode(true)
        }
        if (newPlanningMode === false) {
            setPlanningMode(false)
        }
    }

    useEffect(() => {
        const readAllAssemblies = async () => {
            const response = await http.get("api/assembly");
            const newAssemblies = [];

            for (const value of response.data.assemblyHead) {
                let end = moment(value.assembly_date);
                if (value.estimated_duration > 1) {
                    end = end.add(value.estimated_duration - 1, 'd')
                }

                const project = await http.get(`api/project/deliverycontact/${value.projectId}`)
                //console.log(project.data)
                const customer = await http.get(`api/project/customerByProject/${value.projectId}`)

                let name;
                if (customer.data.customer.company) {
                    name = customer.data.customer.company
                } else {
                    name = `${customer.data.customer.firstName} ${customer.data.customer.lastName}`
                }

                newAssemblies.push({
                    start: moment(value.assembly_date).format('YYYY-MM-DD'),
                    end: end.format('YYYY-MM-DD') || '',
                    title: `${name} // P${value.projectId} // L${project.data.deliveryAddress.zipcode} ${project.data.deliveryAddress.city} `,
                    color: '#ccffcc',
                    projectId: value.projectId,
                    space: 50,
                    screedtype: 'Cement',
                    additionalTasks: [
                        {
                            type: 'Screedclosing'
                        }
                    ],
                    id: value.id
                })
            }
            setAssemblies(newAssemblies)
        }
        return readAllAssemblies

    }, []);

    const changeView = (event, viewType) => {
        let calendarView;
        switch (viewType) {
            case 'year':
                calendarView = {
                    calendar: {
                        labels: true,
                        type: 'year'
                    }
                };
                break;
            case 'month':
                calendarView = {
                    calendar: {
                        labels: true,
                        type: 'month'
                    }
                };
                break;
            case 'week':
                calendarView = {
                    calendar: {
                        label: true,
                        type: 'week',
                        size: 1
                    }
                };
                break;
            default:
                calendarView = {
                    calendar: {
                        labels: true,
                        type: 'month'
                    }
                };
                break;
        }
        setView(viewType);
        setCalView(calendarView);
    }
    const onSelectedDateChange = useCallback((event) => {
        setCurrentDate(event.date);
    }, [setCurrentDate]);
    const getFirstDayOfWeek = useCallback((d, prev) => {
        const day = d.getDay();
        const diff = d.getDate() - day + (prev ? -7 : 7);
        return new Date(d.setDate(diff));
    }, []);
    const navigatePage = useCallback((prev) => {
        if (view === 'calendar') {
            const prevNextPage = new Date(currentDate.getFullYear(), currentDate.getMonth() + (prev ? -1 : 1), 1);
            setCurrentDate(prevNextPage);
        } else {
            const prevNextSunday = getFirstDayOfWeek(currentDate, prev);
            setCurrentDate(prevNextSunday);
        }
    }, [view, currentDate, setCurrentDate, getFirstDayOfWeek]);
    const customWithNavButtons = () => {
        return <>
            <CalendarNav className="md-custom-header-nav"/>
            <div className="md-custom-header-controls">
                <Button onClick={() => navigatePage(true)} icon="material-arrow-back" variant="flat"
                        className="md-custom-header-button"></Button>
                <CalendarToday className="md-custom-header-today"/>
                <Button onClick={() => navigatePage(false)} icon="material-arrow-forward" variant="flat"
                        className="md-custom-header-button"></Button>
            </div>
            <div className="md-custom-header-view">
                <Stack direction="row" spacing={4}>
                {/*<SegmentedGroup value={view} onChange={changeView}>
                    <SegmentedItem value="year" icon={<CalendarTodayOutlined/>}/>
                    <SegmentedItem value="month" icon={<CalendarMonth/>}/>
                    <SegmentedItem value="week" icon={<CalendarViewWeek/>}/>
                </SegmentedGroup>*/}
                <ToggleButtonGroup value={view} exclusive onChange={changeView}>
                    <ToggleButton value={'year'}><CalendarTodayOutlined/></ToggleButton>
                    <ToggleButton value={'month'}><CalendarMonth/></ToggleButton>
                    <ToggleButton value={'week'}><CalendarViewWeek/></ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup
                    value={planningMode}
                    exclusive
                    onChange={activatePlanningMode}
                >
                    <ToggleButton value={false}><Close/></ToggleButton>
                    <ToggleButton value={true}><List/></ToggleButton>


                </ToggleButtonGroup>
                </Stack>

            </div>
        </>;
    }

    const timerRef = useRef(null);

    const blockoutDates = [
        {
            recurring: {
                repeat: 'weekly',
                weekDays: 'SA,SU'
            }
        }
    ]

    const onEventHoverIn = useCallback(async (args) => {
        const event = args.event;
        const response = await http.get(`api/assembly/${event.id}?detail=true`)
        setCurrentEvent(response.data.assembly);
        setTooltipInfo(response.data.assembly);
        console.log(response.data.assembly)

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setAnchor(args.domEvent.target);
        setOpen(true)
    }, []);
    const onEventHoverOut = useCallback(() => {
        timerRef.current = setTimeout(() => {
            setOpen(false);
        }, 200);
    }, [])
    const onEventClick = useCallback(() => {
        setOpen(true);
    }, []);
    const onMouseEnter = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);
    const onMouseLeave = useCallback(() => {
        timerRef.current = setTimeout(() => {
            setOpen(false);
        }, 200);
    }, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onEventCreate = useCallback((event) => {
        toast({
            message: 'Event dropped'
        })
    })
    const setMeetingElm = useCallback((elm) => {
        setDraggableMeeting(elm);
    }, [])
    const setRetreatElm = useCallback((elm) => {
        setDraggableRetreat(elm);
    }, [])
    const setBlankElm = useCallback((elm) => {
        setDraggableBlank(elm);
    }, [])
    const meetingData = {
        title: 'QA meeting',
        color: '#cf4343',
        start: now,
        end: now,
    }
    const retreatData = {
        title: 'Team retreat',
        color: '#1064b0',
        start: now,
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2)
    }


    return (
        <div className="mbsc-grid mbsc-no-padding" style={{width: '100%'}}>
            <div className="mbsc-row">
                <div className={`${planningMode ? "mbsc-col-sm-9 external-drop-calendar" : "mbsc-col-sm-12"} `}
                     style={{height: '94.5vh'}}>
                    <Eventcalendar
                        onSelectedDateChange={onSelectedDateChange}
                        locale={localeDe}
                        selectedDate={currentDate}
                        renderHeader={customWithNavButtons}
                        invalid={blockoutDates}
                        view={calView}
                        data={assemblies}
                        cssClass="md-custom-header"
                        showEventTooltip={false}
                        onEventHoverIn={onEventHoverIn}
                        onEventHoverOut={onEventHoverOut}
                        onEventClick={onEventClick}
                        onEventCreate={onEventCreate}
                        externalDrop={true}
                        dragToMove={true}
                    />
                    <Popup
                        display="anchored"
                        isOpen={isOpen}
                        anchor={anchor}
                        touchUi={false}
                        showOverlay={false}
                        contentPadding={false}
                        closeOnOverlayClick={false}
                        width={400}
                        cssClass="md-tooltip"
                    >
                        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                            <div className="md-tooltip-header" style={{backgroundColor: '#7a7a7a'}}>
                                <span className="md-tooltip-name-age">info</span>
                                <span className="md-tooltip-time">status</span>
                            </div>
                            <div className="md-tooltip-info">
                                <div className="md-tooltip-title">
                                    Status: <span className="md-tooltip-status md-tooltip-text">status</span>
                                    <Button variant="outline" className="md-tooltip-status-button" onClick={() => {
                                    }}>Go To Assembly</Button>
                                </div>
                                <div className="md-tooltip-title">Location <span
                                    className="md-tooltip-reason md-tooltip-text">12345 Muster</span></div>
                                <div className="md-tooltip-title">Floortype: <span
                                    className="md-tooltip-location md-tooltip-text">Cement</span></div>
                                <div className="md-tooltip-title">Space: <span
                                    className="md-tooltip-location md-tooltip-text">{tooltipInfo.space} m2</span></div>
                                <div className="md-tooltip-title">Additional Tasks: <span
                                    className="md-tooltip-location md-tooltip-text">true</span></div>
                                <Button color="secondary" className="md-tooltip-view-button" onClick={() => {
                                }}>Go to Project</Button>
                                <Button color="danger" variant="outline" className="md-tooltip-delete-button"
                                        onClick={() => {
                                        }}>Move to standby</Button>
                            </div>
                        </div>
                    </Popup>
                </div>
                {planningMode ? <>
                    <div className="mbsc-col-sm-3">
                        <div className="mbsc-form-group-title">Unassigned Tasks</div>
                        <div ref={setMeetingElm} className="external-drop-task" style={{background: '#cf4343'}}>
                            <div>Product team meeting</div>
                            <div>1.5 h</div>
                            <Draggable dragData={meetingData} element={draggableMeeting}/>
                        </div>

                        <div ref={setRetreatElm} className="external-drop-task" style={{background: '#1064b0'}}>
                            <div>General orientation</div>
                            <div>2 h</div>
                            <Draggable dragData={retreatData} element={draggableRetreat}/>
                        </div>

                        <div ref={setBlankElm} className="external-drop-task external-drop-task-blank">
                            <div>Blank event</div>
                            <Draggable element={draggableBlank}/>
                        </div>
                        <div className="mbsc-form-group-title">Standby Tasks</div>
                    </div>
                </> : <></>}
            </div>
        </div>
    );
};

export default ThCalendar;