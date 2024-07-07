import { useState } from "react"
import styled from "@emotion/styled"

interface IProps {
  keywords: Array<string>
  setKeywords(keywords: Array<string>): void
}

const Search = ({ keywords, setKeywords }: IProps) => {
  const [keywordString, setKeywordString] = useState("")
  const [alertMessage, setAlertMessage] = useState("")

  const handleOnChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordString(e.target.value)
  }

  const addKeywords = () => {
    let isOneSyllable = false
    const newKeywordList = keywordString
      .split(",")
      .map((keyword: string) => {
        const trimKeyword = keyword.trim()
        if (trimKeyword.length === 1 && /[^가-힣]/g.test(trimKeyword)) {
          isOneSyllable = true
          return ""
        }
        return keyword
      })
      .filter(Boolean)
    const newKeywords = Array.from(new Set(keywords.concat(newKeywordList)))
    setKeywords(newKeywords)
    setKeywordString("")
    if (isOneSyllable) {
      setAlertMessage(
        "영문, 숫자, 특수 문자는 두 글자 이상부터 추가할 수 있습니다."
      )
    }
  }

  const handleKeyPressKeywords = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setAlertMessage("")
      addKeywords()
    }
  }

  const handleClickAddKeyword = () => {
    setAlertMessage("")
    addKeywords()
  }

  const handleClickAlert = () => {
    setAlertMessage("")
  }

  return (
    <$searchForm>
      <h2>
        단어 추가
        <span>(쉼표","로 구분하여 여러 단어를 추가할 수도 있습니다.)</span>
      </h2>
      <$searchBox>
        <input
          type="text"
          onChange={handleOnChangeKeyword}
          onKeyPress={handleKeyPressKeywords}
          placeholder="Nice, To, Meet, You"
          autoComplete="off"
          autoFocus={true}
          value={keywordString}
        />
        <$searchBtn onClick={handleClickAddKeyword}>
          <p>
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            추가
          </p>
        </$searchBtn>
      </$searchBox>
      {alertMessage && (
        <$alertMessage>
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
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p>{alertMessage}</p>
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
            onClick={handleClickAlert}
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </$alertMessage>
      )}
    </$searchForm>
  )
}

export default Search

const $searchForm = styled.section`
  width: 100%;
  position: relative;
  h2 {
    font-size: 14px;
    color: #444;
    margin: 10px 0 15px 1px;
    span {
      display: inline-block;
      margin-left: 5px;
      color: #656565;
      font-weight: 400;
      font-size: 12px;
    }
  }
`

const $searchBox = styled.div`
  position: relative;
  margin-bottom: 10px;
  input {
    line-height: 28px;
    height: 50px;
    padding: 3px 100px 3px 25px;
    font-size: 18px;
    font-weight: 500;
    color: #5a6767;
    display: inline-block;
    width: 100%;
    border: 1px solid #e6e6e6;
    transition: 0.3s;
    border-radius: 30px;
    &:focus {
      outline: none;
      color: #5a6767;
      box-shadow: 2px 2px 18px 0px rgba(0, 0, 0, 0.1);
    }
  }
`

const $searchBtn = styled.div`
  width: 80px;
  height: 38px;
  background: #00dc9b;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 6px;
  right: 6px;
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid rgb(0, 209, 148);
  &:hover {
    background: rgb(0, 209, 148);
  }
  p {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #fff;
    text-shadow: rgba(7, 92, 67, 0.3) 0px 0px 1px;
    svg {
      display: inline-block;
      margin-right: 3px;
      width: 16px;
      height: auto;
      stroke: #fff;
      line {
        box-shadow: rgba(7, 92, 67, 1) 0px 0px 1px;
      }
    }
  }
`

const $alertMessage = styled.div`
  background: #fff7df;
  color: #cda126;
  border: 1px solid #f7e5ad;
  padding: 8px 8px 8px 12px;
  border-radius: 6px;
  line-height: 20px;
  display: flex;
  align-items: center;
  svg:first-of-type {
    width: 18px;
    height: auto;
    margin-right: 7px;
  }
  p {
    font-size: 11px;
    width: 100%;
  }
  p + svg {
    width: 18px;
    height: auto;
    cursor: pointer;
  }
`
