import { useState, useEffect } from "react";
import BackendSettings from "../settings/Backend";
import { Link } from "react-router-dom";

export default function WebringListView() {

    const back = BackendSettings()
    const [webrings, setWebrings] = useState([]);

    const getWebrings = async () => {
   
        const endpoint = back.getNonAuthBaseUrl() + 'webrings/'
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
          if (response.ok) {
            const data = await response.json()
            setWebrings(data)
          } else {

            console.log("Failure to Get Pages")
          }
        } catch (error) {
          console.log("Error Communicating with Server")
        }
      };


    useEffect(() => {
        getWebrings();
    }, []);

    return (
        <div className="view-wrapper">
            <h2>Rings</h2>
            <ul>
            {webrings.map((webring) => (
                <li key={webring.id}>
                    <p>
                        <Link to={'/webring/'+webring.id}>{webring.title}</Link> by {webring.account.name}
                    </p>
                </li>
            ))}
            </ul>
        </div>
    )
}