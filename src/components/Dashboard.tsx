import * as React from 'react'
import { useState, useEffect } from "react"

import di from '../di'

import Footer from './Footer'
import Search from './Search'
import Keyword from './Keyword'

const Dashboard: React.FC = () => {

  const [keywordList, setKeywordList] = useState(di.storage.getkeywords())
  const [tabList, setTabList] = useState([])
  const [keywordPostionList, setKeywordPositionList] = useState([])
  const [cacheIdx, setCacheIdx] = useState(0)
  const [cacheCnt, setCacheCnt] = useState(0)

  const searchExecute = (keywords: Array<string>) => {
    
  }

  useEffect(() => {
    
  }, [])

  return (
    <>
      <Search />
      <Keyword />
      <Footer />
    </>
  )
}

export default Dashboard


