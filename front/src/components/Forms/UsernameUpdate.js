import { useState, useEffect } from "react";
import BackendSettings from "../../settings/Backend";
import FrontendSettings from "../../settings/Frontend";

export default function UsernameUpdate({ token }) {
    
    const back = BackendSettings()
    const front = FrontendSettings()

    const [account, setAccount] = useState(null)
    const [name, setName] = useState(oldName);

    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const endpoint = back.getNonAuthBaseUrl() + 'user/' + oldName
        try {
            const token = sessionStorage.getItem(front.storageKeyName)
            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: {
                    name: name
                }
            });
    
            if (response.ok) {
                const data = await response.json()
                console.log(data)
            } else {
                console.log("Failure to PATCH Username")
            }
        } catch (error) {
            console.log("Error Communicating with Server")
        }

    };

    const getCurrentName = async () => {
        const endpoint = back.getNonAuthBaseUrl() + 'user/' + oldName
        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.ok) {
                const data = await response.json()
                setName(data.name)
            } else {
                console.log("Failure to GET Username")
            }
        } catch (error) {
            console.log("Error Communicating with Server")
        }

    };

    useEffect(() => {
        if (token) getCurrentName()
    }, [token])

}