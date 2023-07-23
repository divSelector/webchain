import back from "../../settings/Backend";
import { handleSubmit } from "../../utils/formsUtils";
import { useState, useEffect } from "react";
import LabeledInputField from "../Fields/LabeledInputField";
import { useAuth } from "../../context/AuthContext";
import { renderErrorMessage } from "../../utils/formsUtils";
import { useNavigate } from "react-router-dom";


export default function PageCreateView() {

    const { token } = useAuth()

    const [title, setTitle] = useState();
    const [url, setUrl] = useState();
    const [description, setDescription] = useState();

    const [titleFieldError, setTitleFieldError] = useState('');
    const [urlFieldError, setUrlFieldError] = useState('');
    const [descriptionError, setDescriptionFieldError] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState('');


    const [pageUrl, setPageUrl] = useState(null)
    const navigate = useNavigate()

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
          const data = await response.json()
          if (response.ok) {

            if (data.hasOwnProperty('id')) {
                const newPageId = data.id
                // window.location.href = `/page/${newPageId}`
                setPageUrl(`/page/${newPageId}`)
            }

          } else {
            const errorMappings = [
                { key: "title", setter: setTitleFieldError },
                { key: "url", setter: setUrlFieldError },
                { key: "description", setter: setDescriptionFieldError },
                { key: "__all__", setter: setFeedbackMsg }
            ]
            errorMappings.forEach(({ key, setter }) => {
                renderErrorMessage(data, key, setter);
              });
          }
        } catch (error) {
            setFeedbackMsg("Error Communicating with Server")
        }
    };

    useEffect(() => {
        if (pageUrl) {
          navigate(pageUrl)
          setPageUrl(null)
        }
      }, [pageUrl]);

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
                        onChange={e => setTitle(e.target.value)} error={titleFieldError} 
                    />
                    <LabeledInputField type="text" id="new-page-title" name="URL" 
                        onChange={e => setUrl(e.target.value)} error={urlFieldError}
                    />
                    <LabeledInputField type="text" id="new-page-title" name="Description" 
                        onChange={e => setDescription(e.target.value)} textarea={true} error={descriptionError}
                    />

                    <button type="submit">CREATE PAGE</button>
                    {feedbackMsg && <p className="error-text" id="login-form-error">{feedbackMsg}</p>}

                </form>
            </div>
        </div>
    )
}