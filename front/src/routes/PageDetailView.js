import { useState, useEffect } from "react";
import BackendSettings from "../settings/Backend";
import { useParams } from "react-router-dom";


export default function PageDetailView() {

    const back = BackendSettings()
    const { pageId } = useParams();
    const [page, setPage] = useState({});
    const [webrings, setWebrings] = useState([]);
    const [account, setAccount] = useState([]);

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
            setWebrings(data.webrings)
            setPage(data.page)
            setAccount(data.page.account)
          } else {

            console.log("Failure to Get Pages")
          }
        } catch (error) {
          console.log("Error Communicating with Server")
        }
      };


    useEffect(() => {
        getPage();
    }, [pageId]);

    return (
        <>
            <h2>{page.title}</h2>
            <h4>by {account.name}</h4>
            <p>{page.description}</p>
            <ul>
            {webrings.map((webring) => (
                <li key={webring.id}>
                    <p>
                        <a href={'../webring/'+webring.id}>{webring.title}</a>
                    </p>
                </li>
            ))}
            </ul>
        </>
    )
}