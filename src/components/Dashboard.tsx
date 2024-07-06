import * as React from "react"
import { useState, useEffect } from "react"

import ctrl from "../di"

import Footer from "./Footer"
import Search from "./Search"
import Keyword from "./Keyword"

const Dashboard: React.FC = () => {
  const [keywords, setKeywords] = useState(ctrl.getKeywords())
  const [tabList, setTabList] = useState([])
  const [countList, setCountList] = useState([])
  const [positionList, setPositionList] = useState([])

  useEffect(() => {
    ctrl.searchExecute(keywords)
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

  return (
    <>
      <Search setKeywords={setKeywords} />
      <Keyword
        keywords={keywords}
        setKeywords={setKeywords}
        countList={countList}
        positionList={positionList}
      />
      <Footer />
    </>
  )
}

export default Dashboard
