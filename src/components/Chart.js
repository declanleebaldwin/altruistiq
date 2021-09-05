import { useEffect, useState } from 'react'
import { useInterval } from '../hooks'
import styled from "styled-components";

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
	display: flex;
	justify-content: center;
	align-items: center;
`

const CarbonBarColumn = styled.div`
	flex: 1;
`

const CarbonColumn = styled.div`
	min-width: 180px;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding-right: 8px;
`

const CarbonBar = styled.div`
	height: 95%;
	background: rgb(${props => props.rgb}, ${props => props.rgb}, 255);
	width: ${props => props.barWidth}%;
`

const ChartHeader = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`

const ChartRow = ({ countryData, index, maxCarbon }) => {
	const barWidth = countryData.carbon * 100 / maxCarbon
	const rgb = Math.floor(countryData.countryCode * 100 / 255);
	return (
		<RowContainer index={index}>
			<CountryNameColumn>{countryData.countryName}</CountryNameColumn>
			<CarbonBarColumn>
				<CarbonBar barWidth={barWidth} rgb={rgb} />
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
	const [totalCarbon, setTotalCarbon] = useState()
	useEffect(() => {
		if (!data) return;

		const minYear = data.flat().reduce((acc, current) => Math.min(acc, current.year), 2000);
		const maxYear = data.flat().reduce((acc, current) => Math.max(acc, current.year), 0);
		const totalCarbon = data.flat().filter((item) => item.year === year).reduce((acc, current) => acc + current.carbon, 0);
		setMinYear(minYear)
		setMaxYear(maxYear)
		setTotalCarbon(totalCarbon)
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
			<ChartHeader>
				<span>{year}</span>
				<span>Total Carbon Per Year: {totalCarbon}</span>
			</ChartHeader>
			<ChartContainer>
				{filteredData && filteredData.map((item, index) => {
					return <ChartRow key={index} index={index} countryData={item} maxCarbon={maxCarbon} />
				})}
			</ChartContainer>
		</Container>
	)
}

export default Chart;