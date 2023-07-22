import { useState, useEffect } from "react";
import back from "../../settings/Backend";
import { Link } from "react-router-dom";

export default function PageListView({ pagesPassed, additionalContainerStyle }) {

    const [pages, setPages] = useState([]);

    const getPages = async () => {
   
        const endpoint = back.getNonAuthBaseUrl() + 'pages/'
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
          if (response.ok) {
            const data = await response.json()
            setPages(data)
          } else {
            console.log("Failure to Get Pages")
          }
        } catch (error) {
          console.log("Error Communicating with Server")
        }
      };


    useEffect(() => {
      if (!pagesPassed) getPages();
      else setPages(pagesPassed)
    }, []);

    return (
        <div className="view-wrapper" style={additionalContainerStyle ? additionalContainerStyle : null}>
            <h2>Pages</h2>
            <ul>
            {pages.map((page) => (
                <li key={page.id}>
                    <p>
                        <Link to={'../page/'+page.id}>{page.title}</Link> by {page.account.name}
                    </p>
                </li>
            ))}
            </ul>
        </div>
    )
}