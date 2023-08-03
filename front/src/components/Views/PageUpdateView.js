import back from "../../settings/Backend";
import { handleSubmit } from "../../utils/formsUtils";
import { useState, useEffect } from "react";
import LabeledInputField from "../Fields/LabeledInputField";
import { useAuth } from "../../context/AuthContext";
import { renderErrorMessage } from "../../utils/formsUtils";
import { useParams } from "react-router-dom";
import ErrorView from "./ErrorView";

export default function PageUpdateView() {

    const { pageId } = useParams();
    const { token } = useAuth()

    const [page, setPage] = useState({});

    const [title, setTitle] = useState();
    const [url, setUrl] = useState();
    const [description, setDescription] = useState();

    const [titleFieldError, setTitleFieldError] = useState('');
    const [urlFieldError, setUrlFieldError] = useState('');
    const [descriptionError, setDescriptionFieldError] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState('');

    const [error, setError] = useState(false);

    const getPage = async () => {
   
        const endpoint = back.getNonAuthBaseUrl() + 'page/' + pageId
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
          if (response.ok) {
            const data = await response.json()
            setPage(data.page)
          } else {

            setError("Failure to Get Pages")
          }
        } catch (error) {
          setError("Error Communicating with Server")
        }
    };

    const updatePage = async (input) => {
   
        const endpoint = back.getNonAuthBaseUrl(input) + 'page/' + pageId + '/'
        try {
          const response = await fetch(endpoint, {
            method: 'PATCH',
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
                window.location.href = `/page/${newPageId}`
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
        getPage();
    }, [pageId]);

    if (error) {
      return <ErrorView />
    }

    return (
        <div className="view-wrapper">
            <div>
                <h2>Update Page</h2>
            </div>
            <div className="form-wrapper">
                <form onSubmit={(e) => handleSubmit(e, updatePage, {
                    title, url, description
                })}>

                    <LabeledInputField type="text" id="new-page-title" name="Title" defaultValue={page.title}
                        onChange={e => setTitle(e.target.value)} error={titleFieldError} 
                    />
                    <LabeledInputField type="text" id="new-page-title" name="URL" defaultValue={page.url}
                        onChange={e => setUrl(e.target.value)} error={urlFieldError}
                    />
                    <LabeledInputField type="text" id="new-page-title" name="Description" defaultValue={page.description}
                        onChange={e => setDescription(e.target.value)} textarea={true} error={descriptionError}
                    />

                    <button type="submit">UPDATE PAGE</button>
                    {feedbackMsg && <p className="error-text" id="login-form-error">{feedbackMsg}</p>}

                </form>
            </div>
        </div>
    )
}