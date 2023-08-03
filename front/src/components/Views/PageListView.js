import { useState, useEffect } from "react";
import back from "../../settings/Backend";
import { Link } from "react-router-dom";
import ModalDialogue from "../Overlays/ModalDialogue";
import renderIcon from "../../utils/renderTools";
import { useCache } from "../../context/CacheContext";
import { useAuth } from "../../context/AuthContext";
import nicerFetch from "../../utils/requestUtils";
import ErrorView from "./ErrorView";
export default function PageListView({ pagesPassed, additionalContainerStyle, canModifyPrimary, accountType }) {

  const [pages, setPages] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const { token } = useAuth()
  const toggleModal = () => setShowModal(!showModal);

  const [error, setError] = useState(null)

  const cache = useCache()

  const handleClick = (page) => {
    setSelectedPage(page)
    toggleModal();
  };

  async function getPages() {
    const endpoint = back.getNonAuthBaseUrl() + 'pages/'
    try {
      const data = await nicerFetch({
        endpoint: endpoint,
        responseCache: cache
      });
      setPages(data)
    } catch (error) {
      setError(error)
    }
  }

  async function updatePrimaryPage(page) {
    if (page.primary) return;
    const endpoint = `${back.getNonAuthBaseUrl()}page/${page.id}/`
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
      console.log(error)
    }
  }

  useEffect(() => {
    if (!pagesPassed) getPages();
    else setPages(pagesPassed)
  }, []);

  if (error) {return <ErrorView error={error} />}  

  return (
    <div className="view-wrapper" style={additionalContainerStyle ? additionalContainerStyle : null}>
      <h2>Pages</h2>
      <ul>
        {pages.map((page) => (
          <li key={page.id}>
            <p>
              {renderIcon(page, accountType, canModifyPrimary)}
              <Link to={'../page/' + page.id}>{page.title}</Link> by {page.account.name}
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