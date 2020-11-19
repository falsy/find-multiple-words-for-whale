import * as React from 'react'
import Style from './Style'
import Footer from './Footer'
import Search from './Search'
import Keyword from './Keyword'

const Dashboard: React.FC = () => {
  return (
    <>
      <Style />
      <Search />
      <Keyword />
      <Footer />
    </>
  )
}

export default Dashboard


