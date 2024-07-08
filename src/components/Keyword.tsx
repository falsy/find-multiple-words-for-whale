import { useState } from "react"
import styled from "@emotion/styled"
import { KEYWORDS_COLOR_SET } from "../constants"

import ctrl from "../di"

interface IProps {
  keywords: Array<string>
  setKeywords(keywords: Array<string>): void
  countList: Array<number>
  positionList: Array<Array<number>>
}

const Keyword: React.FC<IProps> = ({
  keywords,
  setKeywords,
  countList,
  positionList,
}) => {
  const [cacheIdx, setCacheIdx] = useState(0)
  const [cacheCnt, setCacheCnt] = useState(0)

  const viewKeywords = keywords
  const viewCountList = countList
  const viewPositionList = positionList
  const isSliceList = viewKeywords.length > 10

  const handleClickRemoveKeyword = (targetKeyword: string) => {
    setKeywords(keywords.filter((keyword) => keyword !== targetKeyword))
  }

  const handleClickRemoveAllKeyword = () => {
    setKeywords([])
  }

  const handleClickMovePosition = (idx: number) => {
    const index = cacheIdx === idx ? cacheIdx : idx
    const cacheIdxCount = cacheIdx === idx ? cacheCnt : 0
    const targetPositionList = viewPositionList[index]
    const count =
      cacheIdxCount + 1 > targetPositionList.length ? 0 : cacheIdxCount

    ctrl.moveScrollPosition(targetPositionList[count])
    setCacheCnt(count + 1)
    setCacheIdx(index)
  }

  return (
    <section>
      {viewKeywords.length > 0 && (
        <>
          <$title>
            <span>단어 목록</span>
            <div>
              <p onClick={handleClickRemoveAllKeyword}>
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
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                모두 지우기
              </p>
            </div>
          </$title>
          <$keywordListArea isSliceList={isSliceList}>
            {viewKeywords.map((keyword: string, i: number) => (
              <$keywordList key={i} no={i}>
                <$keyword onClick={() => handleClickMovePosition(i)}>
                  {keyword}
                </$keyword>
                <span>{viewCountList[i]}</span>
                <$deleteKeywordBtn isSliceList={isSliceList}>
                  <div onClick={() => handleClickRemoveKeyword(keyword)}>
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
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </div>
                </$deleteKeywordBtn>
              </$keywordList>
            ))}
          </$keywordListArea>
        </>
      )}
    </section>
  )
}

export default Keyword

const $title = styled.h2`
  padding-top: 30px;
  border-top: 1px solid #e6e6e6;
  font-size: 14px;
  color: #444;
  margin: 36px 0 10px 1px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (prefers-color-scheme: dark) {
    color: #ddd;
    border-color: rgb(20, 20, 20);
  }

  div {
    display: flex;
    align-items: center;
    margin-right: 2px;
    p {
      display: flex;
      align-items: center;
      font-size: 11px;
      font-weight: 400;
      height: 28px;
      background: #e6e6e6;
      padding: 0 10px 0 7px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid #ddd;

      @media (prefers-color-scheme: dark) {
        background: rgb(35, 35, 35);
        border-color: rgb(30, 30, 30);
        color: #ddd;
      }

      &:hover {
        background: #ddd;
        @media (prefers-color-scheme: dark) {
          background: rgb(25, 25, 25);
          border-color: rgb(25, 25, 25);
        }
      }
      svg {
        margin-right: 3px;
        width: 14px;
        height: auto;
      }
    }
  }
`

const $keywordListArea = styled.ul<{ isSliceList: boolean }>`
  padding: 0;
  margin: 0 2px;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    p {
      width: calc(100% - 40px);
    }
    span {
      display: inline-block;
      width: 40px;
      font-size: 14px;
      padding: 0 5px 0 5px;
      line-height: 18px;
      overflow: hidden;
      opacity: 1;
    }
    &:hover {
      span {
        transition: opacity 0.3s;
        opacity: 0;
      }
    }
  }

  ${(props) =>
    props.isSliceList &&
    `
    display: grid;
    gap: 5px;
    grid-template-columns: 1fr 1fr 1fr;
    margin-top: -1px;
    li {
      &::before {
        width: 4px;
      }
      p {
        width: calc(100% - 30px);
        font-size: 12px;
        line-height: 20px;
        padding: 5px 5px 5px 12px;
      }
      span {
        width: 30px;
        font-size: 10px;
        line-height: 12px;
      }
    }
  `}
`

const $keywordList = styled.li<{ no: number }>`
  position: relative;
  background: #fff;
  margin: 1.2% 0;

  @media (prefers-color-scheme: dark) {
    background: rgb(70, 70, 70);
    color: #ddd;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    width: 6px;
    height: 100%;
    background: ${(props) =>
      KEYWORDS_COLOR_SET[props.no % KEYWORDS_COLOR_SET.length]};
  }
  &::after {
    content: "";
    display: block;
    clear: both;
  }
  span {
    color: #bbb;
    text-align: center;
  }

  & > div {
    opacity: 0;
    transition: all 0.3s;
  }

  &:hover > div {
    opacity: 1;
  }
`

const $keyword = styled.p`
  display: inline-block;
  padding: 5px 5px 5px 20px;
  margin: 0;
  line-height: 30px;
  font-size: 14px;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const $deleteKeywordBtn = styled.div<{ isSliceList: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0px;
  right: 5px;
  width: 30px;
  height: 100%;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 26px;
    height: 26px;
    cursor: pointer;
    background: #00dc9b;
    border: 1px solid rgb(0, 209, 148);
    border-radius: 15px;
    svg {
      width: 15px;
      height: auto;
      stroke: #fff;
    }
  }

  ${(props) =>
    props.isSliceList &&
    `
      right: 0px;
      width: 30px;
      div {
        width: 20px;
        height: 20px;
        right: 0;

        svg {
          width: 12px;
        }
      }
      `}
`
