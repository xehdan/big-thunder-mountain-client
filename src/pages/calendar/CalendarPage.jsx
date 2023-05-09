import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {
    CalendarNav,
    CalendarPrev,
    CalendarToday,
    CalendarNext,
    Eventcalendar,
    getJson,
    localeDe,
    Input, Popup, formatDate, Button
} from '@mobiscroll/react'; /* or import any other component */
import './style.scss'
import useMediaQuery from "@mui/material/useMediaQuery";
import http from "../../http";
import moment from "moment";
import {Avatar, AvatarGroup, CircularProgress, Tooltip} from "@mui/material";
import {Link} from "react-router-dom";
import {GridActionsCellItem} from "@mui/x-data-grid";
import {Visibility} from "@mui/icons-material";

CalendarPage.propTypes = {};

function CalendarPage(props) {
    const [myEvents, setEvents] = useState([]);
    const [listEvents, setListEvents] = useState([])
    const [mySelectedEvent, setSelectedEvent] = useState([]);
    const [isOpen, setOpen] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchInput, setSearchInput] = useState(null);
    const inputRef = useRef();
    const timerRef = useRef(null);

    const [isInfoboxOpen, setInfoboxOpen] = useState(false);
    const [anchor, setAnchor] = useState(null);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [info, setInfo] = useState('')
    const [time, setTime] = useState('')
    const [status, setStatus] = useState('')
    const [reason, setReason] = useState('')
    const [location, setLocation] = useState('')
    const [buttonText, setButtonText] = useState('')
    const [buttonType, setButtonType] = useState('')
    const [bgColor, setBgColor] = useState('')

   /* useEffect(() => {
        const readAllAddresses = async () => {
            const response = await http.get(`api/assembly/`);
            setEvents(response.data.assemblyHead)
            //setLoading(false)
        };
        return readAllAddresses


        /!*getJson('https://trial.mobiscroll.com/events/?vers=5', (events) => {
            setEvents(events);
        }, 'jsonp');*!/
    }, []);*/

    const listView = useMemo(() => {
        return {
            agenda: {
                type: 'year',
                size: 5
            }
        };
    }, []);

    const view = useMemo(() => {
        return {
            calendar: {
                labels: true,
                weekNumbers: true,
            }
        };
    }, []);

    const blockoutDates = [
        {
            recurring: {
                repeat: 'weekly',
                weekDays: 'SA,SU'
            }
        }
    ]

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark');

    const onPageLoading = useCallback((event, inst) => {
        const start = event.firstDay.toISOString();
        const end = event.lastDay.toISOString();

        //console.log(`Fetching Dates from ${fromDay} till ${toDay}`)
        setTimeout(async () => {
            setEvents([])
            const response = await http.get(`api/assembly/range?detail=true&startedDate=${start}&endDate=${end}`)
            //const response = await http.get(`api/assembly?detail=true`)
            const heads = response.data.assemblyHead
            heads.map((el, index) => setEvents((prevState) => [
            ...prevState,
                {
                    id: el.id,
                    transactionId: el.transactionId,
                    title: `AS${el.id} | ${el.space} sqm | ${el.Project.customerDeliveryAddress.zipcode} ${el.Project.customerDeliveryAddress.city}`,
                    space: el.space,
                    start: el.assembly_date,
                    end: moment(el.assembly_date).add(el.estimated_duration - 1, 'd').toISOString(),
                    duration: el.estimated_duration,
                    completed: el.completed,
                    controlChecks: el.AssemblyControlChecks,
                    additionalTasks: el.AssemblyAdditionalAssemblyTasks,
                    employees: el.Employees,
                    assemblyFloors: el.AssemblyFloors,
                    project: el.Project
                }
        ]))
        });

    }, [])

    const popupInit = useCallback(() => {
        setSearchInput(inputRef.current.nativeElement)
    }, [])

    const popupClose = useCallback(() => {
        setOpen(false);
    }, [])

    const eventClick = useCallback((args) => {
        setCurrentDate(args.event.start);
        setSelectedEvent([args.event]);
        setOpen(false);
    }, []);

    const onSearch = useCallback((ev) => {
        const text = ev.target.value;

        //console.log(text)

        /* if(timerRef.current) {
             clearTimeout(timerRef.current);
         }*/

        timerRef.current = setTimeout(() => {
            if (text.length > 0) {
                getJson('https://trial.mobiscroll.com/searchevents/?text=' + text, (data) => {
                    setListEvents(data);
                    setOpen(true);
                }, 'jsonp');
            } else {
                setOpen(false);
            }
        }, 200);
    }, []);

    const onFocus = React.useCallback((ev) => {
        if (ev.target.value.length > 0) {
            setOpen(true)
        }
    }, []);

    const onEventHoverIn = useCallback((args) => {
        const event = args.event;

        setCurrentEvent(event);
        console.log(event)

        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }

        setAnchor(args.domEvent.target);
        setInfoboxOpen(true)
    }, [])

    const onEventHoverOut = useCallback(() => {
        timerRef.current =setTimeout(() => { setInfoboxOpen(false); }, 200);
    }, [])

    const onEventClick = useCallback(() => {
        setInfoboxOpen(true)
    })

    const onMouseEnter = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
    }, [])

    const onMouseLeave = useCallback(() => {
        timerRef.current = setTimeout(() => {
            setInfoboxOpen(false);
        }, 200)
    }, [])


    const myHeader = () => {
        return <React.Fragment>
            <CalendarNav/>
            <div className="md-search-header-bar mbsc-flex-1-0">
                <Input startIcon="material-search" ref={inputRef} onChange={onSearch} onFocus={onFocus} inputStyle="box"
                       placeholder="Search events"/>
            </div>
            <CalendarPrev/>
            <CalendarToday/>
            <CalendarNext/>
        </React.Fragment>;
    }

    return (
        <div style={{height: '94.5vh', width: '100%'}}>
            <Eventcalendar
                className="md-search-events"
                locale={localeDe}
                themeVariant={prefersDarkMode ? 'dark' : 'light'}
                invalid={blockoutDates}
                showEventTooltip={false}
                onEventHoverIn={onEventHoverIn}
                onEventHoverOut={onEventHoverOut}
                onEventClick={onEventClick}
                clickToCreate={false}
                dragToCreate={false}
                dragToMove={false}
                dragToResize={false}
                eventDelete={false}
                selectedDate={currentDate}
                selectMultipleEvents={true}
                data={myEvents}
                onPageLoading={onPageLoading}
                view={view}
                renderHeader={myHeader}
            />
            {currentEvent ?  <Popup
                display="anchored"
                isOpen={isInfoboxOpen}
                anchor={anchor}
                touchUi={false}
                showOverlay={false}
                contentPadding={false}
                closeOnOverlayClick={false}
                width={350}
                cssClass="md-tooltip"
            >
                <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    <div className="md-tooltip-header" style={{backgroundColor: '#f7a700'}}>
                        <span className="md-tooltip-name-age">{currentEvent.project.Customer.firstName ? currentEvent.project.Customer.firstName : null } {currentEvent.project.Customer.lastName ? currentEvent.project.Customer.lastName : null} { currentEvent.project.Customer.company ? currentEvent.project.Customer.company : null }</span>
                        <span className="md-tooltip-time">
                            <AvatarGroup max={4}>
                            {currentEvent.employees.length > 0 ? currentEvent.employees.map((element, index) => (
                                <Tooltip title={element.firstName + ' ' + element.lastName} className="mui-tooltip">
                                    <Avatar key={index} alt={element.firstName + ' ' + element.lastName} sx={{width: 24, height: 24, fontSize: '0.8rem'}}>{element.firstName.substring(0,1)}{element.lastName.substring(0,1)}</Avatar>
                                </Tooltip>
                            )) : <Avatar sx={{width: 24, height: 24, fontSize: '0.8rem'}}>?</Avatar> }
                </AvatarGroup>
                        </span>
                    </div>
                    {/*JSON.stringify(currentEvent)*/}
                    <div className="md-tooltip-info">
                        <div className="md-tooltip-title">
                            Assembly: <span className="md-tooltip-status md-tooltip-text">{currentEvent.transactionId.substring(currentEvent.transactionId.length - 30)}</span>
                           {/* <Link to={`/assembly/${currentEvent.id}`}>
                                <Button color={buttonType} variant="outline" className="md-tooltip-status-button">Assembly</Button>
                            </Link>*/}

                        </div>
                        <div className="md-tooltip-title">Floors: {currentEvent.assemblyFloors.length > 0 ? currentEvent.assemblyFloors.map((element, index) => ( <span key={index} className="md-tooltip-reason md-tooltip-text"> {element.floor_level}{currentEvent.assemblyFloors.length-1 > index  ? ", " : null}</span>
                        )) : <span className="md-tooltip-reason md-tooltip-text">undefined</span>}
                       </div>
                        <div className="md-tooltip-title">Location: <span
                            className="md-tooltip-location md-tooltip-text">{currentEvent.project.customerDeliveryAddress.street} {currentEvent.project.customerDeliveryAddress.housenumber}, {currentEvent.project.customerDeliveryAddress.zipcode} {currentEvent.project.customerDeliveryAddress.city}</span></div>
                       <Link to={`/assembly/${currentEvent.id}`}><Button color="secondary" className="md-tooltip-view-button">view assembly</Button></Link>
                        {/* <Button color="danger" variant="outline" className="md-tooltip-delete-button" onClick={() => {
                        }}>Delete appointment</Button>*/}
                    </div>
                </div>
            </Popup> : null}
            <Popup
                className="md-search-popup"
                display="anchored"
                showArrow={false}
                showOverlay={false}
                scrollLock={false}
                contentPadding={false}
                focusOnOpen={false}
                focusOnClose={false}
                anchor={searchInput}
                focusElm={searchInput}
                isOpen={isOpen}
                onInit={popupInit}
                onClose={popupClose}
            >
                <Eventcalendar
                    className="mbsc-popover-list"
                    view={listView}
                    data={listEvents}
                    showControls={false}
                    onEventClick={eventClick}
                />
            </Popup>
        </div>
    );
}

export default CalendarPage;