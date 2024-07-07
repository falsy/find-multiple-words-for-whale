import * as React from "react"
import { useState, useEffect } from "react"

import ctrl from "../di"

import Footer from "./Footer"
import Search from "./Search"
import Keyword from "./Keyword"
import styled from "@emotion/styled"

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
    <$area>
      <Search keywords={keywords} setKeywords={setKeywords} />
      <Keyword
        keywords={keywords}
        setKeywords={setKeywords}
        countList={countList}
        positionList={positionList}
      />
      <Footer />
    </$area>
  )
}

export default Dashboard

const $area = styled.div`
  height: 100%;
`
