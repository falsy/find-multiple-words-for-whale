import * as React from 'react'
import { useState, useEffect } from "react"

import ctrl from '../di'

import Footer from './Footer'
import Search from './Search'
import Keyword from './Keyword'

const Dashboard: React.FC = () => {

  const [keywords, setKeywords] = useState(ctrl.getkeywords())
  const [tabList, setTabList] = useState([])
  const [countList, setCountList] = useState([])
  const [postionList, setPositionList] = useState([])
  const [cacheIdx, setCacheIdx] = useState(0)
  const [cacheCnt, setCacheCnt] = useState(0)

  useEffect(() => {
    ctrl.searchExecute(keywords)
  }, [keywords])

  useEffect(() => {
    ctrl.insertClassFmw()
    ctrl.addWhaleEventListener(setKeywords, tabList, setTabList, setCountList, setPositionList)
  }, [])

  return (
    <>
      <Search setKeywords={setKeywords} />
      <Keyword />
      <Footer />
    </>
  )
}

export default Dashboard


