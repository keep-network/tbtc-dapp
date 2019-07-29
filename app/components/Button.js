import styled from 'styled-components'
import { Blue } from '../styles'

const Button = styled.button`
    padding: 1em;
    background: ${Blue};
    color: white;

    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #ffffff;

    :hover {
        cursor: pointer;
        opacity: 0.8;
        color: white;
    }
`

export { Button }