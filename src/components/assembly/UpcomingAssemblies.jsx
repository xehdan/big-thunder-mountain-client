import React, {useEffect, useState} from 'react';
import http from "../../http";
import {DataGrid} from "@mui/x-data-grid";
import {Avatar, AvatarGroup, Box} from "@mui/material";

function UpcomingAssemblies(props) {
    const [upcomingAssemblies, setUpcomingAssemblies] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [timespan, setTimespan] = useState(props.timespan)


    useEffect(() => {
        const readUpcomingAssemblies = async () => {
            const response = await http.get(`api/assembly/withtimespan`, {
                params: {
                    timespan,
                    detail: "true"
                }
            });
            setUpcomingAssemblies(response.data.assemblyHead);
        };
        return readUpcomingAssemblies
    }, [timespan])

    function renderEmployees(params) {
        const emp = params.row.Employees
        const avatars = []
        // eslint-disable-next-line array-callback-return
        emp.map((emper, index) => {
            avatars.push(
                //<ThAvatar key={emper.id + '-' + params.row.id} title={emper.firstName + ' ' + emper.lastName} initials={emper.firstName.charAt(0) + emper.lastName.charAt(0)}/>
                <Avatar title={emper.firstName + ' ' + emper.lastName} key={emper.id + '-' + params.row.id}>{emper.firstName.charAt(0)}{emper.lastName.charAt(0)}</Avatar>
            )
        })
        return <AvatarGroup max={3}>{avatars}</AvatarGroup>
    }

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 20
        },
        {
            field: 'assembly_date',
            headerName: 'Assembly Date',
            width: 250
        },
        {
            field: 'space',
            headerName: 'Space',
            width: 100,
            valueGetter: ((params) => {return `${params.row.space} sqm`})
        },
        {
            field: 'completed',
            headerName: 'Completed',
            width: 100,
            type: 'boolean'
        },
        {
            field: 'employees',
            headerName: 'Employees',
            width: 140,
            renderCell: renderEmployees
        }
    ]

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                columns={columns}
                rows={upcomingAssemblies}
                rowsPerPageOptions={[10, 20, 30]}
                pageSize={10}
            />
        </Box>
    );
}

export default UpcomingAssemblies;