import styled from "@emotion/styled"

const Footer = () => {
  return (
    <$footer>
      &copy;{" "}
      <a href="https://falsy.me" target="_blank">
        falsy
      </a>
    </$footer>
  )
}

export default Footer

const $footer = styled.footer`
  color: rgb(170, 170, 170);
  font-size: 12px;
  font-weight: 500;
  position: sticky;
  top: 100%;
  padding: 10px 0px 5px 0px;
`
