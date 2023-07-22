import { useState, useEffect } from "react";
import back from "../../settings/Backend";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotFoundView from "./NotFound";
import AddLinkToWebringForm from "../Forms/AddLinkToWebringForm";
import ModalDialogue from "../Overlays/ModalDialogue";
import ReactDOMServer from 'react-dom/server';

export default function WebringDetailView() {

    const { webringId } = useParams();
    const [webring, setWebring] = useState({});
    const [pages, setPages] = useState([]);
    const [links, setLinks] = useState();
    const [ringAccount, setRingAccount] = useState([]);

    const [isRingOwner, setIsRingOwner] = useState(false)

    const [error, setError] = useState(false);

    const { token, authAccount } = useAuth()

    const [showModal, setShowModal] = useState(false);
    const [markup, setMarkup] = useState(null);
    const toggleModal = () => setShowModal(!showModal);;

    const handleClick = (page) => {
      setMarkup(generateMarkup(page.url))
      toggleModal();
    };

    function generateMarkup(pageUrl) {
      const hostUrl = back.host + '/'
      const encodedPageUrl = encodeURIComponent(pageUrl);

      const jsx = [
        <a key="back" href={`${hostUrl}api/webring/${webringId}/previous?via=${encodedPageUrl}`}>← Back</a>,
        <a key="random" href={`${hostUrl}api/webring/${webringId}/random`}>↑ Random</a>,
        <a key="home" href={`${hostUrl}api/webring/${webringId}/`}>↓ Ring Home</a>,
        <a key="next" href={`${hostUrl}api/webring/${webringId}/next?via=${encodedPageUrl}`}>→ Next</a>
      ];

      const htmlString = jsx.map((element) => ReactDOMServer.renderToStaticMarkup(element)).join('\n');
      console.log(htmlString)

      return htmlString

    }


    const action = {
      text: "Show HTML",
      func: () => { return }
    }

    const getLinks = async () => {
      const endpoint = back.getNonAuthBaseUrl() + 'link/' + webringId
      try {
        let headers = {
          'Content-Type': 'application/json'
        }
        if (token) {
          headers['Authorization'] = `Token ${token}`
        }
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: headers
        });
  
        if (response.ok) {
          const data = await response.json()
          await setLinks([...data.approved, ...data.not_approved])
        } else {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const getWebring = async () => {
   
        const endpoint = back.getNonAuthBaseUrl() + 'webring/' + webringId
        try {
          let headers = {
            'Content-Type': 'application/json'
          }
          if (token) {
            headers['Authorization'] = `Token ${token}`
          }
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers
          });
    
          if (response.ok) {
            const data = await response.json()
            console.log(data)
            setWebring(data.webring)
            setPages(data.pages)
            if (data.hasOwnProperty('links')) {
              // This is why its always correct.
              await setLinks(data.links)
            } else {
              await getLinks()
            }
            setRingAccount(data.webring.account)
          } else {
            setError("Resource not Found")
          }
        } catch (error) {
          setError("Failure communicating with server")
        }
    };

    const checkRingOwnership = () => {
      if (authAccount && ringAccount && authAccount.name === ringAccount.name) {
        setIsRingOwner(true)
      } else {
        setIsRingOwner(false)
      }
    }

    const handlePageAdded = () => {
      getWebring();
    };

    useEffect(() => {
        getWebring();
    }, [webringId]);

    useEffect(() => {
      checkRingOwnership();
    }, [ringAccount]);
    
    if (error) {
      return <NotFoundView />
    }

    return (
        <div className="view-wrapper">
          <div className="view-details">
            <h2>{webring.title}</h2>
            <h4>by {ringAccount.name}</h4>
            <p>{webring.description}</p>
            {token && isRingOwner && <p><Link to={'/webring/update/'+webringId} >Manage Your Webring</Link></p>}
            {token && <>
              <AddLinkToWebringForm 
                webring={webring} 
                pagesInRing={pages} 
                linksToRing={links}
                onPageAdded={handlePageAdded}
              />
            </>}
          </div>
          <ul>
          {pages.map((page) => (
              <li key={page.id}>
                  <p className="webring-page-link-button-group">
                      <button onClick={() => handleClick(page)}>{action.text}</button>
                      <Link to={'../page/'+page.id}>{page.title}</Link> by {page.account.name}
                  </p>
              </li>
          ))}
          </ul>
          <ModalDialogue 
                isOpen={showModal}
                title="Copy This HTML To Your Page"
                message={markup}
                onCancel={toggleModal}
                cancelText="Ok"
            />
       
        </div>
    )
}