import React, {useEffect, useState} from 'react';
import ComplaintTable from "../../components/complaint/ComplaintTable";
import http from "../../http";

function ComplaintList(props) {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const readAllComplaints = async () => {
            const response = await http.get(`api/complaint`);
            setComplaints(response.data.complaint);
        };
        return readAllComplaints
    }, [props])

    return (
        <div>
            <ComplaintTable complaints={complaints}/>
        </div>
    );
}

export default ComplaintList;