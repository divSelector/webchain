import BackendSettings from "../../settings/Backend";
import { handleSubmit } from "../../utils/formsUtils";
import { useState } from "react";
import LabeledInputField from "../Fields/LabeledInputField";
import { useAuth } from "../../context/AuthContext";

export default function PageCreateView() {
    const { token } = useAuth()

    const back = BackendSettings()

    const [title, setTitle] = useState();
    const [url, setUrl] = useState();
    const [description, setDescription] = useState();

    const createPage = async (input) => {
   
        const endpoint = back.getNonAuthBaseUrl(input) + 'page/'
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                title: input.title,
                url: input.url,
                description: input.description
            })
          });
    
          if (response.ok) {
            const data = await response.json()
            if (data.hasOwnProperty('id')) {
                const newPageId = data.id
                window.location.href = `/page/${newPageId}`
            }

          } else {

            console.log("Failure to Create Page")
          }
        } catch (error) {
          console.log("Error Communicating with Server")
        }
    };

    return (
        <div className="view-wrapper">
            <div>
                <h2>Add a Page</h2>
            </div>
            <div className="form-wrapper">
                <form onSubmit={(e) => handleSubmit(e, createPage, {
                    title, url, description
                })}>

                    <LabeledInputField type="text" id="new-page-title" name="Title" 
                        onChange={e => setTitle(e.target.value)} 
                    />
                    <LabeledInputField type="text" id="new-page-title" name="URL" 
                        onChange={e => setUrl(e.target.value)} 
                    />
                    <LabeledInputField type="text" id="new-page-title" name="Description" 
                        onChange={e => setDescription(e.target.value)} 
                    />

                    <button type="submit">CREATE PAGE</button>
                    {/* {feedbackMsg && <p className="error-text" id="login-form-error">{feedbackMsg}</p>} */}

                </form>
            </div>
        </div>
    )
}