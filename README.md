# geojson-places

This module can do the following tasks:

* Reverse geocoding to determine the state, region, country, country grouping or continent where it is contained from the latitude and longitude specified.
* Get a list of continents with code and name localized, also a list of iso-3166-2 country codes contained in each continent.
* Get a list of country groupings with code and name localized, also a list of iso-3166-2 country codes contained in each continent.
* Get a list of countries with iso-3166-2, iso-3166-3 and name localized.
* Get a list of regions of the country specified with code and name localized.
* Get a list of states of the region specified with code and name localized.
* Convert iso-3166-2 country codes to iso-3166-3, and viceversa.
* Check if a continent code, country code, country grouping code, region code or state code is valid.

## Install

```bash
npm install --save geojson-places
```

## API implementation

I have prepared a complete implementation of the library to consume from a Node based API [geojson-places-api](https://github.com/rapomon/geojson-places-api), as an example or to deploy in a production environment. The API is developed with the [Fastify](https://www.fastify.io) framework.

## Methods

### lookUp(latitude, longitude)

Reverse geocoding to get the region info from latitude/longitude arguments.

```javascript
const { lookUp } = require("geojson-places");
// Reverse geocoding to get the region info of Valladolid (Spain)
const result = lookUp(41.652349, -4.728602);
```

Result:

```javascript
{
  continent_code: 'EU',
  country_a2: 'ES',
  country_a3: 'ESP',
  region_code: 'ES-CL',
  state_code: 'ES-VA'
}
```

Get null from a latitude/longitude in the middle of the sea:

```javascript
const { lookUp } = require("geojson-places");
const result = lookUp(0.0, 0.0);
console.log(result);
// null
```

### lookUpGeoJSON(latitude, longitude)

Reverse geocoding to get the region geojson from latitude/longitude arguments.

```javascript
const { lookUpGeoJSON } = require("geojson-places");
// Reverse geocoding to get the region geojson of Monaco
const result = lookUpGeoJSON(43.73828, 7.42542);
```

Result:

```javascript
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "continent_code": "EU",
        "country_a2": "MC",
        "country_a3": "MCO",
        "region_code": "MC-MC"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [ 7.43745, 43.74336 ],
            [ 7.42625, 43.75546 ],
            [ 7.40697, 43.76351 ],
            [ 7.38754, 43.75790 ],
            [ 7.37266, 43.74583 ],
            [ 7.36726, 43.73412 ],
            [ 7.36575, 43.72273 ],
            [ 7.38072, 43.71927 ],
            [ 7.40432, 43.71797 ],
            [ 7.41796, 43.73090 ],
            [ 7.43285, 43.73985 ],
            [ 7.43745, 43.74336 ]
          ]
        ]
      }
    }
  ]
}
```

### lookUpRaw(latitude, longitude)

Reverse geocoding to get the raw data from latitude/longitude arguments.

This is the original data retrieved from [Natural Earth Data](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/) without process and clean it.

```javascript
const { lookUpRaw } = require("geojson-places");
// Reverse geocoding to get the region geojson of Monaco
const result = lookUpRaw(43.73828, 7.42542);
```

Result:

```javascript
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "adm0_a3": "MCO",
        "adm0_label": 5,
        "adm0_sr": 5,
        "adm1_code": "MCO+00?",
        "admin": "Monaco",
        "check_me": 20,
        "code_hasc": "MC.MC",
        "cont_code": "EU",
        "cont_name": "Europe",
        "datarank": 10,
        "diss_me": 10107,
        "featurecla": "Admin-1 aggregation",
        "geonunit": "Monaco",
        "gn_a1_code": "MC.00",
        "gn_id": 3319178,
        "gn_level": 1,
        "gn_name": "Commune de Monaco",
        "gu_a3": "MCO",
        "iso_3166_2": "MC-X01~",
        "iso_a2": "MC",
        "labelrank": 20,
        "latitude": 43.7461,
        "longitude": 7.39979,
        "mapcolor13": 12,
        "mapcolor9": 2,
        "max_label": 18,
        "min_label": 18,
        "min_zoom": 18,
        "name": "Monaco",
        "name_ar": "موناكو فيل",
        "name_de": "Monaco-Ville",
        "name_en": "Monaco-Ville",
        "name_es": "Mónaco",
        "name_fr": "Monaco-Ville",
        "name_hu": "Monaco",
        "name_it": "Monaco Vecchia",
        "name_ja": "モナコ・ヴィル",
        "name_ko": "모나코빌",
        "name_len": 6,
        "name_nl": "Monaco-Ville",
        "name_pl": "Monaco-Ville",
        "name_pt": "Monaco-Ville",
        "name_ru": "Монако",
        "name_sv": "Monaco-Ville",
        "name_tr": "Monaco-Ville",
        "name_zh": "摩纳哥城",
        "ne_id": 1159315589,
        "region_code": "MC-MC",
        "region_name": "Monaco",
        "sameascity": -99,
        "scalerank": 10,
        "sov_a3": "MCO",
        "wikidataid": "Q55115",
        "woe_id": 23424892,
        "woe_name": "Monaco"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [ 7.43745, 43.74336 ],
            [ 7.42625, 43.75546 ],
            [ 7.40697, 43.76351 ],
            [ 7.38754, 43.75790 ],
            [ 7.37266, 43.74583 ],
            [ 7.36726, 43.73412 ],
            [ 7.36575, 43.72273 ],
            [ 7.38072, 43.71927 ],
            [ 7.40432, 43.71797 ],
            [ 7.41796, 43.73090 ],
            [ 7.43285, 43.73985 ],
            [ 7.43745, 43.74336 ]
          ]
        ]
      }
    }
  ]
}
```

### getContinentGeoJSONByCode(continent_code, simplified = false)

Get geojson continent by continent code.

A simplified version can be retrieved if `simplified` argument is `true`.

```javascript
const { getContinentGeoJSONByCode } = require("geojson-places");
// Get the continent geojson of Europe
const result = getContinentGeoJSONByCode('EU');
```

Result:

```javascript
{
  type: 'Feature',
  properties: {
    continent_code: 'EU'
  },
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [ 7.43745, 43.74336 ],
      ...
    ]
  }
}
```

### getCountryGeoJSONByAlpha2(country_a2)

Get geojson country by `iso-3166-2` code.

```javascript
const { getCountryGeoJSONByAlpha2 } = require("geojson-places");
// Get the country geojson of Spain
const result = getCountryGeoJSONByAlpha2('ES');
```

Result:

```javascript
{
  type: 'Feature',
  properties: {
    country_a2: 'ES',
    country_a3: 'ESP'
  },
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [ 7.43745, 43.74336 ],
      ...
    ]
  }
}
```

### getCountryGeoJSONByAlpha3(country_a3)

Get geojson country by `iso-3166-3` code.

```javascript
const { getCountryGeoJSONByAlpha3 } = require("geojson-places");
// Get the country geojson of Spain
const result = getCountryGeoJSONByAlpha3('ESP');
```

Result:

```javascript
{
  type: 'Feature',
  properties: {
    country_a2: 'ES',
    country_a3: 'ESP'
  },
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [ 7.43745, 43.74336 ],
      ...
    ]
  }
}
```

### getCountryGroupingGeoJSONByCode(grouping_code, simplified = false)

Get geojson country grouping by grouping code.

A simplified version can be retrieved if `simplified` argument is `true`.

```javascript
const { getCountryGroupingGeoJSONByCode } = require("geojson-places");
// Get the country grouping geojson of EMEA
const result = getCountryGroupingGeoJSONByCode('EMEA');
```

Result:

```javascript
{
  type: 'Feature',
  properties: {
    grouping_code: 'EMEA'
  },
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [ 7.43745, 43.74336 ],
      ...
    ]
  }
}
```

### getRegionGeoJSONByCode(region_code)

Get geojson country region by region code.

```javascript
const { getRegionGeoJSONByCode } = require("geojson-places");
// Get the country region geojson of Castilla y León (Spain) with region code ES-CL
const result = getRegionGeoJSONByCode('ES-CL');
```

Result:

```javascript
{
  type: 'Feature',
  properties: {
    country_a2: 'ES',
    region_code: 'ES-CL'
  },
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [ 7.43745, 43.74336 ],
      ...
    ]
  }
}
```

### getStateGeoJSONByCode(state_code)

Get geojson country state by state code.

```javascript
const { getStateGeoJSONByCode } = require("geojson-places");
// Get the country state geojson of Valladolid, Castilla y León (Spain) with state code ES-VA
const result = getStateGeoJSONByCode('ES-VA');
```

Result:

```javascript
{
  type: 'Feature',
  properties: {
    country_a2: 'ES',
    region_code: 'ES-CL',
    state_code: 'ES-VA'
  },
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [ 7.43745, 43.74336 ],
      ...
    ]
  }
}
```

### getContinents(locale = null)

Get a list of continents.

The function will return an array of objects with the continent code, name and an array of `iso-3166-2` country codes contained in each continent.

Optionally the `locale` can be specified as parameter to localize the continent name (English by default).

```javascript
const { getContinents } = require("geojson-places");
// Get the continent list
const result = getContinents();
```

Result:

```javascript
[
  {
    continent_code: 'AF',
    continent_name: 'Afrique',
    countries: [
      'DZ', 'AO', 'BW', 'BI', 'CM', 'CV', 'CF',
      'TD', 'KM', 'YT', 'CG', 'CD', 'BJ', 'GQ',
      'ET', 'ER', 'DJ', 'GA', 'GM', 'GH', 'GN',
      'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW',
      'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE',
      'NG', 'GW', 'RE', 'RW', 'SH', 'ST', 'SN',
      'SC', 'SL', 'SO', 'ZA', 'ZW', 'SS', 'EH',
      'SD', 'SZ', 'TG', 'TN', 'UG', 'EG', 'TZ',
      'BF', 'ZM'
    ]
  },
  ...
]
```

### getContinentByCode(continent_code, locale = null)

Get the specified continent by code.

The function will return an object with the continent code, name and an array of `iso-3166-2` country codes contained in the specified continent, always ordered by continent name.

Optionally the `locale` can be specified as parameter to localize the continent name (English by default).

```javascript
const { getContinentByCode } = require("geojson-places");
// Get the Europe continent
const result = getContinentByCode('EU');
```

Result:

```javascript
{
  continent_code: 'EU',
  continent_name: 'Europe',
  countries: [
    'AL', 'AD', 'AZ', 'AT', 'AM', 'BE', 'BA',
    'BG', 'BY', 'HR', 'CY', 'CZ', 'DK', 'EE',
    'FO', 'FI', 'AX', 'FR', 'GE', 'DE', 'GI',
    'GR', 'VA', 'HU', 'IS', 'IE', 'IT', 'KZ',
    'LV', 'LI', 'LT', 'LU', 'MT', 'MC', 'MD',
    'ME', 'NL', 'NO', 'PL', 'PT', 'RO', 'RU',
    'SM', 'RS', 'SK', 'SI', 'ES', 'SJ', 'SE',
    'CH', 'TR', 'UA', 'MK', 'GB', 'GG', 'JE',
    'IM'
  ]
}
```

### isValidContinentCode(continent_code)

Returns boolean value depending on the specified continent code is valid or not.

```javascript
const { isValidContinentCode } = require("geojson-places");
console.log(isValidContinentCode('EU'));
// true
console.log(isValidContinentCode('XX'));
// false
```

### getCountries(locale = null)

Get a list of countries.

The function will return an array of objects with the country code in `iso-3166-2` and `iso-3166-3` format, and name, always ordered by country name.

Optionally the `locale` can be specified as parameter to localize the country name (English by default).

```javascript
const { getCountries } = require("geojson-places");
// Get the country list
const result = getCountries();
```

Result:

```javascript
[
  { country_a2: 'AF', country_a3: 'AFG', country_name: 'Afghanistan' },
  { country_a2: 'AX', country_a3: 'ALD', country_name: 'Aland' },
  { country_a2: 'AL', country_a3: 'ALB', country_name: 'Albania' },
  ...
]
```

### getCountryByAlpha2(country_a2, locale = null)

Get the specified country by iso-3166-2 code.

The function will return an object with the country code in `iso-3166-2` and `iso-3166-3` format, and name.

Optionally the `locale` can be specified as parameter to localize the country name (English by default).

```javascript
const { getCountryByAlpha2 } = require("geojson-places");
// Get the Europe continent
const result = getCountryByAlpha2('AF');
```

Result:

```javascript
{
  country_a2: 'AF',
  country_a3: 'AFG',
  country_name: 'Afghanistan'
}
```

### getCountryByAlpha3(country_a3, locale = null)

Get the specified country by iso-3166-3 code.

The function will return an object with the country code in `iso-3166-2` and `iso-3166-3` format, and name.

Optionally the `locale` can be specified as parameter to localize the country name (English by default).

```javascript
const { getCountryByAlpha3 } = require("geojson-places");
// Get the Europe continent
const result = getCountryByAlpha3('AFG');
```

Result:

```javascript
{
  country_a2: 'AF',
  country_a3: 'AFG',
  country_name: 'Afghanistan'
}
```

### isValidCountryAlpha2(country_a2)

Returns boolean value depending on the specified country code in `iso-3166-2` format, is valid or not.

```javascript
const { isValidCountryAlpha2 } = require("geojson-places");
console.log(isValidCountryAlpha2('ES'));
// true
console.log(isValidCountryAlpha2('XX'));
// false
```

### isValidCountryAlpha3(country_a3)

Returns boolean value depending on the specified country code in `iso-3166-3` format, is valid or not.

```javascript
const { isValidCountryAlpha3 } = require("geojson-places");
console.log(isValidCountryAlpha3('ESP'));
// true
console.log(isValidCountryAlpha3('XXX'));
// false
```

### countryAlpha3ToAlpha2(country_a3)

Convert country code from `iso-3166-3` to `iso-3166-2` format.

```javascript
const { countryAlpha3ToAlpha2 } = require("geojson-places");
console.log(countryAlpha3ToAlpha2('ESP'));
// ES
console.log(countryAlpha3ToAlpha2('XXX'));
// null
```

### countryAlpha2ToAlpha3(country_a2)

Convert country code from `iso-3166-2` to `iso-3166-3` format.

```javascript
const { countryAlpha2ToAlpha3 } = require("geojson-places");
console.log(countryAlpha2ToAlpha3('ES'));
// ESP
console.log(countryAlpha2ToAlpha3('XX'));
// null
```

### getCountriesByContinentCode(continent_code, locale = null)

Get the country list of the specified continent code.

The function will return an array of objects with the country code in `iso-3166-2` and `iso-3166-3` format, and name.

Optionally the `locale` can be specified as parameter to localize the country name (English by default).

```javascript
const { getCountriesByContinentCode } = require("geojson-places");
// Get the country list of the Europe continent
const result = getCountriesByContinentCode('EU');
```

Result:

```javascript
[
  {
    country_a2: 'AX',
    country_a3: 'ALD',
    country_name: 'Aland'
  },
  ...
]
```

### getCountriesByCountryGroupingCode(grouping_code, locale = null)

Get the country list of the specified country grouping code.

The function will return an array of objects with the country code in `iso-3166-2` and `iso-3166-3` format, and name.

Optionally the `locale` can be specified as parameter to localize the country name (English by default).

```javascript
const { getCountriesByCountryGroupingCode } = require("geojson-places");
// Get the country list of the EMEA country grouping
const result = getCountriesByCountryGroupingCode('EMEA');
```

Result:

```javascript
[
  {
    country_a2: 'AX',
    country_a3: 'ALD',
    country_name: 'Aland'
  },
  ...
]
```

### getCountryGroupings(locale = null)

Get a list of [country groupings](https://en.wikipedia.org/wiki/List_of_country_groupings).

Groups of countries or regions are often referred to by a single term (word, phrase, or abbreviation). The origins of such terms include political alliances, intergovernmental organizations, business market areas, and mere colloquialism.

The function will return an array of objects with the country grouping code, name and an array of `iso-3166-2` country codes contained in each country grouping.

Optionally the `locale` can be specified as parameter to localize the country grouping name (English by default).

```javascript
const { getCountryGroupings } = require("geojson-places");
// Get the country grouping list
const result = getCountryGroupings('es');
```

Result:

```javascript
[
  {
    grouping_code: 'CEFTA',
    grouping_name: 'Acuerdo de libre comercio de Europa Central',
    countries: [ 'AL', 'BA', 'MD', 'ME', 'MK', 'RS' ]
  },
  {
    grouping_code: 'DACH',
    grouping_name: 'Alemania, Austria, Confederación Suiza',
    countries: [ 'AT', 'CH', 'DE' ]
  },
  {
    grouping_code: 'Pacific Alliance',
    grouping_name: 'Alianza del Pacífico',
    countries: [
      'AU', 'CA', 'CL',
      'CO', 'MX', 'NZ',
      'PE', 'SG'
    ]
  },
  ...
]
```

### getCountryGroupingByCode(grouping_code, locale = null)

Get the specified country grouping by code.

The function will return an object with the country grouping code, name and an array of `iso-3166-2` country codes contained in the specified country grouping, always ordered by country grouping name.

Optionally the `locale` can be specified as parameter to localize the country grouping name (English by default).

```javascript
const { getCountryGroupingByCode } = require("geojson-places");
// Get the EMEA (Europe, the Middle East and Africa) country grouping
const result = getCountryGroupingByCode('EMEA');
```

Result:

```javascript
{
  grouping_code: 'EMEA',
  grouping_name: 'Europe, the Middle East and Africa',
  countries: [
    'AD', 'AE', 'AL', 'AM', 'AO', 'AT', 'AX', 'AZ', 'BA', 'BE',
    'BG', 'BH', 'BI', 'BJ', 'BW', 'BY', 'CF', 'CG', 'CH', 'CI',
    'CM', 'CV', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DZ', 'EE', 'EG',
    'EH', 'ER', 'ES', 'ET', 'FI', 'FO', 'FR', 'GA', 'GB', 'GE',
    'GG', 'GH', 'GI', 'GM', 'GN', 'GR', 'HR', 'HU', 'IE', 'IL',
    'IM', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JO', 'KE', 'KM', 'KW',
    'KZ', 'LB', 'LI', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA',
    'MC', 'MD', 'ME', 'MG', 'MK', 'ML', 'MR', 'MT', 'MU', 'MW',
    'MZ', 'NA', 'NE', 'NL', 'NO', 'OM', 'PL', 'PT', 'QA', 'RE',
    'RS', 'RU', 'RW', 'SA', 'SC', 'SD', 'SE', 'SH', 'SI', 'SK',
    ...
  ]
}
```

### isValidCountryGroupingCode(grouping_code)

Returns boolean value depending on the specified country grouping code is valid or not.

```javascript
const { isValidCountryGroupingCode } = require("geojson-places");
console.log(isValidCountryGroupingCode('EMEA'));
// true
console.log(isValidCountryGroupingCode('X'));
// false
```

### getRegions(locale = null)

Get a list of all regions.

The function will return an array of objects with each country `iso-3166-2` code, region code and name, always ordered by region name.

Optionally the `locale` can be specified as parameter to localize the region names (English by default).

```javascript
const { getRegions } = require("geojson-places");
// Get all regions
const result = getRegions();
```

Result:

```javascript
[
  { country_a2: 'ES', region_code: 'ES-AN', region_name: 'Andalusia' },
  { country_a2: 'ES', region_code: 'ES-AR', region_name: 'Aragon' },
  { country_a2: 'ES', region_code: 'ES-AS', region_name: 'Asturias' },
  ...
]
```

### getRegionsAndStates(locale = null)

Get a list of all regions with the states of each region.

The function will return an array of objects with each country `iso-3166-2` code, region code, name and an array of states, always ordered by region name, and state name.

Optionally the `locale` can be specified as parameter to localize the region names and state names (English by default).

```javascript
const { getRegionsAndStates } = require("geojson-places");
// Get all regions and states
const result = getRegionsAndStates();
```

Result:

```javascript
[
  {
    country_a2: 'ES',
    region_code: 'ES-CL',
    region_name: 'Castilla y León',
    states: [
      { state_code: 'ES-BU', state_name: 'Burgos' },
      { state_code: 'ES-LE', state_name: 'León' },
      { state_code: 'ES-P' , state_name: 'Palencia' },
      { state_code: 'ES-SA', state_name: 'Salamanca' },
      { state_code: 'ES-SG', state_name: 'Segovia' },
      { state_code: 'ES-SO', state_name: 'Soria' },
      { state_code: 'ES-VA', state_name: 'Valladolid' },
      { state_code: 'ES-ZA', state_name: 'Zamora' },
      { state_code: 'ES-AV', state_name: 'Ávila' }
    ]
  },
  ...
]
```

### getRegionsByCountryAlpha2(alpha2, locale = null)

Get a list of regions of the specified country by `iso-3166-2` code.

The function will return an array of objects with each country `iso-3166-2` code, region code and name contained in the specified country, always ordered by region name.

Optionally the `locale` can be specified as parameter to localize the region name (English by default).

```javascript
const { getRegionsByCountryAlpha2 } = require("geojson-places");
// Get the regions of Spain
const result = getRegionsByCountryAlpha2('ES');
```

Result:

```javascript
[
  { country_a2: 'ES', region_code: 'ES-AN', region_name: 'Andalusia' },
  { country_a2: 'ES', region_code: 'ES-AR', region_name: 'Aragon' },
  { country_a2: 'ES', region_code: 'ES-AS', region_name: 'Asturias' },
  { country_a2: 'ES', region_code: 'ES-PM', region_name: 'Balears' },
  { country_a2: 'ES', region_code: 'ES-PV', region_name: 'Basque Country' },
  { country_a2: 'ES', region_code: 'ES-CN', region_name: 'Canary Islands' },
  { country_a2: 'ES', region_code: 'ES-CB', region_name: 'Cantabria' },
  { country_a2: 'ES', region_code: 'ES-CL', region_name: 'Castile and León' },
  { country_a2: 'ES', region_code: 'ES-CM', region_name: 'Castilla-La Mancha' },
  { country_a2: 'ES', region_code: 'ES-CT', region_name: 'Catalonia' },
  { country_a2: 'ES', region_code: 'ES-CE', region_name: 'Ceuta' },
  { country_a2: 'ES', region_code: 'ES-MD', region_name: 'Community of Madrid' },
  { country_a2: 'ES', region_code: 'ES-EX', region_name: 'Extremadura' },
  { country_a2: 'ES', region_code: 'ES-GA', region_name: 'Galicia' },
  { country_a2: 'ES', region_code: 'ES-LO', region_name: 'La Rioja' },
  { country_a2: 'ES', region_code: 'ES-ML', region_name: 'Melilla' },
  { country_a2: 'ES', region_code: 'ES-NA', region_name: 'Navarre' },
  { country_a2: 'ES', region_code: 'ES-MU', region_name: 'Region of Murcia' },
  { country_a2: 'ES', region_code: 'ES-VC', region_name: 'Valencian Community' }
]
```

### getRegionsByCountryAlpha3(alpha3, locale = null)

The same than `getRegionsByCountryAlpha2`, get a list of regions of the specified country by `iso-3166-3` code.

### getRegionByCode(region_code, locale = null)

Get the specified region by code.

The function will return an object with the region of the specified code, name and an array of states contained in the specified region, always ordered by state name.

Optionally the `locale` can be specified as parameter to localize the region name and the list of state names (English by default).

```javascript
const { getRegionByCode } = require("geojson-places");
// Get the region by code ES-CL (Castilla y León, Spain)
const result = getRegionByCode('ES-CL');
```

Result:

```javascript
{
  country_a2: 'ES',
  region_code: 'ES-CL',
  region_name: 'Castilla y León',
  states: [
    { state_code: 'ES-BU', state_name: 'Burgos' },
    { state_code: 'ES-LE', state_name: 'León' },
    { state_code: 'ES-P' , state_name: 'Palencia' },
    { state_code: 'ES-SA', state_name: 'Salamanca' },
    { state_code: 'ES-SG', state_name: 'Segovia' },
    { state_code: 'ES-SO', state_name: 'Soria' },
    { state_code: 'ES-VA', state_name: 'Valladolid' },
    { state_code: 'ES-ZA', state_name: 'Zamora' },
    { state_code: 'ES-AV', state_name: 'Ávila' }
  ]
}
```

### isValidRegionCode(region_code)

Returns boolean value depending on the specified region code is valid or not.

```javascript
const { isValidRegionCode } = require("geojson-places");
console.log(isValidRegionCode('ES-CL'));
// true
console.log(isValidRegionCode('XX-XX'));
// false
```

### getStatesByRegionCode(region_code, locale = null)

Get a list of states of the specified region by code.

The function will return an array of objects with the state code and name contained in the specified region by code.

Optionally the `locale` can be specified as parameter to localize the state names (English by default).

```javascript
const { getStatesByRegionCode } = require("geojson-places");
// Get the states of the region by code ES-CL (Castilla y León, Spain)
const result = getStatesByRegionCode('ES-CL');
```

Result:

```javascript
[
  { state_code: 'ES-BU', state_name: 'Burgos' },
  { state_code: 'ES-LE', state_name: 'León' },
  { state_code: 'ES-P' , state_name: 'Palencia' },
  { state_code: 'ES-SA', state_name: 'Salamanca' },
  { state_code: 'ES-SG', state_name: 'Segovia' },
  { state_code: 'ES-SO', state_name: 'Soria' },
  { state_code: 'ES-VA', state_name: 'Valladolid' },
  { state_code: 'ES-ZA', state_name: 'Zamora' },
  { state_code: 'ES-AV', state_name: 'Ávila' }
]
```

### getStateByCode(state_code, locale = null)

Get the specified state by code.

The function will return an object with the state code and name of the specified state code.

Optionally the `locale` can be specified as parameter to localize the state name (English by default).

```javascript
const { getStateByCode } = require("geojson-places");
// Get the state by code ES-VA (Valladolid, Castilla y León, Spain)
const result = getStateByCode('ES-VA');
```

Result:

```javascript
{
  state_code: 'ES-VA',
  state_name: 'Valladolid'
}
```

### isValidStateCode(state_code)

Returns boolean value depending on the specified state code is valid or not.

```javascript
const { isValidStateCode } = require("geojson-places");
console.log(isValidStateCode('ES-VA'));
// true
console.log(isValidStateCode('XX-XX'));
// false
```

## Testing the library

We can run this npm script to run all the testing cases:

```bash
npm run test
```

## Building the resources

There is a script to regenerate and/or update the following project files:

```bash
\data\countries\*
\data\country-groupings\*
\data\continents\*
\data\regions\*
\data\states\*
```

Note that the country names will be localized using the module [i18n-iso-countries](https://github.com/michaelwittig/node-i18n-iso-countries).

The project file `/data/build.json` must be downloaded from [Admin 1 – States, Provinces](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/) (click on `Download states and provinces`), this is the [direct link](https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_1_states_provinces.zip).

After downloaded the file you need to convert all the collection to a geojson file, using for example the online [mapsharper.org](https://mapshaper.org/) tool.

After converting the zip file to json file, the project file `/data/build.json` must be replaced by this one.

Now we are ready to launch the build (It may take a couple of days 😮):

```bash
npm run build
```

## Acknowledgment

* GeoJSON with all state polygons extracted from [Natural Earth Data](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/).
* All state polygons have been joined to create the regions, countries, country groupings and continents using the library [Turf](http://turfjs.org/).
* Checks if a point is contained in a polygon, based on the [Jordan curve theorem](https://en.wikipedia.org/wiki/Jordan_curve_theorem).
* Country names i18n obtained from [i18n-iso-countries](https://www.npmjs.com/package/i18n-iso-countries) module.
* Region names i18n obtained from [iso3166-2-db](https://www.npmjs.com/package/iso3166-2-db) module.
