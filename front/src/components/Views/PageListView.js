import { useState, useEffect } from "react";
import back from "../../settings/Backend";
import { Link } from "react-router-dom";
import ModalDialogue from "../Overlays/ModalDialogue";

import { useAuth } from "../../context/AuthContext";

export default function PageListView({ pagesPassed, additionalContainerStyle, canModifyPrimary }) {

    const [pages, setPages] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedPage, setSelectedPage] = useState(null);
    const { token, authAccount } = useAuth()
    const toggleModal = () => setShowModal(!showModal);

    const handleClick = (page) => {
      setSelectedPage(page)
      toggleModal();
    };

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

    const updatePrimaryPage = async (page) => {
      if (page.primary) return;
      
      const endpoint = back.getNonAuthBaseUrl() + 'page/' + page.id + '/'
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
      const previousPrimary = pages.find((p) => p.primary);
      if (previousPrimary) {
        setPages((prevPages) =>
          prevPages.map((p) => (p.id === previousPrimary.id ? { ...p, primary: false } : p))
        );
      }

      // Update the new primary page to be primary
      const updatedPage = { ...page, primary: true };
      setPages((prevPages) =>
        prevPages.map((p) => (p.id === page.id ? updatedPage : p))
      );
      } catch (error) {
          throw error
      }
  };

  const renderIcon = (entry) => {
    let icon
    if (canModifyPrimary && authAccount) {
      if (entry.primary) icon = '🔘'
      else if (authAccount.account_type == 'free') icon = '❌'
      else if (authAccount.account_type == 'subscriber') icon = '✅'

      return <span className="is-primary">{icon}</span>
    }
  }

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
                      {renderIcon(page)}
                      <Link to={'../page/'+page.id}>{page.title}</Link> by {page.account.name}
                      {canModifyPrimary && !page.primary && (
                        <button className="is-primary" onClick={() => handleClick(page)}>Make Primary</button>
                      )}
                    </p>
                </li>
            ))}
            </ul>
            <ModalDialogue 
                isOpen={showModal}
                title="Change Primary Page?"
                message="Are you sure you want to perform this action?"
                onConfirm={() => {
                    updatePrimaryPage(selectedPage)
                    toggleModal()
                }}
                onCancel={toggleModal}
            />
        </div>
    )
}