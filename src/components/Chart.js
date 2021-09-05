import { useEffect, useState } from 'react'
import styled from "styled-components";

// const data = [
// 	[
// 		{ countryCode: 1, countryName: 'Armenia', carbon: 0.1, year: 2000 },
// 		{ countryCode: 1, countryName: 'Armenia', carbon: 2, year: 2001 },
// 		{ countryCode: 1, countryName: 'Armenia', carbon: 3, year: 2002 }
// 	],
// 	[
// 		{ countryCode: 2, countryName: "Afghanistan", carbon: 10, year: 2000 },
// 		{ countryCode: 2, countryName: "Afghanistan", carbon: 3, year: 2001 },
// 		{ countryCode: 2, countryName: "Afghanistan", carbon: 4, year: 2002 }
// 	],
// 	[
// 		{ countryCode: 3, countryName: "Albania", carbon: 0.003, year: 2000 },
// 		{ countryCode: 3, countryName: "Albania", carbon: 4, year: 2001 },
// 		{ countryCode: 3, countryName: "Albania", carbon: 5, year: 2002 }
// 	],
// 	[
// 		{ countryCode: 4, countryName: "Australia", carbon: null, year: 2000 },
// 		{ countryCode: 4, countryName: "Australia", carbon: 7, year: 2001 },
// 		{ countryCode: 4, countryName: "Australia", carbon: 1, year: 2002 }
// 	],
// ]


const Container = styled.div`
	width: 80%;
	height: 80%;
	border: 1px solid black;
	position: relative;
	overflow: hidden;
`
const RowContainer = styled.div`
	position: absolute;
	top:0;
	left:0;
	transform: translateY(${props => (props.index) * 100}%);
	transition: all 0.2s ease;
	display: flex;
	width: 100%;
	justify-content: space-between;
	height: 5%;
`

const CountryNameColumn = styled.div`
	min-width: 230px;
	background: red;
	display: flex;
	justify-content: center;
	align-items: center;
`

const CarbonBarColumn = styled.div`
	flex: 1;
	background: blue;
`

const CarbonColumn = styled.div`
	min-width: 180px;
	background: green;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding-right: 8px;
`

const ChartRow = ({ countryData, year, dataByYear }) => {
	const yearCountryData = countryData.find(item => item.year === year)
	if (!yearCountryData) return <></>
	const index = dataByYear[year].findIndex((item) => item.countryCode === yearCountryData.countryCode);
	if (!index && index !== 0 && index > 20) return <></>
	return (
		<RowContainer index={index}>
			<CountryNameColumn>{yearCountryData.countryName}</CountryNameColumn>
			<CarbonBarColumn>
			</CarbonBarColumn>
			<CarbonColumn>{(yearCountryData.carbon)}</CarbonColumn>
		</RowContainer>
	)
}

const Chart = ({ data }) => {
	const [year, setYear] = useState(2000);
	const [minYear, setMinYear] = useState()
	const [maxYear, setMaxYear] = useState()
	const [dataByYear, setDataByYear] = useState()

	useEffect(() => {
		if (!data) return;
		const yearsArray = []
		const dataByYear = {}
		data.forEach((countryDataArray) => {
			countryDataArray.forEach((yearData) => {
				// add to dataByYear
				const yearString = yearData.year.toString()
				if (!dataByYear[yearString]) {
					dataByYear[yearString] = []
				}
				dataByYear[yearString].push(yearData)
				if (!yearsArray.includes(yearData.year)) {
					yearsArray.push(yearString)
				}
			})
		})

		const minYear = Math.min.apply(Math, yearsArray);
		const maxYear = Math.max.apply(Math, yearsArray);
		setMinYear(minYear)
		setMaxYear(maxYear);
		Object.keys(dataByYear).forEach((year) => {
			dataByYear[year] = dataByYear[year].sort((a, b) => b.carbon - a.carbon)
		})


		setDataByYear(dataByYear)
	}, [data])

	return (
		<>
			{year}
			<div onClick={() => setYear(year + 1)}>Increase year</div>
			<div onClick={() => setYear(year - 1)}>Decrease year</div>
			<Container>
				{data && dataByYear && data.map((item, index) => {
					return <ChartRow key={index} countryData={item} year={year} dataByYear={dataByYear} />
				})}
			</Container>
		</>
	)
}

export default Chart;