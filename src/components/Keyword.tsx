import * as React from 'react'
import { useState, useEffect } from "react"
import styled from '@emotion/styled'
import { KEYWORDS_COLOR_SET } from '../constants'

import ctrl from '../di'

const S_Title = styled.h2`
  padding-top: 40px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #444;
  margin: 46px 0 15px;
`

const S_KeywordListArea = styled.ul`
  padding: 0;
  list-style: none;
`

const S_KeywordList = styled.li<{no: number}>`
  position: relative;
  background: #fff;
  padding-right: 30px;
  margin-bottom: 8px;
  &::before {
    content: '';
    position: absolute;
    width: 6px;
    height: 100%;
    background: ${props => KEYWORDS_COLOR_SET[props.no]};
  }
  &:hover svg {
    opacity: 1;
  }
`

const S_Keyword = styled.p`
  display: inline-block;
  padding: 5px 5px 5px 20px;
  margin: 0;
  line-height: 34px;
  font-size: 16px;
  cursor: pointer;
`;

const S_DeleteKeywordBtn = styled.svg`
  position: absolute;
  top: 10px;
  right: 10px;
  transform: scale(0.7);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
`;


interface IProps {
  keywords: Array<string>
  setKeywords(keywords: Array<string>): void;
  countList: Array<number>
  positionList: Array<Array<number>>
}

const Keyword: React.FC<IProps> = ({ keywords, setKeywords, countList, positionList }) => {

  const [cacheIdx, setCacheIdx] = useState(0)
  const [cacheCnt, setCacheCnt] = useState(0)

  const handleClickRemoveKeyword = (targetKeyword: string) => {
    setKeywords(keywords.filter(keyword => keyword !== targetKeyword))
  }

  const handleClickMovePosition = (idx: number) => {
    const index = cacheIdx === idx ? cacheIdx : idx
    const targetPositionList = positionList[index]
    const count = cacheCnt +  1 > targetPositionList.length ? 0 : cacheCnt

    ctrl.moveScrollPosition(targetPositionList[count])
    setCacheCnt(count + 1)
    setCacheIdx(index)
  }

  return (
    <section>
      {keywords.length > 0 && (
        <S_KeywordListArea>
          <S_Title>Keywords</S_Title>
            {keywords.map((keyword: string, i: number) => (
              <S_KeywordList key={i} no={i}>
                <S_Keyword onClick={handleClickMovePosition.bind(this, i)}>{keyword}</S_Keyword>
                <S_DeleteKeywordBtn width="24" height="24" fill-rule="evenodd" clip-rule="evenodd" onClick={handleClickRemoveKeyword.bind(this, keyword)}>
                  <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"></path>
                </S_DeleteKeywordBtn>
                {!!countList[i] && (
                  <span>({countList[i]})</span>
                )}
              </S_KeywordList>
            ))}
        </S_KeywordListArea>
      )}
    </section>
  )
}

export default Keyword