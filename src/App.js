import { useState } from 'react'
import styled from "styled-components";
import { useFetchCountryData } from './hooks'
import { Spinner } from './components';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Error = styled.div`
  font-weight: 500;
`

const App = () => {
  const { data, loading, error } = useFetchCountryData();
  return (
    <Container>
      {loading && <Spinner />}
      {error && !loading && <Error>Oh no, somthing went wrong!</Error>}
    </Container>
  );
};

export default App;
