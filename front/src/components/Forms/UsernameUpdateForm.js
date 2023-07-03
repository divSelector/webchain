import { useState } from "react";
import back from "../../settings/Backend";
import LabeledInputField from "../Fields/LabeledInputField";
import { useAuth } from "../../context/AuthContext";

export default function UsernameUpdateForm({ oldName, onUsernameUpdate }) {

    const { token } = useAuth()

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
        <div className="form-wrapper">
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
        </div>
      )

}