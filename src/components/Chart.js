import { useEffect, useState } from 'react'
import { useInterval } from '../hooks'
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
	display: flex;
	flex-direction: column;
	width: 80%;
	height: 80%;
`

const ChartContainer = styled.div`
	border: 1px solid black;
	position: relative;
	overflow: hidden;
	flex: 1;
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

const CarbonBar = styled.div`
	height: 100%;
	background: black;
	width: ${props => props.barWidth}%;
`

const ChartRow = ({ countryData, index, maxCarbon }) => {
	const barWidth = countryData.carbon * 100 / maxCarbon
	return (
		<RowContainer index={index}>
			<CountryNameColumn>{countryData.countryName}</CountryNameColumn>
			<CarbonBarColumn>
				<CarbonBar barWidth={barWidth} />
			</CarbonBarColumn>
			<CarbonColumn>{(countryData.carbon)}</CarbonColumn>
		</RowContainer>
	)
}

const Chart = ({ data }) => {
	const [year, setYear] = useState();
	const [minYear, setMinYear] = useState()
	const [maxYear, setMaxYear] = useState()
	const [filteredData, setFilteredData] = useState();
	const [maxCarbon, setMaxCarbon] = useState();

	useEffect(() => {
		if (!data) return;

		const minYear = data.flat().reduce((acc, current) => Math.min(acc, current.year), 2000);
		const maxYear = data.flat().reduce((acc, current) => Math.max(acc, current.year), 0);
		setMinYear(minYear)
		setMaxYear(maxYear)
		const filteredData = data.flat().filter((item) => item.year === year).sort((a, b) => b.carbon - a.carbon).slice(0, 20);
		const maxCarbon = filteredData.reduce((acc, current) => Math.max(acc, current.carbon), 0);
		setMaxCarbon(maxCarbon)
		setFilteredData(filteredData)


	}, [data, year])

	useInterval(() => {
		if (!year) {
			setYear(minYear)
			return;
		}
		if (year === maxYear) {
			setYear(minYear)
			return;
		}
		setYear(year + 1);
	}, 1000);

	return (
		<Container>
			{year}
			<ChartContainer>
				{filteredData && filteredData.map((item, index) => {
					return <ChartRow key={index} index={index} countryData={item} maxCarbon={maxCarbon} />
				})}
			</ChartContainer>
		</Container>
	)
}

export default Chart;