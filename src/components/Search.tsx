import * as React from 'react'
import styled from '@emotion/styled'

const S_SearchForm = styled.section`
  width: 100%;
  position: relative;
  h2 {
    font-size: 12px;
    color: #444;
    margin: 10px 0 15px;
  }
`

const S_SearchBox = styled.div`
  position: relative;
  margin-bottom: 20px;
  input {
    line-height: 28px;
    height: 50px;
    padding: 3px 15px 3px 45px;
    font-size: 20px;
    font-weight: 500;
    color: #5a6767;
    display: inline-block;
    width: 100%;
    border: 0;
    transition: 0.3s;
    &:focus {
      outline: none;
      color: #5a6767;
      box-shadow: 2px 2px 18px 0px rgba(0,0,0,0.1);
    }
  }
`

const S_SearchIcon = styled.p`
  margin: 0;
  position: absolute;
  top: 15px;
  left: 14px;
`

const S_PsText = styled.p`
  color: #656565;
  padding-left: 2px;
  margin: 8px 0 0;
  font-size: 12px;
`

interface IProps {
  setKeywords(keywords: Array<string>): void;
}

const Search: React.FC<IProps> = ({ setKeywords }) => {

  const handleKeyPressKeywords = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setKeywords(e.currentTarget.value
        .split(',')
        .slice(0, 5)
        .map((keyword: string) => keyword.trim())
        .filter(Boolean))
      e.currentTarget.value = ''
    }
  };

  return (
    <S_SearchForm>
      <h2>Search</h2>
      <S_SearchBox>
        <S_SearchIcon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#e2e4e3"/><path d="M0 0h24v24H0z" fill="none"/></svg>
        </S_SearchIcon>
        <input type="text" onKeyPress={handleKeyPressKeywords} placeholder="Nice, To, Meet, You" autoComplete="off" autoFocus={true} />
      </S_SearchBox>
      <S_PsText>- 쉼표(,)로 구분하여 최대 5개까지의 단어를 찾을 수 있습니다.</S_PsText>
    </S_SearchForm>
  )
}

export default Search