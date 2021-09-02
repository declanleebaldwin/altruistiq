import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: red;
`;

const App = () => {
  return (
    <Container>
      <div style={{ fontWeight: 300 }}>hello world</div>
      <div style={{ fontWeight: 400 }}>hello world</div>
      <div style={{ fontWeight: 500 }}>hello world</div>
    </Container>
  );
};

export default App;
