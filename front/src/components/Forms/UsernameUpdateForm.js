import { useState } from "react";
import BackendSettings from "../../settings/Backend";
import LabeledInputField from "../Fields/LabeledInputField";

export default function UsernameUpdateForm({ token, oldName, onUsernameUpdate }) {
    
    const back = BackendSettings()

    const [name, setName] = useState(oldName);

    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const endpoint = back.getNonAuthBaseUrl() + 'user/' + oldName + "/"
        try {
            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    name: name
                })
            });
    
            if (response.ok) {
                const data = await response.json()
                onUsernameUpdate()
            } else {
                console.log("Failure to PATCH Username")
            }
        } catch (error) {
            console.log("Error Communicating with Server")
        }

    };

    return(
        <>
          <h2>Username</h2>
          <form onSubmit={handleSubmit}>
    
            <LabeledInputField 
                type="text" 
                id="account-name" 
                name="Username" 
                defaultValue={oldName}
                onChange={handleInputChange}
            />
    
            <button type="submit">UPDATE</button>
          </form>
        </>
      )

}