import * as React from "react"
import { Global, css } from "@emotion/react"

const Style: React.FC = () => {
  return (
    <Global
      styles={css`
        ::placeholder {
          color: #ddd;
          transition: color 0.5s;
          @media (prefers-color-scheme: dark) {
            color: #666;
          }
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

        body {
          padding: 15px;
          background: #f5f5f5;

          @media (prefers-color-scheme: dark) {
            background: rgb(41, 41, 41);
          }
        }

        a {
          text-decoration: none;
          color: inherit;
          letter-spacing: -0.3px;
          transition: all 0.3s;
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
