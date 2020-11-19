import * as React from 'react'
import styled from '@emotion/styled'

const S_Keyword = styled.section`
  color: #444;
  font-size: 11px;
  font-weight: bold;
  position: fixed;
  bottom: 15px;
  left: 20px;
`;

const Keyword: React.FC = () => {
  return (
    <S_Keyword></S_Keyword>
  )
}

export default Keyword