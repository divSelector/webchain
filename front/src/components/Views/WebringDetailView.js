import { useState, useEffect } from "react";
import back from "../../settings/Backend";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotFoundView from "./NotFound";
import AddLinkToWebringForm from "../Forms/AddLinkToWebringForm";

export default function WebringDetailView() {

    const { webringId } = useParams();
    const [webring, setWebring] = useState({});
    const [pages, setPages] = useState([]);
    const [ringAccount, setRingAccount] = useState([]);

    const [isRingOwner, setIsRingOwner] = useState(false)

    const [error, setError] = useState(false);

    const { authAccount } = useAuth()

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
            setPages(data.pages)
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
            {isRingOwner && <p><Link to={'/webring/update/'+webringId} >Manage Your Webring</Link></p>}
            {authAccount && <><AddLinkToWebringForm webring={webring} pagesInRing={pages} /></> }
          </div>
          <ul>
          {pages.map((page) => (
              <li key={page.id}>
                  <p>
                      <a href={'../page/'+page.id}>{page.title}</a> by {page.account.name}
                  </p>
              </li>
          ))}
          </ul>
        </div>
    )
}