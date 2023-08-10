import { useState, useEffect } from "react";
import back from "../../settings/Backend";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorView from "./ErrorView";
import { useCache } from "../../context/CacheContext";
import nicerFetch from "../../utils/requestUtils";
import React from 'react';

export default function PageDetailView() {

  const { pageId } = useParams();
  const [page, setPage] = useState({});
  const [webrings, setWebrings] = useState([]);
  const [pageAccount, setPageAccount] = useState([]);
  const [isPageOwner, setIsPageOwner] = useState(false)
  const { authAccount } = useAuth()
  const [error, setError] = useState(false);
  const cache = useCache()

  async function getPage() {
    const endpoint = back.getNonAuthBaseUrl() + 'page/' + pageId
    try {
      const data = await nicerFetch({
        endpoint: endpoint,
        responseCache: cache
      });
      setWebrings(data.webrings)
      setPage(data.page)
      setPageAccount(data.page.account)
    } catch (error) {
      setError(error)
    }
  }

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


  if (error) return <ErrorView error={error} />

  return (
    <div className="view-wrapper">
      <div className="view-details">
        <h2>{page.title}</h2>
        <h3>{page.url}</h3>
        <h4>by {pageAccount.name}</h4>
        <p>{page.description}</p>
        {isPageOwner && <Link to={'/page/update/' + pageId} >Update Page</Link>}
      </div>
      <ul>
        {webrings.map((webring) => (
          <li key={webring.id}>
            <p>
              <Link to={'../webring/' + webring.id}>{webring.title}</Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}