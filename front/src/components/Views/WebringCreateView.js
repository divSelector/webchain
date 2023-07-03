import back from "../../settings/Backend";
import { handleSubmit } from "../../utils/formsUtils";
import { useState } from "react";
import LabeledInputField from "../Fields/LabeledInputField";
import { useAuth } from "../../context/AuthContext";

export default function WebringCreateView() {
    const { token } = useAuth()

    const [title, setTitle] = useState();
    const [description, setDescription] = useState();

    const createWebring = async (input) => {
   
        const endpoint = back.getNonAuthBaseUrl(input) + 'webring/'
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                title: input.title,
                description: input.description
            })
          });
    
          if (response.ok) {
            const data = await response.json()
            if (data.hasOwnProperty('id')) {
                const newRingId = data.id
                window.location.href = `/webring/${newRingId}`
            }

          } else {

            console.log("Failure to Create Webring")
          }
        } catch (error) {
          console.log("Error Communicating with Server")
        }
    };

    return (
        <div className="view-wrapper">
            <div>
                <h2>Add a Webring</h2>
            </div>
            <div className="form-wrapper">
                <form onSubmit={(e) => handleSubmit(e, createWebring, {
                    title, description
                })}>

                    <LabeledInputField type="text" id="new-page-title" name="Title" 
                        onChange={e => setTitle(e.target.value)} 
                    />
                    <LabeledInputField type="text" id="new-page-title" name="Description" 
                        onChange={e => setDescription(e.target.value)} textarea={true} 
                    />

                    <button type="submit">CREATE WEBRING</button>
                    {/* {feedbackMsg && <p className="error-text" id="login-form-error">{feedbackMsg}</p>} */}

                </form>
            </div>
        </div>
    )
}