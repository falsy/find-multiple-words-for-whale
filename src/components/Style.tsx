import * as React from "react"
import { Global, css } from "@emotion/react"

const Style: React.FC = () => {
  return (
    <Global
      styles={css`
        ::placeholder {
          color: #ddd;
          transition: color 0.5s;
        }

        * {
          box-sizing: border-box;
          user-select: none;
        }

        html,
        body {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        // html {
        //   width: 400px;
        //   background: #000;
        // }

        body {
          padding: 15px;
          background: #f5f5f5;
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

        p {
          margin: 0;
        }

        #wrap {
          height: 100%;
        }
      `}
    />
  )
}

export default Style
