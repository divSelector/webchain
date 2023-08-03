import { useState, useEffect } from "react";
import back from "../../settings/Backend";
import { Link } from "react-router-dom";
import ModalDialogue from "../Overlays/ModalDialogue";
import { useAuth } from "../../context/AuthContext";
import renderIcon from "../../utils/renderTools";
import { useCache } from "../../context/CacheContext";
import nicerFetch from "../../utils/requestUtils";
import ErrorView from "./ErrorView";

export default function WebringListView({ ringsPassed, additionalContainerStyle, canModifyPrimary, accountType }) {

  const [webrings, setWebrings] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedRing, setSelectedRing] = useState(null);

  const { token } = useAuth()
  const cache = useCache()

  const [error, setError] = useState()

  const toggleModal = () => setShowModal(!showModal);

  const handleClick = (ring) => {
    setSelectedRing(ring)
    toggleModal();
  };

  async function getWebrings() {
    const endpoint = back.getNonAuthBaseUrl() + 'webrings/'
    try {
      const data = await nicerFetch({
        endpoint: endpoint,
        responseCache: cache
      });
      setWebrings(data)
    } catch (error) {
      setError(error)
    }
  }

  async function updatePrimaryRing(ring) {
    if (ring.primary) return;
    const endpoint = `${back.getNonAuthBaseUrl()}webring/${ring.id}/`
    try {
      const data = await nicerFetch({
        endpoint: endpoint,
        method: 'PATCH',
        token: token,
        body: {
          primary: true
        },
        responseCache: cache
      });

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
      console.log(error)
    }
  }

  useEffect(() => {
    if (!ringsPassed) getWebrings();
    else setWebrings(ringsPassed)
  }, []);

  if (error) {return <ErrorView error={error} />}

  return (
    <div className="view-wrapper" style={additionalContainerStyle ? additionalContainerStyle : null}>
      <h2>Webrings</h2>
      <ul>
        {webrings.map((webring) => (
          <li key={webring.id}>
            <p>
              {renderIcon(webring, accountType, canModifyPrimary)}
              <Link to={'/webring/' + webring.id}>{webring.title}</Link> by {webring.account.name}

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