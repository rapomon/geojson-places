const fs = require('fs');
const path = require('path');
const clone = require('just-clone');
const { pointInPolygon, translateNames, translateName } = require('./utils');
const { admin1, continents, countries, countryGroupings, regions } = require('./data');

const dataPath = path.join(__dirname, './../data/');

/**
 * Get information from coordinates
 */
const reverseGeolocation = (lat, lng, dataType = null) => {
    if(typeof lat !== 'number' || typeof lng !== 'number') {
        return new Error('Wrong coordinates (lat: ' + lat + ',lng: ' + lng + ')');
    }

    let point = [lng, lat];
    let i = 0;
    let found = false;
    const countries = admin1.features;
    for(const country of countries) {
        if(country.geometry.type === 'Polygon') {
            found = pointInPolygon(country.geometry.coordinates[0], point);
            if(found && country.geometry.coordinates.length > 1) {
                // Exclude holes
                for(let j = 1; j < country.geometry.coordinates.length; j++) {
                    if(pointInPolygon(country.geometry.coordinates[j], point)) {
                        found = false;
                        break;
                    }
                }
            }
        } else if(country.geometry.type === 'MultiPolygon') {
            for(const coords of country.geometry.coordinates) {
                found = pointInPolygon(coords[0], point);
                if(found && coords.length > 1) {
                    // Exclude holes
                    for(let j = 1; j < coords.length; j++) {
                        if(pointInPolygon(coords[j], point)) {
                            found = false;
                            break;
                        }
                    }
                }
                if(found) break;
            }
        }
        if(found) break;
        i++;
    }

    let result = null;
    if(found) {
        if(dataType === 'raw') {
            result = {
                type: 'FeatureCollection',
                features: [ clone(countries[i]) ]
            };
        } else {
            let props = countries[i].properties;
            let properties = {};
            properties.continent_code = props.cont_code;
            properties.country_a2 = props.iso_a2;
            properties.country_a3 = props.adm0_a3;
            properties.region_code = props.region_code;
            if(props.iso_3166_2 !== '' && !props.iso_3166_2.endsWith('~')) {
                properties.state_code = props.iso_3166_2;
            }
            if(dataType === 'geojson') {
                result = {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties,
                        geometry: clone(countries[i].geometry)
                    }]
                };
            } else {
                result = clone(properties);
            }
        }
    }

    return result;
};

const lookUp = (lat, lon) => {
    return reverseGeolocation(lat, lon);
};

const lookUpRaw = (lat, lon) => {
    return reverseGeolocation(lat, lon, 'raw');
};

const lookUpGeoJSON = (lat, lon) => {
    return reverseGeolocation(lat, lon, 'geojson');
};

const getContinentGeoJSONByCode = (continent_code, simplified = false) => {
    try {
        const filePath = `/continents/${continent_code}${simplified ? '-simplified' : ''}.json`;
        const continent = fs.readFileSync(path.join(dataPath, filePath));
        return JSON.parse(continent);
    } catch(e) {
        // console.error(e);
        return null;
    }
};

const getCountryGeoJSONByAlpha2 = (alpha2) => {
    try {
        const country = fs.readFileSync(path.join(dataPath, `/countries/${alpha2}.json`));
        return JSON.parse(country);
    } catch(e) {
        // console.error(e);
        return null;
    }
};

const getCountryGeoJSONByAlpha3 = (alpha3) => {
    let alpha2 = countryAlpha3ToAlpha2(alpha3);
    return getCountryGeoJSONByAlpha2(alpha2);
};

const getCountryGroupingGeoJSONByCode = (grouping_code, simplified = false) => {
    try {
        const filePath = `/country-groupings/${grouping_code}${simplified ? '-simplified' : ''}.json`;
        const countryGrouping = fs.readFileSync(path.join(dataPath, filePath));
        return JSON.parse(countryGrouping);
    } catch(e) {
        // console.error(e);
        return null;
    }
};

const getRegionGeoJSONByCode = (region_code) => {
    try {
        const region = fs.readFileSync(path.join(dataPath, `/regions/${region_code}.json`));
        return JSON.parse(region);
    } catch(e) {
        // console.error(e);
        return null;
    }
};

const getStateGeoJSONByCode = (state_code) => {
    const state = admin1.features.find(f => f.properties.iso_3166_2 === state_code);
    if(state) {
        let _state = clone(state);
        _state.properties = {
            country_a2: state.properties.iso_a2,
            region_code: state.properties.region_code,
            state_code: state_code
        };
        return _state;
    } else {
        return null;
    }
};

const getContinents = (locale = null) => {
    let _continents = clone(continents);
    translateNames(_continents, locale, 'continent_name');
    return _continents;
};

const getContinentByCode = (continent_code, locale = null) => {
    let continent = clone(continents.find(item => item.continent_code === continent_code));
    translateName(continent, locale, 'continent_name');
    return continent;
};

const isValidContinentCode = (code) => {
    return continents.find(item => item.continent_code === code) ? true : false;
};

const getCountries = (locale = null) => {
    let _countries = clone(countries);
    translateNames(_countries, locale, 'country_name');
    return _countries;
};

const getCountryByAlpha2 = (alpha2, locale = null) => {
    let country = clone(countries.find(item => item.country_a2 === alpha2));
    translateName(country, locale, 'country_name');
    return country;
};

const getCountryByAlpha3 = (alpha3, locale = null) => {
    let alpha2 = countryAlpha3ToAlpha2(alpha3);
    return getCountryByAlpha2(alpha2, locale);
};

const countryAlpha2ToAlpha3 = (alpha2) => {
    const country = countries.find(item => item.country_a2 === alpha2);
    return country ? country.country_a3 : null;
};

const countryAlpha3ToAlpha2 = (alpha3) => {
    const country = countries.find(item => item.country_a3 === alpha3);
    return country ? country.country_a2 : null;
};

const isValidCountryAlpha2 = (country_a2) => {
    return countries.find(item => item.country_a2 === country_a2) ? true : false;
};

const isValidCountryAlpha3 = (country_a3) => {
    return countries.find(item => item.country_a3 === country_a3) ? true : false;
};

const getCountriesByContinentCode = (continent_code, locale = null) => {
    let continent = continents.find(item => item.continent_code === continent_code);
    if(!continent || !continent.countries) return null;
    let _countries = clone(countries.filter(item => continent.countries.includes(item.country_a2)));
    translateNames(_countries, locale, 'country_name');
    return _countries;
};

const getCountriesByCountryGroupingCode = (grouping_code, locale = null) => {
    let countryGrouping = countryGroupings.find(item => item.grouping_code === grouping_code);
    if(!countryGrouping || !countryGrouping.countries) return null;
    let _countries = clone(countries.filter(item => countryGrouping.countries.includes(item.country_a2)));
    translateNames(_countries, locale, 'country_name');
    return _countries;
};

const getCountryGroupings = (locale = null) => {
    let _countryGroupings = clone(countryGroupings);
    translateNames(_countryGroupings, locale, 'grouping_name');
    _countryGroupings.forEach(c => delete c.i18n);
    return _countryGroupings;
};

const getCountryGroupingByCode = (grouping_code, locale = null) => {
    let countryGrouping = clone(countryGroupings.find(item => item.grouping_code === grouping_code));
    translateName(countryGrouping, locale, 'grouping_name');
    return countryGrouping;
};

const isValidCountryGroupingCode = (grouping_code) => {
    return countryGroupings.find(item => item.grouping_code === grouping_code) ? true : false;
};

const getRegions = (locale = null) => {
    let _regions = clone(regions);
    translateNames(_regions, locale, 'region_name');
    _regions.forEach(region => delete region.states);
    return _regions;
};

const getRegionsAndStates = (locale = null) => {
    let _regions = clone(regions);
    translateNames(_regions, locale, 'region_name');
    _regions.forEach(region => translateNames(region.states, locale, 'state_name'));
    return _regions;
};

const getRegionsByCountryAlpha2 = (alpha2, locale = null) => {
    let _regions = clone(regions.filter(item => item.country_a2 === alpha2));
    translateNames(_regions, locale, 'region_name');
    _regions.forEach(region => delete region.states);
    return _regions;
};

const getRegionsByCountryAlpha3 = (alpha3, locale = null) => {
    let alpha2 = countryAlpha3ToAlpha2(alpha3);
    return getRegionsByCountryAlpha2(alpha2, locale);
};

const getRegionByCode = (region_code, locale = null) => {
    let region = clone(regions.find(item => item.region_code === region_code));
    if(!region) return region;
    translateName(region, locale, 'region_name');
    translateNames(region.states, locale, 'state_name');
    return region;
};

const isValidRegionCode = (region_code) => {
    return regions.find(item => item.region_code === region_code) ? true : false;
};

const getStatesByRegionCode = (region_code, locale = null) => {
    let region = clone(regions.find(item => item.region_code === region_code));
    if(!region) return region;
    translateNames(region.states, locale, 'state_name');
    return region.states;
};

const getStateByCode = (state_code, locale = null) => {
    let found;
    for(let i = 0; i < regions.length; i++) {
        const region = regions[i];
        if(region.states) {
            found = region.states.find(item => item.state_code === state_code);
            if(found) break;
        }
    }
    let state;
    if(found) {
        state = clone(found);
        translateName(state, locale, 'state_name');
    }
    return state;
};

const isValidStateCode = (state_code) => {
    let found;
    for(let i = 0; i < regions.length; i++) {
        const region = regions[i];
        if(region.states) {
            found = region.states.find(item => item.state_code === state_code);
            if(found) break;
        }
    }
    return found ? true : false;
};

module.exports = {
    lookUp,
    lookUpRaw,
    lookUpGeoJSON,
    getContinentGeoJSONByCode,
    getCountryGeoJSONByAlpha2,
    getCountryGeoJSONByAlpha3,
    getCountryGroupingGeoJSONByCode,
    getRegionGeoJSONByCode,
    getStateGeoJSONByCode,
    getContinents,
    getContinentByCode,
    isValidContinentCode,
    getCountries,
    getCountryByAlpha2,
    getCountryByAlpha3,
    countryAlpha2ToAlpha3,
    countryAlpha3ToAlpha2,
    isValidCountryAlpha2,
    isValidCountryAlpha3,
    getCountriesByContinentCode,
    getCountriesByCountryGroupingCode,
    getCountryGroupings,
    getCountryGroupingByCode,
    isValidCountryGroupingCode,
    getRegions,
    getRegionsAndStates,
    getRegionsByCountryAlpha2,
    getRegionsByCountryAlpha3,
    getRegionByCode,
    isValidRegionCode,
    getStatesByRegionCode,
    getStateByCode,
    isValidStateCode
};
