import * as React from 'react'
import { useState, useEffect } from "react"
import styled from '@emotion/styled'
import { KEYWORDS_COLOR_SET } from '../constants'

import ctrl from '../di'

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
        <>
          <S_Title>Keywords</S_Title>
          <S_KeywordListArea keywordLen={keywords.length}>
              {keywords.map((keyword: string, i: number) => (
                <S_KeywordList key={i} no={i}>
                  <S_Keyword onClick={handleClickMovePosition.bind(this, i)}>{keyword}</S_Keyword>
                  {!!countList[i] && (
                    <span>({countList[i]})</span>
                  )}
                  <S_DeleteKeywordBtn width="24" height="24" fill-rule="evenodd" clip-rule="evenodd" onClick={handleClickRemoveKeyword.bind(this, keyword)}>
                    <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"></path>
                  </S_DeleteKeywordBtn>
                </S_KeywordList>
              ))}
          </S_KeywordListArea>
        </>
      )}
    </section>
  )
}

export default Keyword


const S_Title = styled.h2`
  padding-top: 40px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #444;
  margin: 46px 0 15px;
`

const S_KeywordListArea = styled.ul<{keywordLen: number}>`
  padding: 0;
  list-style: none;

  span {
    float: left;
    padding: 5px 0;
    margin: 0;
    line-height: 34px;
    font-size: 14px;
    text-align: center;
    width: 20%;
  }

  ${props => props.keywordLen > 10 && `
    display: flex;
    flex-wrap: wrap;
    margin: 0 -1%;  
    li {
      flex-basis: 31%;
      min-width: 31%;
      margin: 1%;
      p {
        font-size: 13px;
        line-height: 20px;
        padding: 5px 5px 5px 15px;
        width: 75px;
      }
      span {
        padding: 5px 5px 5px 20px;
        width: 25px;
        font-size: 10px;
        padding: 5px 0;
        line-height: 20px;
        overflow: hidden;
      }
      svg {
        transform: scale(0.5);
      }
    }
  `}
`

const S_KeywordList = styled.li<{no: number}>`
  position: relative;
  background: #fff;
  margin-bottom: 2%;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    width: 6px;
    height: 100%;
    background: ${props => KEYWORDS_COLOR_SET[props.no % 10]};
  }
  &:hover svg {
    opacity: 1;
  }
  &::after {
    content: '';
    display: block;
    clear: both;
  }
`

const S_Keyword = styled.p`
  display: inline-block;
  padding: 5px 5px 5px 20px;
  margin: 0;
  line-height: 34px;
  font-size: 16px;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  float: left;
  width: 80%;
`;

const S_DeleteKeywordBtn = styled.svg`
  position: absolute;
  top: -10px;
  right: -10px;
  transform: scale(0.7);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
`;