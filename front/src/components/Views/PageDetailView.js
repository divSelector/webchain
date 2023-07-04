import { useState, useEffect } from "react";
import back from "../../settings/Backend";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PageDetailView() {

    const { pageId } = useParams();
    const [page, setPage] = useState({});
    const [webrings, setWebrings] = useState([]);
    const [pageAccount, setPageAccount] = useState([]);

    const [isPageOwner, setIsPageOwner] = useState(false)

    const { authAccount } = useAuth()

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
            setPageAccount(data.page.account)
          } else {

            console.log("Failure to Get Pages")
          }
        } catch (error) {
          console.log("Error Communicating with Server")
        }
    };

    const checkPageOwnership = () => {
      if (authAccount && pageAccount && authAccount.name === pageAccount.name) {
        setIsPageOwner(true)
      } else {
        setIsPageOwner(false)
      }
    }

    useEffect(() => {
        getPage();
    }, [pageId]);

    useEffect(() => {
      checkPageOwnership();
    }, [pageAccount]);
    

    return (
        <div className="view-wrapper">
          <div className="view-details">
            <h2>{page.title}</h2>
            <h4>by {pageAccount.name}</h4>
            <p>{page.description}</p>
            {isPageOwner && <Link to={'/page/update/'+pageId} >Update Page</Link> }
          </div>
          <ul>
            {webrings.map((webring) => (
                <li key={webring.id}>
                    <p>
                        <a href={'../webring/'+webring.id}>{webring.title}</a>
                    </p>
                </li>
            ))}
          </ul>
        </div>
    )
}