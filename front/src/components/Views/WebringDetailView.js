import { useState, useEffect } from "react";
import back from "../../settings/Backend";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotFoundView from "./NotFound";
import AddLinkToWebringForm from "../Forms/AddLinkToWebringForm";
import ModalDialogue from "../Overlays/ModalDialogue";
import ReactDOMServer from 'react-dom/server';
import ExampleRingMarkup from "./ExampleRingMarkup";
import front from "../../settings/Frontend";

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
    const toggleModal = () => setShowModal(!showModal);

    const handleClick = (page) => {
      setMarkup(stringifyMarkup(generateMarkup(page.url)))
      toggleModal();
    };

    function generateMarkup(pageUrl) {
      const hostUrl = back.host + '/'
      const encodedPageUrl = encodeURIComponent(pageUrl);

      const jsx = <>
        <a href={`${hostUrl}api/webring/${webringId}/previous?via=${encodedPageUrl}`}>← Back</a> {'\n'}
        <a href={`${hostUrl}api/webring/${webringId}/random`}>↑ Random</a> {'\n'}
        <a href={`${front.host}/webring/${webringId}/`}>↓ {webring.title}</a> {'\n'}
        <a href={`${hostUrl}api/webring/${webringId}/next?via=${encodedPageUrl}`}>→ Next</a> {'\n'}
      </>
  
      return jsx
    }

    const stringifyMarkup = (jsx) => {
      const containerId = 'webchain-' + webring.title.toLowerCase().replace(/\s+/g, '-') + '-container'
      return [
        `<div id=${containerId}>\n`,
        ReactDOMServer.renderToStaticMarkup(jsx),
        `</div>\n`
      ]
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
            setWebring(data.webring)
            setPages(data.pages)
            if (data.hasOwnProperty('links')) {
              // This is why its always correct.
              await setLinks(data.links)
            } else {
              await token && getLinks()
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
    }, [ringAccount, authAccount]);
    
    if (error) {
      return <NotFoundView />
    }

    return (
        <div className="view-wrapper">
          <div className="view-details">
            <div>
              <h2>{webring.title}</h2>
              <h4>by {ringAccount.name}</h4>
              <p>{webring.description}</p>
              {isRingOwner && <p><Link to={'/webring/update/'+webringId}>Manage Your Webring</Link></p>}
            </div>
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
            {pages.length > 0 && 
              <li>
                <ExampleRingMarkup markup={generateMarkup(pages[0].url)} />
              </li>
            }
          {pages.map((page) => (
              <li key={page.id}>
                  <p className="webring-page-link-button-group">
                      <Link to={'../page/'+page.id}>{page.title}</Link> by {page.account.name}
                      {authAccount && authAccount.name === page.account.name && <>
                        <button onClick={() => handleClick(page)}>{action.text}</button>
                      </>}
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