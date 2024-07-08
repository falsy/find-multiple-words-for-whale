import { useState, useEffect, useRef } from "react"

import ctrl from "../di"

import Footer from "./Footer"
import Search from "./Search"
import Keyword from "./Keyword"
import styled from "@emotion/styled"

const Dashboard: React.FC = () => {
  const searchInput = useRef(null)
  const [keywords, setKeywords] = useState(ctrl.getKeywords())
  const [tabList, setTabList] = useState([])
  const [countList, setCountList] = useState([])
  const [positionList, setPositionList] = useState([])
  const [unsupportedPage, setUnsupportedPage] = useState(false)

  useEffect(() => {
    setUnsupportedPage(false)
    ctrl.searchExecute(
      keywords,
      setCountList,
      setPositionList,
      setUnsupportedPage
    )
  }, [keywords])

  useEffect(() => {
    ctrl.addWhaleEventListener(
      setKeywords,
      tabList,
      setTabList,
      setCountList,
      setPositionList
    )
  }, [])

  useEffect(() => {
    if (searchInput && unsupportedPage) {
      searchInput.current.blur()
    }
  }, [unsupportedPage])

  return (
    <$area>
      <Search
        searchInput={searchInput}
        keywords={keywords}
        setKeywords={setKeywords}
      />
      <Keyword
        keywords={keywords}
        setKeywords={setKeywords}
        countList={countList}
        positionList={positionList}
      />
      <Footer />
      {unsupportedPage && (
        <$unsupported>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>지원하지 않는 페이지 입니다.</span>
          </p>
        </$unsupported>
      )}
    </$area>
  )
}

export default Dashboard

const $area = styled.div`
  height: 100%;
`

const $unsupported = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  color: #000;

  @media (prefers-color-scheme: dark) {
    background: rgba(0, 0, 0, 0.7);
    color: #ddd;
  }

  p {
    margin-top: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    svg {
      margin-right: 10px;
    }
  }
`
