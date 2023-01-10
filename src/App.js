import styled from "styled-components";
import { useFetchCountryData } from './hooks'
import { Spinner } from './components';
import { useState } from "react";

const Chart = styled.div`
  position: relative;
`;

const Row = styled.div`
  position: absolute;
  top: ${props => props.index * 20}px;
  transition: all linear 0.5s;
`

const App = () => {
  const [year, setYear] = useState(1961);
  const data = useFetchCountryData();
  if (data === undefined) return <Spinner />;

  const increaseYear = (newYear) => {
    if (newYear === 2019) return;
    setYear(newYear)
    setTimeout(() => {
      increaseYear(newYear + 1);
    }, 1000)
  }

  const onStart = () => {
    console.log('onStart')
    increaseYear(year + 1)
  }
  return (
    <div>
      <h1 onClick={onStart}>Start</h1>
      <h1>Year: {year}</h1>
      <Chart>
        {data.sort((countryA, countryB) => {
          const countryACurrentYear = countryA.find((yearObject => yearObject.year === year));
          const countryBCurrentYear = countryB.find((yearObject => yearObject.year === year));
          if (!countryACurrentYear?.carbon && !countryBCurrentYear?.carbon) return 0;
          if (countryACurrentYear?.carbon && !countryBCurrentYear?.carbon) return -1;
          if (countryBCurrentYear?.carbon && !countryACurrentYear?.carbon) return 1;
          return countryBCurrentYear?.carbon - countryACurrentYear.carbon
        }).map((country, i) => {
          const selectedYearArray = country.find((yearObject => yearObject.year === year));
          return <Row index={i} key={selectedYearArray?.countryCode}>{selectedYearArray?.countryName} {selectedYearArray?.carbon}</Row>
        })}
      </Chart>
    </div>
  )
};

export default App;
