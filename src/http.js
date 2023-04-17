import axios from "axios";


const PORT = process.env.PORT || 3001;
const HOST = process.env.REACT_APP_HOST || 'localhost';

const client = axios.create({
    baseURL: `http://${HOST}:${PORT}`,
    headers: {
        "Content-type": "application/json"
    }
})


export default client;