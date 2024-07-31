import { useState, useEffect } from "react"
import styled from "@emotion/styled"

interface IProps {
  searchInput: React.MutableRefObject<HTMLInputElement>
  keywords: Array<string>
  setKeywords(keywords: Array<string>): void
}

const Search = ({ searchInput, keywords, setKeywords }: IProps) => {
  const [isShiftPressed, setIsShiftPressed] = useState(false)

  const newKeywords = () => {
    const newKeywordList = searchInput.current.value
      .split(",")
      .map((keyword: string) => keyword.trim())
      .filter(Boolean)
    const newKeywords = Array.from(new Set(newKeywordList))
    setKeywords(newKeywords)
    searchInput.current.value = ""
  }

  const addKeywords = () => {
    const newKeywordList = searchInput.current.value
      .split(",")
      .map((keyword: string) => keyword.trim())
      .filter(Boolean)
    const newKeywords = Array.from(new Set(keywords.concat(newKeywordList)))
    setKeywords(newKeywords)
    searchInput.current.value = ""
  }

  const handleKeyPressKeywords = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isShiftPressed) {
        newKeywords()
      } else {
        addKeywords()
      }
    }
  }

  const handleClickAddKeyword = () => {
    addKeywords()
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShiftPressed(true)
      }
    }

    const handleKeyUp = () => {
      setIsShiftPressed(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return (
    <$searchForm>
      <h2>단어 추가</h2>
      <$searchBox>
        <input
          ref={searchInput}
          type="text"
          onKeyUp={handleKeyPressKeywords}
          placeholder="Nice, To, Meet, You"
          autoFocus={true}
          defaultValue={""}
        />
        <$searchBtn onClick={handleClickAddKeyword}>
          {isShiftPressed ? (
            <p>새로 찾기</p>
          ) : (
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
          )}
        </$searchBtn>
        <$psTextBox>
          <p>
            - [Shift]를 누르고 검색하면 기존의 단어 목록을 지우고 새로 찾습니다.
          </p>
          <p>- 쉼표로 구분하여 여러 단어를 한번에 추가할 수 있습니다.</p>
        </$psTextBox>
      </$searchBox>
    </$searchForm>
  )
}

export default Search

const $psTextBox = styled.div`
  padding-top: 15px;
  line-height: 20px;
  @media (prefers-color-scheme: dark) {
    color: #ddd;
  }
`

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

    @media (prefers-color-scheme: dark) {
      color: #ddd;
      span {
        color: #bbb;
      }
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
      @media (prefers-color-scheme: dark) {
        color: #fff;
      }
    }

    @media (prefers-color-scheme: dark) {
      background: rgb(70, 70, 70);
      border-color: rgb(35, 35, 35);
      color: #ddd;
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
    background: #00c88d;
    border-color: #00c88d;
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

// const $alertMessage = styled.div`
//   background: #fff7df;
//   color: #cda126;
//   border: 1px solid #f7e5ad;
//   padding: 8px 8px 8px 12px;
//   border-radius: 6px;
//   line-height: 20px;
//   display: flex;
//   align-items: center;
//   svg:first-of-type {
//     width: 18px;
//     height: auto;
//     margin-right: 7px;
//   }
//   p {
//     font-size: 11px;
//     width: 100%;
//   }
//   p + svg {
//     width: 18px;
//     height: auto;
//     cursor: pointer;
//   }
// `
