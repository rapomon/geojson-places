const test = require('tape');
const {
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
    getRegionsByCountryAlpha2,
    getRegionsByCountryAlpha3,
    getRegionByCode,
    isValidRegionCode,
    getStatesByRegionCode,
    getStateByCode,
    isValidStateCode
} = require('../src');

test('Validate lookUp (Valladolid, Spain)', function(t) {
    const result = lookUp(41.652349, -4.728602);
    // console.log('lookUp (Valladolid, Spain)', result);
    t.equal(result.continent_code, 'EU', 'result.continent_code should be strictly equal to "EU"');
    t.equal(result.country_a2, 'ES', 'result.country_a2 should be strictly equal to "ES"');
    t.equal(result.country_a3, 'ESP', 'result.country_a3 should be strictly equal to "ESP"');
    t.equal(result.region_code, 'ES-CL', 'result.region_code should be strictly equal to "ES-CL"');
    t.equal(result.state_code, 'ES-VA', 'result.state_code should be strictly equal to "ES-VA"');
    t.end();
});

test('Validate lookUp (Madrid, Spain)', function(t) {
    const result = lookUp(40.4167047, -3.7035825);
    // console.log('lookUp (Madrid, Spain)', result);
    t.equal(result.continent_code, 'EU', 'result.continent_code should be strictly equal to "EU"');
    t.equal(result.country_a2, 'ES', 'result.country_a2 should be strictly equal to "ES"');
    t.equal(result.country_a3, 'ESP', 'result.country_a3 should be strictly equal to "ESP"');
    t.equal(result.region_code, 'ES-MD', 'result.region_code should be strictly equal to "ES-MD"');
    t.equal(result.state_code, 'ES-M', 'result.state_code should be strictly equal to "ES-M"');
    t.end();
});

test('Validate lookUp null (water)', function(t) {
    const result = lookUp(0.0, 0.0);
    // console.log('lookUp null (water)', result);
    t.equal(result, null, 'result should be strictly equal to null');
    t.end();
});

test('Validate lookUpGeoJSON (Valladolid, Spain)', function(t) {
    const result = lookUpGeoJSON(41.652349, -4.728602);
    // console.log('lookUpGeoJSON (Valladolid, Spain)', JSON.stringify(result, null, 2));
    t.equal(result.type, 'FeatureCollection', 'result.type should be strictly equal to "FeatureCollection"');
    t.equal(result.features[0].type, 'Feature', 'result.features[0].type should be strictly equal to "Feature"');
    t.equal(result.features[0].properties.continent_code, 'EU', 'result.features[0].properties.continent_code should be strictly equal to "EU"');
    t.equal(result.features[0].properties.country_a2, 'ES', 'result.features[0].properties.country_a2 should be strictly equal to "ES"');
    t.equal(result.features[0].properties.country_a3, 'ESP', 'result.features[0].properties.country_a3 should be strictly equal to "ESP"');
    t.equal(result.features[0].properties.region_code, 'ES-CL', 'result.features[0].properties.region_code should be strictly equal to "ES-CL"');
    t.equal(result.features[0].properties.state_code, 'ES-VA', 'result.features[0].properties.state_code should be strictly equal to "ES-VA"');
    t.end();
});

test('Validate lookUpGeoJSON (Madrid, Spain)', function(t) {
    const result = lookUpGeoJSON(40.4167047, -3.7035825);
    // console.log('lookUpGeoJSON (Madrid, Spain)', JSON.stringify(result, null, 2));
    t.equal(result.type, 'FeatureCollection', 'result.type should be strictly equal to "FeatureCollection"');
    t.equal(result.features[0].type, 'Feature', 'result.features[0].type should be strictly equal to "Feature"');
    t.equal(result.features[0].properties.continent_code, 'EU', 'result.features[0].properties.continent_code should be strictly equal to "EU"');
    t.equal(result.features[0].properties.country_a2, 'ES', 'result.features[0].properties.country_a2 should be strictly equal to "ES"');
    t.equal(result.features[0].properties.country_a3, 'ESP', 'result.features[0].properties.country_a3 should be strictly equal to "ESP"');
    t.equal(result.features[0].properties.region_code, 'ES-MD', 'result.features[0].properties.region_code should be strictly equal to "ES-MD"');
    t.equal(result.features[0].properties.state_code, 'ES-M', 'result.features[0].properties.state_code should be strictly equal to "ES-M"');
    t.end();
});

test('Validate lookUpRaw (Valladolid, Spain)', function(t) {
    const result = lookUpRaw(41.652349, -4.728602);
    // console.log('lookUpRaw (Valladolid, Spain)', result);
    t.equal(result.features[0].properties.cont_code, 'EU', 'result.cont_code should be strictly equal to "ES"');
    t.equal(result.features[0].properties.cont_name, 'Europe', 'result.cont_name should be strictly equal to "Spain"');
    t.equal(result.features[0].properties.iso_a2, 'ES', 'result.iso_a2 should be strictly equal to "ES"');
    t.equal(result.features[0].properties.admin, 'Spain', 'result.admin should be strictly equal to "Spain"');
    t.equal(result.features[0].properties.adm1_code, 'ESP-5850', 'result.adm1_code should be strictly equal to "ESP-5850"');
    t.equal(result.features[0].properties.name, 'Valladolid', 'result.name should be strictly equal to "Valladolid"');
    t.end();
});

test('Validate lookUpRaw (Madrid, Spain)', function(t) {
    const result = lookUpRaw(40.4167047, -3.7035825);
    // console.log('lookUpRaw (Madrid, Spain)', result);
    t.equal(result.features[0].properties.cont_code, 'EU', 'result.cont_code should be strictly equal to "ES"');
    t.equal(result.features[0].properties.cont_name, 'Europe', 'result.cont_name should be strictly equal to "Spain"');
    t.equal(result.features[0].properties.iso_a2, 'ES', 'result.iso_a2 should be strictly equal to "ES"');
    t.equal(result.features[0].properties.admin, 'Spain', 'result.admin should be strictly equal to "Spain"');
    t.equal(result.features[0].properties.adm1_code, 'ESP-5833', 'result.adm1_code should be strictly equal to "ESP-5833"');
    t.equal(result.features[0].properties.name, 'Madrid', 'result.name should be strictly equal to "Madrid"');
    t.end();
});

test('Validate getContinentGeoJSONByCode (Europe)', function(t) {
    const result = getContinentGeoJSONByCode('EU');
    // console.log('getContinentGeoJSONByCode (Europe)', result);
    t.equal(result.type, 'Feature', 'result.type should be strictly equal to "Feature"');
    t.equal(result.geometry.type, 'MultiPolygon', 'result.geometry.type should be strictly equal to "MultiPolygon"');
    t.equal(result.properties.continent_code, 'EU', 'result.properties.continent_code should be strictly equal to "EU"');
    t.end();
});

test('Validate getCountryGeoJSONByAlpha2 (Spain)', function(t) {
    const result = getCountryGeoJSONByAlpha2('ES');
    // console.log('getCountryGeoJSONByAlpha2 (Spain)', result);
    t.equal(result.type, 'Feature', 'result.type should be strictly equal to "Feature"');
    t.equal(result.geometry.type, 'MultiPolygon', 'result.geometry.type should be strictly equal to "MultiPolygon"');
    t.equal(result.properties.country_a2, 'ES', 'result.properties.country_a2 should be strictly equal to "ES"');
    t.equal(result.properties.country_a3, 'ESP', 'result.properties.country_a3 should be strictly equal to "ESP"');
    t.end();
});

test('Validate getCountryGeoJSONByAlpha3 (France)', function(t) {
    const result = getCountryGeoJSONByAlpha3('FRA');
    // console.log('getCountryGeoJSONByAlpha3 (France)', result);
    t.equal(result.type, 'Feature', 'result.type should be strictly equal to "Feature"');
    t.equal(result.geometry.type, 'MultiPolygon', 'result.geometry.type should be strictly equal to "MultiPolygon"');
    t.equal(result.properties.country_a2, 'FR', 'result.properties.country_a2 should be strictly equal to "FR"');
    t.equal(result.properties.country_a3, 'FRA', 'result.properties.country_a3 should be strictly equal to "FRA"');
    t.end();
});

test('Validate getCountryGroupingGeoJSONByCode (EMEA)', function(t) {
    const result = getCountryGroupingGeoJSONByCode('EMEA');
    // console.log('getCountryGroupingGeoJSONByCode (EMEA)', result);
    t.equal(result.type, 'Feature', 'result.type should be strictly equal to "Feature"');
    t.equal(result.geometry.type, 'MultiPolygon', 'result.geometry.type should be strictly equal to "MultiPolygon"');
    t.equal(result.properties.grouping_code, 'EMEA', 'result.properties.grouping_code should be strictly equal to "EMEA"');
    t.end();
});

test('Validate getRegionGeoJSONByCode (Castilla y León)', function(t) {
    const result = getRegionGeoJSONByCode('ES-CL');
    // console.log('getRegionGeoJSONByCode (Castilla y León)', result);
    t.equal(result.type, 'Feature', 'result.type should be strictly equal to "Feature"');
    t.equal(result.geometry.type, 'MultiPolygon', 'result.geometry.type should be strictly equal to "MultiPolygon"');
    t.equal(result.properties.region_code, 'ES-CL', 'result.properties.region_code should be strictly equal to "ES-CL"');
    t.end();
});

test('Validate getStateGeoJSONByCode (Valladolid)', function(t) {
    const result = getStateGeoJSONByCode('ES-VA');
    // console.log('getStateGeoJSONByCode (Valladolid)', result);
    t.equal(result.type, 'Feature', 'result.type should be strictly equal to "Feature"');
    t.equal(result.geometry.type, 'MultiPolygon', 'result.geometry.type should be strictly equal to "MultiPolygon"');
    t.equal(result.properties.state_code, 'ES-VA', 'result.properties.state_code should be strictly equal to "ES-VA"');
    t.end();
});

test('Validate getContinents [fr]', function(t) {
    const result = getContinents('fr');
    // console.log('getContinents [fr]', result);
    t.equal(result.length, 7, 'result.length should be strictly equal to 7');
    t.equal(result[0].continent_name, 'Afrique', 'result[0].continent_name should be strictly equal to "Afrique"');
    t.end();
});

test('Validate getContinentByCode [de]', function(t) {
    const result = getContinentByCode('EU', 'de');
    // console.log('getContinentByCode [de]', result);
    t.equal(result.continent_code, 'EU', 'result.continent_code should be strictly equal to "EU"');
    t.equal(result.continent_name, 'Europa', 'result.continent_name should be strictly equal to "Europa"');
    t.end();
});

test('Validate isValidContinentCode return true', function(t) {
    const result = isValidContinentCode('EU');
    // console.log('isValidContinentCode', result);
    t.equal(result, true, 'result should be strictly equal to true');
    t.end();
});

test('Validate isValidContinentCode return false', function(t) {
    const result = isValidContinentCode('XX');
    // console.log('isValidContinentCode', result);
    t.equal(result, false, 'result should be strictly equal to false');
    t.end();
});

test('Validate getCountries', function(t) {
    const result = getCountries();
    // console.log('getCountries', result);
    t.equal(result.length, 240, 'result.length should be strictly equal to 240');
    t.equal(result[0].country_a2, 'AF', 'result[0].country_a2 should be strictly equal to "AF');
    t.equal(result[0].country_a3, 'AFG', 'result[0].country_a3 should be strictly equal to "AFG"');
    t.equal(result[0].country_name, 'Afghanistan', 'result[0].country_name should be strictly equal to "Afghanistan"');
    t.end();
});

test('Validate getCountries [es]', function(t) {
    const result = getCountries('es');
    // console.log('getCountries [es]', result);
    t.equal(result.length, 240, 'result.length should be strictly equal to 240');
    t.equal(result[0].country_a2, 'AF', 'result[0].country_a2 should be strictly equal to "AF');
    t.equal(result[0].country_a3, 'AFG', 'result[0].country_a3 should be strictly equal to "AFG"');
    t.equal(result[0].country_name, 'Afganistán', 'result[0].country_name should be strictly equal to "Afganistán"');
    t.end();
});

test('Validate getCountryByAlpha2 [es]', function(t) {
    const result = getCountryByAlpha2('ES', 'es');
    // console.log('getCountryByAlpha2 [es]', result);
    t.equal(result.country_a2, 'ES', 'result.country_a2 should be strictly equal to "ES"');
    t.equal(result.country_a3, 'ESP', 'result.country_a3 should be strictly equal to "ESP"');
    t.equal(result.country_name, 'España', 'result.country_name should be strictly equal to "España"');
    t.end();
});

test('Validate getCountryByAlpha3 [en]', function(t) {
    const result = getCountryByAlpha3('ESP', 'en');
    // console.log('getCountryByAlpha3 [en]', result);
    t.equal(result.country_a2, 'ES', 'result.country_a2 should be strictly equal to "ESP"');
    t.equal(result.country_a3, 'ESP', 'result.country_a3 should be strictly equal to "ESP"');
    t.equal(result.country_name, 'Spain', 'result.country_name should be strictly equal to "Spain"');
    t.end();
});

test('Validate isValidCountryAlpha2 return true', function(t) {
    const result = isValidCountryAlpha2('ES');
    // console.log('isValidCountryAlpha2', result);
    t.equal(result, true, 'result should be strictly equal to true');
    t.end();
});

test('Validate isValidCountryAlpha2 return false', function(t) {
    const result = isValidCountryAlpha2('XX');
    // console.log('isValidCountryAlpha2', result);
    t.equal(result, false, 'result should be strictly equal to false');
    t.end();
});

test('Validate isValidCountryAlpha3 return true', function(t) {
    const result = isValidCountryAlpha3('ESP');
    // console.log('isValidCountryAlpha3', result);
    t.equal(result, true, 'result should be strictly equal to true');
    t.end();
});

test('Validate isValidCountryAlpha3 return false', function(t) {
    const result = isValidCountryAlpha3('XXX');
    // console.log('isValidCountryAlpha3', result);
    t.equal(result, false, 'result should be strictly equal to false');
    t.end();
});

test('Validate countryAlpha2ToAlpha3', function(t) {
    const result = countryAlpha2ToAlpha3('ES');
    // console.log('countryAlpha2ToAlpha3', result);
    t.equal(result, 'ESP', 'result should be strictly equal to "ESP"');
    t.end();
});

test('Validate countryAlpha3ToAlpha2', function(t) {
    const result = countryAlpha3ToAlpha2('ESP');
    // console.log('countryAlpha3ToAlpha2', result);
    t.equal(result, 'ES', 'result should be strictly equal to "ES"');
    t.end();
});

test('Validate getCountriesByContinentCode', function(t) {
    const result = getCountriesByContinentCode('EU');
    // console.log('getCountriesByContinentCode', result);
    t.equal(result.length, 57, 'result.length should be strictly equal to 57');
    t.equal(result[0].country_a2, 'AX', 'result[0].country_a2 should be strictly equal to "AX"');
    t.equal(result[0].country_name, 'Aland', 'result[0].country_name should be strictly equal to "Aland"');
    t.end();
});

test('Validate getCountriesByContinentCode [es]', function(t) {
    const result = getCountriesByContinentCode('EU', 'es');
    // console.log('getCountriesByContinentCode [es]', result);
    t.equal(result.length, 57, 'result.length should be strictly equal to 57');
    t.equal(result[0].country_a2, 'AL', 'result[0].country_a2 should be strictly equal to "AL"');
    t.equal(result[0].country_name, 'Albania', 'result[0].country_name should be strictly equal to "Albania"');
    t.end();
});

test('Validate getCountriesByCountryGroupingCode', function(t) {
    const result = getCountriesByCountryGroupingCode('EMEA');
    // console.log('getCountriesByCountryGroupingCode', result);
    t.equal(result.length, 117, 'result.length should be strictly equal to 117');
    t.equal(result[0].country_a2, 'AX', 'result[0].country_a2 should be strictly equal to "AX"');
    t.equal(result[0].country_name, 'Aland', 'result[0].country_name should be strictly equal to "Aland"');
    t.end();
});

test('Validate getCountriesByCountryGroupingCode [es]', function(t) {
    const result = getCountriesByCountryGroupingCode('EMEA', 'es');
    // console.log('getCountriesByCountryGroupingCode [es]', result);
    t.equal(result.length, 117, 'result.length should be strictly equal to 117');
    t.equal(result[0].country_a2, 'AL', 'result[0].country_a2 should be strictly equal to "AL"');
    t.equal(result[0].country_name, 'Albania', 'result[0].country_name should be strictly equal to "Albania"');
    t.end();
});

test('Validate getCountryGroupings', function(t) {
    const result = getCountryGroupings();
    // console.log('getCountryGroupings', result);
    t.equal(result.length, 68, 'result.length should be strictly equal to 68');
    t.equal(result[0].grouping_code, 'AU', 'result[0].grouping_code should be strictly equal to "AU"');
    t.equal(result[0].grouping_name, 'African Union', 'result[0].grouping_name should be strictly equal to "African Union"');
    t.end();
});

test('Validate getCountryGroupings [es]', function(t) {
    const result = getCountryGroupings('es');
    // console.log('getCountryGroupings [es]', result);
    t.equal(result.length, 68, 'result.length should be strictly equal to 68');
    t.equal(result[0].grouping_code, 'CEFTA', 'result[0].grouping_code should be strictly equal to "CEFTA"');
    t.equal(result[0].grouping_name, 'Acuerdo de libre comercio de Europa Central', 'result[0].grouping_name should be strictly equal to "Acuerdo de libre comercio de Europa Central"');
    t.end();
});

test('Validate getCountryGroupingByCode [en]', function(t) {
    const result = getCountryGroupingByCode('EMEA', 'en');
    // console.log('getCountryGroupingByCode [en]', result);
    t.equal(result.grouping_code, 'EMEA', 'result.grouping_code should be strictly equal to "EMEA"');
    t.equal(result.grouping_name, 'Europe, the Middle East and Africa', 'result.grouping_name should be strictly equal to "Europe, the Middle East and Africa"');
    t.end();
});

test('Validate getCountryGroupingByCode [es]', function(t) {
    const result = getCountryGroupingByCode('AU', 'es');
    // console.log('getCountryGroupingByCode [es]', result);
    t.equal(result.grouping_code, 'AU', 'result.grouping_code should be strictly equal to "AU"');
    t.equal(result.grouping_name, 'Unión Africana', 'result.grouping_name should be strictly equal to "Unión Africana"');
    t.end();
});

test('Validate isValidCountryGroupingCode return true', function(t) {
    const result = isValidCountryGroupingCode('EMEA');
    // console.log('isValidCountryGroupingCode', result);
    t.equal(result, true, 'result should be strictly equal to true');
    t.end();
});

test('Validate isValidCountryGroupingCode return false', function(t) {
    const result = isValidCountryGroupingCode('XXXX');
    // console.log('isValidCountryGroupingCode', result);
    t.equal(result, false, 'result should be strictly equal to false');
    t.end();
});

test('Validate getRegionsByCountryAlpha2 [es]', function(t) {
    const result = getRegionsByCountryAlpha2('ES', 'es');
    // console.log('getRegionsByCountryAlpha2 [es]', result);
    t.equal(result.length, 19, 'result.length should be strictly equal to 19');
    t.end();
});

test('Validate getRegionsByCountryAlpha3 [en]', function(t) {
    const result = getRegionsByCountryAlpha3('ESP', 'en');
    // console.log('getRegionsByCountryAlpha3 [en]', result);
    t.equal(result.length, 19, 'result.length should be strictly equal to 19');
    t.end();
});

test('Validate getRegionByCode [es]', function(t) {
    const result = getRegionByCode('ES-CL', 'es');
    // console.log('getRegionByCode [es]', result);
    t.equal(result.region_code, 'ES-CL', 'result.region_code should be strictly equal to "ES-CL"');
    t.end();
});

test('Validate isValidRegionCode return true', function(t) {
    const result = isValidRegionCode('ES-CL');
    // console.log('isValidRegionCode', result);
    t.equal(result, true, 'result should be strictly equal to true');
    t.end();
});

test('Validate isValidRegionCode return false', function(t) {
    const result = isValidRegionCode('XX-XX');
    // console.log('isValidRegionCode', result);
    t.equal(result, false, 'result should be strictly equal to false');
    t.end();
});

test('Validate getStatesByRegionCode [es]', function(t) {
    const result = getStatesByRegionCode('ES-CL', 'es');
    // console.log('getStatesByRegionCode [es]', result);
    t.equal(result.length, 9, 'result.length should be strictly equal to 9');
    t.end();
});

test('Validate getStateByCode [de]', function(t) {
    const result = getStateByCode('ES-VA', 'de');
    // console.log('getStateByCode [de]', result);
    t.equal(result.state_code, 'ES-VA', 'result.state_code should be strictly equal to "ES-VA"');
    t.end();
});

test('Validate isValidStateCode return true', function(t) {
    const result = isValidStateCode('ES-VA');
    // console.log('isValidStateCode', result);
    t.equal(result, true, 'result should be strictly equal to true');
    t.end();
});

test('Validate isValidStateCode return false', function(t) {
    const result = isValidStateCode('XX-XX');
    // console.log('isValidStateCode', result);
    t.equal(result, false, 'result should be strictly equal to false');
    t.end();
});
