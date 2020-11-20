import * as React from 'react'
import { useState, useEffect } from "react"

import Ctrl from '../di'

import Footer from './Footer'
import Search from './Search'
import Keyword from './Keyword'

const Dashboard: React.FC = () => {

  const [keywords, setKeywords] = useState(Ctrl.getkeywords())
  const [tabList, setTabList] = useState([])
  const [keywordPostionList, setKeywordPositionList] = useState([])
  const [cacheIdx, setCacheIdx] = useState(0)
  const [cacheCnt, setCacheCnt] = useState(0)

  useEffect(() => {
    Ctrl.searchExecute(keywords)
    console.log('b');
  }, [keywords])

  useEffect(() => {
    Ctrl.insertClassFmw();
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


