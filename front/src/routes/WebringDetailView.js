import { useState, useEffect } from "react";
import BackendSettings from "../settings/Backend";
import { useParams } from "react-router-dom";


export default function WebringDetailView() {

    const back = BackendSettings()
    const { webringId } = useParams();
    const [webring, setWebring] = useState({});
    const [pages, setPages] = useState([]);
    const [account, setAccount] = useState([]);

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
            setAccount(data.webring.account)
          } else {

            console.log("Failure to Get Pages")
          }
        } catch (error) {
          console.log("Error Communicating with Server")
        }
      };


    useEffect(() => {
        getWebring();
    }, [webringId]);

    return (
        <div className="view-wrapper">
          <div className="webring-details">
            <h2>{webring.title}</h2>
            <h4>by {account.name}</h4>
            <p>{webring.description}</p>
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