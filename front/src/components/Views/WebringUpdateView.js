import back from "../../settings/Backend";
import { handleSubmit } from "../../utils/formsUtils";
import { useState, useEffect } from "react";
import LabeledInputField from "../Fields/LabeledInputField";
import { useAuth } from "../../context/AuthContext";
import { renderErrorMessage } from "../../utils/formsUtils";
import { useParams } from "react-router-dom";
import NotFoundView from "./NotFound";
import LinkListView from "./LinkListView";

export default function WebringUpdateView() {

    const { webringId } = useParams();
    const { token } = useAuth()

    const [webring, setWebring] = useState({});

    const [approvedLinks, setApprovedLinks] = useState()
    const [unapprovedLinks, setUnapprovedLinks] = useState()

    const [title, setTitle] = useState();
    const [description, setDescription] = useState();

    const [titleFieldError, setTitleFieldError] = useState('');
    const [descriptionError, setDescriptionFieldError] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState('');

    const [error, setError] = useState(false);

    const getWebring = async () => {
   
        const endpoint = back.getNonAuthBaseUrl() + 'webring/' + webringId
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
          if (response.ok) {
            const data = await response.json()
            setWebring(data.webring)
          } else {

            setError("Failure to Get Webring")
          }
        } catch (error) {
          setError("Error Communicating with Server")
        }
    };

    const updateWebring = async (input) => {
   
        const endpoint = back.getNonAuthBaseUrl() + 'webring/' + webringId + '/'
        try {
          const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                title: input.title,
                description: input.description
            })
          });
          const data = await response.json()
          if (response.ok) {

            if (data.hasOwnProperty('id')) {
                const newRingId = data.id
                window.location.href = `/webring/${newRingId}`
            }

          } else {
            const errorMappings = [
                { key: "title", setter: setTitleFieldError },
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

    const getWebringPageLinks = async () => {
      const endpoint = back.getNonAuthBaseUrl() + 'link/' + webringId + '/'
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (response.ok) {
          const { approved, not_approved } = data;
          setApprovedLinks(approved)
          setUnapprovedLinks(not_approved)
        } else {
          console.log(response)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const approveLink = async (link) => {
      const endpoint = back.getNonAuthBaseUrl() + 'link/update/' + link.id + '/'
      try {
        const response = await fetch(endpoint, {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            approved: true
          })
        })
        const data = await response.json()
        if (response.ok) {
          await getWebringPageLinks()
        } else {
          console.log(response)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const deleteLink = async (link) => {
      const endpoint = back.getNonAuthBaseUrl() + 'link/delete/' + link.id + '/'
      try {
        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          await getWebringPageLinks()
        } else {
          console.log(response)
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
        getWebring();
        getWebringPageLinks()
    }, [webringId]);


    if (error) return <NotFoundView />

    return (
        <div className="view-wrapper">
            <div>
                <h2>Manage Webring</h2>
            </div>
            <div className="form-wrapper">
                <form onSubmit={(e) => handleSubmit(e, updateWebring, {
                    title, description
                })}>

                    <LabeledInputField type="text" id="new-webring-title" name="Title" defaultValue={webring.title}
                        onChange={e => setTitle(e.target.value)} error={titleFieldError} 
                    />
                    <LabeledInputField type="text" id="new-webring-title" name="Description" defaultValue={webring.description}
                        onChange={e => setDescription(e.target.value)} textarea={true} error={descriptionError}
                    />

                    <button type="submit">UPDATE Webring</button>
                    {feedbackMsg && <p className="error-text" id="login-form-error">{feedbackMsg}</p>}

                </form>
            </div>


            <div>

                {unapprovedLinks && unapprovedLinks.length > 0 && <>
                  <h3>Unapproved Links</h3>
                  <LinkListView 
                    linksPassed={unapprovedLinks}
                    action={{
                      func: approveLink,
                      text: "Approve"
                    }}
                  />
                </>}

                {approvedLinks && approvedLinks.length > 0 && <>
                  <h3>Approved Links</h3>
                  <LinkListView 
                    linksPassed={approvedLinks}
                    action={{
                      func: deleteLink,
                      text: "Delete"
                    }}
                  />
                </>}

            </div>
        </div>
    )
}