import styled, { keyframes } from "styled-components";


const loadingspin = keyframes`
	100% {
			transform: rotate(360deg)
	}
`
const LoadingSpinner = styled.div`
	pointer-events: none;
	width: 2.5em;
	height: 2.5em;
	border: 0.4em solid transparent;
	border-color: #eee;
	border-top-color: #3E67EC;
	border-radius: 50%;
	animation: ${loadingspin} 1s linear infinite;
`
const Spinner = () => {
  return <LoadingSpinner />
}

export default Spinner;