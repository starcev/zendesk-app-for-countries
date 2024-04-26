import React, { Component } from 'react'
import styled from 'styled-components'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { Dropdown, Field, Menu, Item, Select, Label } from '@zendeskgarden/react-dropdowns'
import axios from 'axios';
import _ from 'lodash';

import government from '../../../images/government.png'
import area from '../../../images/area.png'
import population from '../../../images/population.png'
import location from '../../../images/location.png'
import language from '../../../images/language.png'
import phone from '../../../images/phone.png'
import currency from '../../../images/currency.png'

const ItemRow = styled(Row)`
	padding-left: 10px;
	padding-top:10px;
	&:nth-of-type(2) {
		padding-top: 28px;
	}
`;

const TextCol = styled(Col).attrs(() => ({
	size: 9,
	alignSelf: 'center'
}))``;

const ImageCol = styled(Col).attrs(() => ({
	size: 2,
	alignSelf: 'center'
}))``;

class CountriesApp extends Component {

    constructor() {
			super()

			this.state = {
				countries: [],
				selectedCountryIndex: -1
			}
    }

		showImage() {
			var flag = this.state.countries[this.state.selectedCountryIndex].flag
			this.props.client.invoke('instances.create', {
				location: 'modal',
				url: flag,
				size: { // optional
					width: '340px',
					height: '215px'
				}
			})
		}

		async componentDidMount() {
			const data = await axios.get('https://restcountries.com/v3.1/all')

			var countries = []
			for (var item in data.data) {
				var item = data.data[item]
				var code = item.cca3;
				var name = item.name['common']
				var fullName = item.name['official']
				var capital = _.join(item.capital, ', ')
				var area = item.area
				var population = item.population
				var region = item.subregion
				var languages = _.join(_.values(item.languages), ', ')
				var currencies = _.join(_.map(_.values(item.currencies), 'name'), ', ')
				var flag = item.flags["png"]
				var googleMap = item.maps['googleMaps']

				if (item.idd.suffixes && item.idd.suffixes.length == 1) {
					var areaCode = item.idd.root + _.first(item.idd.suffixes)
				}
				else {
					var areaCode = item.idd.root
				}

				countries.push({
					code: code,
					name: name,
					fullName: fullName,
					capital: capital,
					area: area,
					population: population,
					region: region,
					languages: languages,
					areaCode: areaCode,
					currencies: currencies,
					flag: flag,
					googleMap: googleMap
				})
			}

			countries = _.sortBy(countries, 'name');
			this.setState({ countries: countries})
		}

		selectedCountryChanged = (selectedCountry) => {
			this.setState({
				selectedCountryIndex: selectedCountry
			})
		}

    render() {
			var countries = this.state.countries;
			var index = this.state.selectedCountryIndex;
			return (
				<ThemeProvider theme={{ ...DEFAULT_THEME }}>
					<Grid>
						<Row>
							<Col>
								<Dropdown
									selectedItem={this.state.countries[this.state.selectedCountryIndex]}
									onSelect={this.selectedCountryChanged.bind(this)}
								>
									<Field>
										<Label>Countries</Label>
										<Select>{this.state.selectedCountryIndex !== -1 ? this.state.countries[this.state.selectedCountryIndex].name : null}</Select>
									</Field>
									<Menu>
										{this.state.countries.map((country, index) => (
											<Item key={country.code} value={index}>
												{country.name}
											</Item>
										))}
									</Menu>
								</Dropdown>
							</Col>
						</Row>
						{this.state.selectedCountryIndex !== -1 ?
							<React.Fragment>
								<ItemRow>
									<ImageCol onClick={this.showImage.bind(this)} style={{'cursor': 'pointer'}}>
										<img src={countries[index].flag}/>
									</ImageCol>
									<TextCol>
									<b><a href={countries[index].googleMap} target='_blank'>{countries[index].fullName}</a></b>
									</TextCol>
								</ItemRow>
								<ItemRow>
									<ImageCol>
										<img src={government} />
									</ImageCol>
									<TextCol>
										<b>{countries[index].capital}</b>
									</TextCol>
								</ItemRow>
								<ItemRow>
									<ImageCol>
										<img src={area} />
									</ImageCol>
									<TextCol>
										<b>{countries[index].area} km<sup>2</sup></b>
									</TextCol>
								</ItemRow>
								<ItemRow>
									<ImageCol>
										<img src={population} />
									</ImageCol>
									<TextCol >
										<b>{countries[index].population}</b>
									</TextCol>
								</ItemRow>
								<ItemRow>
									<ImageCol>
										<img src={location} />
									</ImageCol>
									<TextCol >
										<b>{countries[index].region}</b>
									</TextCol>
								</ItemRow>
								<ItemRow>
									<ImageCol>
										<img src={language} />
									</ImageCol>
									<TextCol >
										<b>{countries[index].languages}</b>
									</TextCol>
								</ItemRow>
								<ItemRow>
									<ImageCol>
										<img src={phone} />
									</ImageCol>
									<TextCol >
										<b>{countries[index].areaCode}</b>
									</TextCol>
								</ItemRow>
								<ItemRow>
									<ImageCol>
										<img src={currency} />
									</ImageCol>
									<TextCol >
										<b>{countries[index].currencies}</b>
									</TextCol>
								</ItemRow>
								</React.Fragment>
						: null}
					</Grid>
      	</ThemeProvider>
		)
    }
}

export default CountriesApp;