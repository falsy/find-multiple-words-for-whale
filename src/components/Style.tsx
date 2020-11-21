import * as React from 'react'
import { Global, css } from '@emotion/react'

const Style: React.FC = () => {
  return (
    <Global styles={css`
      ::placeholder {color: #e2e4e3; transition: color 0.5s;}

      * {
        box-sizing: border-box;
        user-select: none;
      }
      
      body {
        padding: 15px;
        background: #f7f7f7;
      }
      
      a {
        text-decoration: none;
        color: inherit;
        letter-spacing: -0.3px;
        transition: all 0.3s;
      }
      
      a:hover {
        text-decoration: underline;
      }
    `} />
  )
}

export default Style