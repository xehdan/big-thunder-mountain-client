import axios from "axios";

const client = axios.create({
    //baseURL: "http://localhost:3001",
    baseURL: "http://192.168.51.118:3001",
    headers: {
        "Content-type": "application/json"
    }
})


export default client;