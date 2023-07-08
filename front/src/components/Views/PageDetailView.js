import { useState, useEffect } from "react";
import back from "../../settings/Backend";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotFoundView from "./NotFound";
export default function PageDetailView() {

    const { pageId } = useParams();
    const [page, setPage] = useState({});
    const [webrings, setWebrings] = useState([]);
    const [pageAccount, setPageAccount] = useState([]);

    const [isPageOwner, setIsPageOwner] = useState(false)

    const { authAccount } = useAuth()

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
            console.log(data)
            setWebrings(data.webrings)
            setPage(data.page)
            setPageAccount(data.page.account)
          } else {

            setError("Failure to Get Pages")
          }
        } catch (error) {
          setError("Error Communicating with Server")
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
    

    if (error) {
      return <NotFoundView />
    }

    return (
        <div className="view-wrapper">
          <div className="view-details">
            <h2>{page.title}</h2>
            <h3>{page.url}</h3>
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