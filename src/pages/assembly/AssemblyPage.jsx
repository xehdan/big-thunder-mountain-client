import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import http from "../../http";

function AssemblyPage() {
    let {id} = useParams();
    const [customer, setCustomer] = useState({});
    const [project, setProject] = useState({});
    const [assembly, setAssembly] = useState({});

    useEffect(() => {
        //const readAssembly = async () => {
        const readAll = async () => {
            const responseAssembly = await http.get(`/api/assembly/${id}`, {
                params: {
                    detail: "true"
                }
            });
            setAssembly(responseAssembly.data.assembly)
            const projectId = responseAssembly.data.assembly.projectId

            const responseProject = await http.get(`/api/project/${projectId}`, {
                params: {
                    detail: "true"
                }
            });
            setProject(responseProject.data.project)

            const customerId = responseProject.data.project.customerId
            const responseCustomer = await http.get(`/api/customer/${customerId}`, {
                params: {
                    detail: true
                }
            });
            setCustomer(responseCustomer.data.customer)


        };
        //return readAssembly
        return readAll

    }, [id])



    return (
        <div>
            AssemblyPage for ID: {id}
            <h1>Assembly</h1>
            {JSON.stringify(assembly)}
            <h1>Project {project.id}</h1>
            {JSON.stringify(project)}
            <h1>Customer {customer.id}</h1>
            {JSON.stringify(customer)}
        </div>
    );
};

export default AssemblyPage;