import { useState, useEffect } from "react";
import back from "../../settings/Backend";
import { Link } from "react-router-dom";
import ModalDialogue from "../Overlays/ModalDialogue";
import { useAuth } from "../../context/AuthContext";
import renderIcon from "../../utils/renderTools";

export default function WebringListView({ ringsPassed, additionalContainerStyle, canModifyPrimary }) {

    const [webrings, setWebrings] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedRing, setSelectedRing] = useState(null);
    const { token, authAccount } = useAuth()
    const toggleModal = () => setShowModal(!showModal);

    const handleClick = (ring) => {
      setSelectedRing(ring)
      toggleModal();
    };


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
          throw error
        }
      };

      const updatePrimaryRing = async (ring) => {
        if (ring.primary) return;
        
        const endpoint = back.getNonAuthBaseUrl() + 'webring/' + ring.id + '/'
        try {
          const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              primary: true
            })
          });
          const data = await response.json()
        const previousPrimary = webrings.find((r) => r.primary);
        if (previousPrimary) {
          setWebrings((prevRings) =>
            prevRings.map((r) => (r.id === previousPrimary.id ? { ...r, primary: false } : r))
          );
        }
  
        // Update the new primary page to be primary
        const updatedRing = { ...ring, primary: true };
        setWebrings((prevRings) =>
          prevRings.map((r) => (r.id === ring.id ? updatedRing : r))
        );
        } catch (error) {
            throw error
        }
    };

    useEffect(() => {
      if (!ringsPassed) getWebrings();
      else setWebrings(ringsPassed)
    }, []);

    return (
        <div className="view-wrapper" style={additionalContainerStyle ? additionalContainerStyle : null}>
            <h2>Rings</h2>
            <ul>
            {webrings.map((webring) => (
                <li key={webring.id}>
                    <p>
                        {renderIcon(webring, authAccount, canModifyPrimary)}
                        <Link to={'/webring/'+webring.id}>{webring.title}</Link> by {webring.account.name}
                        
                        {canModifyPrimary && !webring.primary && (
                        <button className="is-primary" onClick={() => handleClick(webring)}>Make Primary</button>
                      )}
                    </p>
                </li>
            ))}
            </ul>
            <ModalDialogue 
                isOpen={showModal}
                title="Change Primary Webring?"
                message="Are you sure you want to perform this action?"
                onConfirm={() => {
                    updatePrimaryRing(selectedRing)
                    toggleModal()
                }}
                onCancel={toggleModal}
            />
        </div>
    )
}