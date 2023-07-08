import { handleSubmit, renderErrorMessage } from '../../utils/formsUtils';
import { useState, useEffect } from 'react';
import back from '../../settings/Backend';
import { useAuth } from '../../context/AuthContext';

export default function AddLinkToWebringForm({ webring, pagesInRing, linksToRing }) {

  const [selectedPage, setSelectedPage] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [userPages, setUserPages] = useState([])
  const [userPagesNotOnRing, setUserPagesNotOnRing] = useState([])

  const { token } = useAuth()

  const sendLinkRequest = async (p) => {
    console.log(webring)
    console.log(p)
    const endpoint = back.getNonAuthBaseUrl() + 'link/'+webring.id+'/'+p+'/'
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json()
        setUserPagesNotOnRing(
            prevPages => prevPages.filter(page => page.id !== parseInt(selectedPage))
        );
      } else {
        const data = await response.json()
        
        const errorMappings = [
          { key: "message", setter: setFeedbackMsg },
          { key: "detail", setter: setFeedbackMsg }
        ];
        
        errorMappings.forEach(({ key, setter }) => {
          renderErrorMessage(data, key, setter);
        });
      }
    } catch (error) {
      setFeedbackMsg("Error Communicating with Server")
    }
  }

  const handleSelectChange = (event) => {
    setSelectedPage(event.target.value);
  };

  useEffect(() => {
    const fetchUserPages = async () => {
      try {
        const endpoint = back.getNonAuthBaseUrl() + 'user/';
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch account details');
        }
        const data = await response.json();
        setUserPages(data.pages);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUserPages();
  }, [token]);
  
  useEffect(() => {
    let filteredPages = userPages.filter(
        (page) => !pagesInRing.some((webringPage) => webringPage.title === page.title)
    )
    if (linksToRing) {
        filteredPages = filteredPages.filter(page =>
        !linksToRing.some(link => link.page.id === page.id)
      )
    }
    setUserPagesNotOnRing(filteredPages);
  }, [userPages, pagesInRing]);
  


  return(
    <div id="add-link-to-webring-form" className="form-wrapper">
      <form onSubmit={(e) => handleSubmit(e, sendLinkRequest, selectedPage)}>

        <label htmlFor="page-select"><b>Select a Page to Add To This Ring:</b></label>
        <select id="page-select" value={selectedPage} onChange={handleSelectChange}>
            <option value="">-- Select --</option>
            {userPagesNotOnRing.map((page) => (
                <option key={page.id} value={page.id}>
                    {page.title}
                </option>
            ))}
        </select>
        <button type="submit" disabled={!selectedPage}>
            Request To Join Page to Ring
        </button>

        {feedbackMsg && <p className="error-text" id="add-link-to-webring-form-error">{feedbackMsg}</p>}

      </form>
      
    </div>
  )
}