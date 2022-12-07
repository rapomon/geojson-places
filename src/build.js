const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');
const clone = require('just-clone');
const clc = require('cli-color');
const { sortObjectArray, sortObject, roundCoordinates, getRegionCode, getRegionName, getStateAlpha2 } = require('./utils');
const i18nCountries = require('i18n-iso-countries');
const i18nRegions = require('iso3166-2-db/data/iso3166-2.json');
const i18nLocales = [
    'af','am','ar','az','be','bg','bn','bs','ca','cs','cy','da','de','dv','el','en','es','et',
    'eu','fa','fi','fr','gl','ha','he','hi','hr','hu','hy','id','is','it','ja','ka','kk','km',
    'ko','ku','ky','lt','lv','mk','ml','mn','ms','nb','nl','nn','no','pl','ps','pt','ro','ru',
    'sd','sk','sl','so','sq','sr','sv','sw','ta','tg','th','tr','tt','ug','uk','ur','uz','vi','zh'
];

const buildData = require('../data/build.json');
const continents = require('../data/continents/continents.json');
const countryGroupings = require('../data/country-groupings/country-groupings.json');
let admin1;
let countries;
let regions;

const dataPath = path.join(__dirname, './../data/');

/**
 * Generate data files
 */
const generateAdmin1 = async () => {
    const featCountries = buildData.features;

    let hrstart;
    let hrend;
    let output;

    // Clean original dataset and save as a new admin1.json
    hrstart = process.hrtime();
    for(let i = 0; i < featCountries.length; i++) {
        let country = featCountries[i];
        let coords = country.geometry.coordinates;
        let props = country.properties;
        for(let c = 0; c < continents.length; c++) {
            const continent = continents[c];
            if(continent.countries.includes(props.iso_a2)) {
                props.cont_code = continent.continent_code;
                props.cont_name = continent.continent_name;
                break;
            }
        }
        // Fix Melilla region
        if(props.name === 'Melilla') {
            props.code_hasc = 'ES.ML';
            props.region_cod = 'ES.ML';
            props.postal = 'ML';
        }
        // Fix Canarias region
        if(props.name === 'Santa Cruz de Tenerife') {
            props.woe_name = 'Canarias';
            props.region = 'Canarias';
        }
        // Clean region_cod
        if(props.region_cod === '<Null>') {
            props.region_cod = '';
        }
        // Clean region_cod
        if(props.region_cod) {
            props.region_cod = props.region_cod.trim();
        }
        // Clean code_hasc
        if(props.code_hasc) {
            props.code_hasc = props.code_hasc.trim();
        }
        // Clipperton Island
        if(props.iso_3166_2 === '-99-X02~') {
            props.iso_a2 = 'FR';
            props.code_hasc = 'FR-CLP';
        }
        // Coral Sea Islands
        if(props.iso_3166_2 === '-99-X03~') {
            props.iso_a2 = 'AU';
            props.code_hasc = 'AU-CSI';
        }
        // Baykonur lease in Qyzylorda
        if(props.iso_3166_2 === '-99-X05~') {
            props.iso_a2 = 'KZ';
            props.code_hasc = 'KZ-KAB';
        }
        // Siachen Glacier
        if(props.iso_3166_2 === '-99-X06~') {
            props.iso_a2 = 'IN';
            props.code_hasc = 'IN-KAS';
        }
        // Spratly Islands
        if(props.iso_3166_2 === '-99-X08~') {
            props.iso_a2 = 'VN';
            props.code_hasc = 'VN-PGA';
        }
        // Somaliland
        if(props.iso_3166_2 === '-99-X11~') {
            props.iso_a2 = 'SO';
            props.code_hasc = 'SO-SOL';
        }
        // Guantanamo
        if(props.iso_3166_2 === '-99-X13~') {
            props.iso_a2 = 'CU';
            props.code_hasc = 'CU-USG';
        }
        // Christmas Island
        if(props.iso_3166_2 === '-99-X14~') {
            props.iso_a2 = 'AU';
            props.code_hasc = 'AU-CXR';
        }
        // Cocos Islands
        if(props.iso_3166_2 === '-99-X15~') {
            props.iso_a2 = 'AU';
            props.code_hasc = 'AU-CCK';
        }
        // Fix Cyprus Area Bases
        if(props.iso_3166_2 === '-99-X04~') {
            props.iso_a2 = 'CY';
            props.code_hasc = 'CY-CYN';
        }
        // Dhekelia Sovereign Base Area
        if(props.iso_3166_2 === '-99-X16~') {
            props.iso_a2 = 'CY';
            props.code_hasc = 'CY-ESB';
        }
        // Akrotiri Sovereign Base Area
        if(props.iso_3166_2 === '-99-X17~') {
            props.iso_a2 = 'CY';
            props.code_hasc = 'CY-WSB';
        }
        // Area under join control between Fujairah and Sharjah (United Arab Emirates)
        if(props.iso_3166_2 === 'AE-X01~') {
            props.code_hasc = 'AE-FU-SH';
        }
        // Area under joint control between Ajman and neighboring Oman (United Arab Emirates)
        if(props.iso_3166_2 === 'AE-X02~') {
            props.code_hasc = 'AE-AJ-OM';
        }
        // Anguilla (North America)
        if(props.iso_3166_2 === 'AI-X00') {
            props.code_hasc = 'AI-AIA';
        }
        // Antarctica (general)
        if(props.iso_3166_2 === 'AQ-X01~') {
            props.code_hasc = 'AQ-01';
        }
        // Antarctica minor islands
        if(props.iso_3166_2 === 'AQ-X02~') {
            props.code_hasc = 'AQ-02';
        }
        // Macquarie Island
        if(props.iso_3166_2 === 'AU-X03~') {
            props.code_hasc = 'AU-MI';
        }
        // Cook Islands
        if(props.iso_a2 === 'CK') {
            props.code_hasc = props.iso_3166_2.replace('X', '').replace('~', '');
        }
        // Paracel Islands
        if(props.iso_3166_2 === 'CN-X01~') {
            props.code_hasc = 'CN-PF';
        }
        // Colombia minor island
        if(props.iso_3166_2 === 'CO-X01~') {
            props.code_hasc = 'CO-CMI';
        }
        // Curacao, AN, Netherlands Antilles
        if(props.iso_3166_2 === 'CW-X01~') {
            props.code_hasc = 'CW-CUW';
        }
        // Western Sahara
        if(props.iso_3166_2 === 'EH-X01~') {
            props.code_hasc = 'EH-SAH';
        }
        // Guam (Oceania)
        if(props.iso_3166_2 === 'GU-X01~') {
            props.code_hasc = 'GU-GUM';
        }
        // Isle of Man, GB, United Kingdom
        if(props.iso_3166_2 === 'IM-X01~') {
            props.code_hasc = 'GB-IM';
        }
        // Jersey, GB, United Kingdom
        if(props.iso_3166_2 === 'JE-X01~') {
            props.code_hasc = 'GB-JE';
        }
        // Jersey, GB, United Kingdom
        if(props.iso_3166_2 === 'JE-X01~') {
            props.code_hasc = 'GB-JE';
        }
        // Cayman Islands
        if(props.iso_3166_2 === 'KY-X01~') {
            props.code_hasc = 'GB-KY';
        }
        // Turks and Caicos Islands
        if(props.iso_3166_2 === 'TC-X01~') {
            props.code_hasc = 'TC-01';
        }
        if(props.iso_3166_2 === 'TC-X02~') {
            props.code_hasc = 'TC-02';
        }
        if(props.iso_3166_2 === 'TC-X03~') {
            props.code_hasc = 'TC-03';
        }
        if(props.iso_3166_2 === 'TC-X04~') {
            props.code_hasc = 'TC-04';
        }
        if(props.iso_3166_2 === 'TC-X05~') {
            props.code_hasc = 'TC-05';
        }
        if(props.iso_3166_2 === 'TC-X06~') {
            props.code_hasc = 'TC-06';
        }
        // Kiribati
        if(props.iso_3166_2 === 'KI-X01~') {
            props.code_hasc = 'KI-01';
        }
        // Kiribati minor island
        if(props.iso_3166_2 === 'KI-X02~') {
            props.code_hasc = 'KI-02';
            props.name = 'Kiribati minor island';
        }
        // Marshall Islands
        if(props.iso_3166_2 === 'MH-L' || props.iso_3166_2 === 'MH-T') {
            props.code_hasc = props.iso_3166_2;
        }
        // Tokelau (New Zeland)
        if(props.iso_3166_2 === 'TK-X01~') {
            props.code_hasc = 'NZ-TK';
        }
        // Quarter of Praslin
        if(props.iso_3166_2 === 'LC-09') {
            props.code_hasc = 'LC-01';
        }
        // Quarter of Dauphin
        if(props.iso_3166_2 === 'LC-04') {
            props.code_hasc = 'LC-02';
        }
        // Mexico minor island
        if(props.iso_3166_2 === 'MX-X01~') {
            props.code_hasc = 'MX-01';
        }
        // Fix New Zealand Outlying Islands
        if(props.code_hasc && props.code_hasc.startsWith('NZ') && props.code_hasc.endsWith('~')) {
            props.code_hasc = props.code_hasc.replaceAll('~', '').replaceAll('X', '');
        }
        // Fix Mauritius codes
        if(props.code_hasc && props.code_hasc.startsWith('MU') && props.code_hasc.endsWith('~')) {
            props.code_hasc = props.code_hasc.replaceAll('~', '');
        }
        // Russia minor island
        if(props.iso_3166_2 === 'RU-X01~') {
            props.code_hasc = 'RU-01';
        }
        // Syria (United Nations Neutral Zone)
        if(props.iso_3166_2 === 'SY-X01~') {
            props.code_hasc = 'SY-UNDOF';
        }
        // Venezuela minor island
        if(props.iso_3166_2 === 'VE-X01~') {
            props.code_hasc = 'VE-01';
        }
        // Fix New Zealand -> Tokelau (alpha3 code)
        if(props.iso_a2 === 'TK') {
            props.adm0_a3 = 'TKL';
            props.admin = 'Tokelau';
        }
        props.region_code = getRegionCode(props);
        props.region_name = getRegionName(props);
        props.iso_3166_2 = getStateAlpha2(props);
        Object.keys(props).forEach(key => {
            if(!props[key]) delete props[key];
        });
        country.properties = sortObject(props);
        roundCoordinates(coords);
    }
    hrend = process.hrtime(hrstart);
    admin1 = clone(buildData);
    await fs.writeFileSync(path.join(dataPath, '/states/admin1.json'), JSON.stringify(admin1));
    process.stdout.write(clc.greenBright(`Generated ./data/states/admin1.json: ${hrend[0]}s ${hrend[1] / 1000000}ms\n`));

    // Generate countries.json
    hrstart = process.hrtime();
    output = [];
    for(let i = 0; i < featCountries.length; i++) {
        let prop = featCountries[i].properties;
        if(!output.find(c => c.country_a2 === prop.iso_a2)) {
            let country = {
                country_a2: prop.iso_a2,
                country_a3: prop.adm0_a3,
                country_name: prop.admin,
                i18n: {}
            };
            i18nLocales.forEach(locale => {
                let localizedName = i18nCountries.getName(prop.iso_a2, locale, { select: 'official' });
                if(localizedName) country.i18n[locale] = localizedName;
            });
            output.push(country);
        }
    }
    sortObjectArray(output, false, 'country_name');
    hrend = process.hrtime(hrstart);
    countries = clone(output);

    await fs.writeFileSync(path.join(dataPath, '/countries/countries.json'), JSON.stringify(countries, null, 2));
    process.stdout.write(clc.greenBright(`Generated ./data/countries/countries.json: ${hrend[0]}s ${hrend[1] / 1000000}ms\n`));

    // Generate regions.json
    hrstart = process.hrtime();
    output = [];
    for(let i = 0; i < featCountries.length; i++) {
        let props = featCountries[i].properties;
        // Skip Puerto Rico region
        if(props.region_code === 'PR') continue;
        // Skip Tuvalu region
        if(props.region_code === 'TV') continue;
        // Skip Vatican region
        if(props.region_code === 'VA') continue;
        // Skip Kosovo region
        if(props.region_code === 'XK') continue;
        let region = output.find(c => c.region_code === props.region_code);
        if(!region) {
            region = {
                country_a2: props.iso_a2,
                region_code: props.region_code,
                region_name: props.region_name,
                states: []
            };
            if(region.country_a2 !== region.region_code) {
                let fips = props.gns_adm1 || props.gns_region || props.fips || props.gn_a1_code;
                if(fips && fips !== '') {
                    fips = fips.replace(/\D/g,'').toString();
                    let i18nCountryRegions = i18nRegions[props.iso_a2];
                    if(i18nCountryRegions && i18nCountryRegions.regions) {
                        let localizedName = i18nCountryRegions.regions.find(r => r.fips === fips);
                        if(localizedName) {
                            region.i18n = Object.assign({}, localizedName.names);
                            delete region.i18n.geonames;
                        }
                    }
                }
            }
            output.push(region);
        }
        if(!region.states.find(s => s.state_code === props.iso_3166_2)) {
            let i18n = {};
            Object.keys(props).forEach(key => {
                if(key !== 'name_alt' && key !== 'name_len' && key.startsWith('name_')) {
                    const locale = key.split('_')[1];
                    let value = props[key];
                    value = value.substring(0, 1).toUpperCase() + value.substring(1);
                    i18n[locale] = value;
                }
            });
            props.iso_3166_2 = props.iso_3166_2.replace('~', '');
            // Anguilla minor island
            if(props.iso_3166_2 === 'AI-X00') {
                props.name = 'Anguilla minor island';
            }
            // Antarctica minor island
            if(props.iso_3166_2 === 'AQ-X02') {
                props.name = 'Antarctica minor island';
            }
            // Colombia minor island
            if(props.iso_3166_2 === 'CO-X01') {
                props.name = 'Colombia minor island';
            }
            // Mexico minor island
            if(props.iso_3166_2 === 'MX-X01') {
                props.name = 'Mexico minor island';
            }
            // Russia minor island
            if(props.iso_3166_2 === 'RU-X01') {
                props.name = 'Russia minor island';
            }
            // Venezuela minor island
            if(props.iso_3166_2 === 'VE-X01') {
                props.name = 'Venezuela minor island';
            }
            region.states.push({
                state_code: props.iso_3166_2,
                state_name: props.name,
                i18n
            });
        }
    }
    sortObjectArray(output, false, 'region_name');
    output.forEach(o => sortObjectArray(o.states, false, 'state_name'));
    hrend = process.hrtime(hrstart);
    regions = clone(output);
    await fs.writeFileSync(path.join(dataPath, '/regions/regions.json'), JSON.stringify(regions, null, 2));
    process.stdout.write(clc.greenBright(`Generated ./data/regions/regions.json: ${hrend[0]}s ${hrend[1] / 1000000}ms\n`));
};

const geoJsonUnion = (geoJSONs, filePath) => {
    if(!geoJSONs || geoJSONs.length === 0) return;
    let featuresJoined = geoJSONs[0];
    if(geoJSONs.length > 1) {
        for(let i = 1; i < geoJSONs.length; i++) {
            process.stdout.write(clc.yellowBright(`Generating ./data${filePath}: ${i}/${geoJSONs.length}\n`));
            featuresJoined = turf.union(featuresJoined, geoJSONs[i]);
            moveUp();
        }
    }
    return featuresJoined;
};

const generateContinents = () => {
    emptyDir(path.join(dataPath, '/continents'), 'continents.json');
    let _continents = clone(continents);
    _continents.forEach(continent => generateContinentGeoJSONByCode(continent));
    return _continents;
};

const simplifyContinents = () => {
    simplifyGeoJSONs('continents');
};

const generateContinentGeoJSONByCode = (continent) => {
    const hrstart = process.hrtime();
    const filePath = '/continents/'+continent.continent_code+'.json';
    let result = geoJsonUnion(clone(admin1.features.filter(f => f.properties.cont_code === continent.continent_code)), filePath);
    if(!result) {
        process.stdout.write(clc.redBright(`Unable to generate continent ./data${filePath}, cont_code=${continent.continent_code} not found.\n`));
        return;
    }
    result.properties = {
        continent_code: continent.continent_code
    };
    const hrend = process.hrtime(hrstart);
    process.stdout.write(clc.greenBright(`Generated ./data${filePath}: ${hrend[0]}s ${hrend[1] / 1000000}ms\n`));
    fs.writeFileSync(path.join(dataPath, filePath), JSON.stringify(result));
};

const generateCountries = () => {
    emptyDir(path.join(dataPath, '/countries'), 'countries.json');
    let _countries = clone(countries);
    _countries.forEach(country => generateCountryGeoJSONByAlpha2(country));
    return _countries;
};

const generateCountryGeoJSONByAlpha2 = (country) => {
    const hrstart = process.hrtime();
    const filePath = '/countries/'+country.country_a2+'.json';
    let result = geoJsonUnion(clone(admin1.features.filter(f => f.properties.iso_a2 === country.country_a2)), filePath);
    if(!result) {
        process.stdout.write(clc.redBright(`Unable to generate country ./data${filePath}, iso_a2=${country.country_a2} not found.\n`));
        return;
    }
    result.properties = {
        country_a2: country.country_a2,
        country_a3: country.country_a3
    };
    const hrend = process.hrtime(hrstart);
    process.stdout.write(clc.greenBright(`Generated ./data${filePath}: ${hrend[0]}s ${hrend[1] / 1000000}ms\n`));
    fs.writeFileSync(path.join(dataPath, filePath), JSON.stringify(result));
};

const generateCountryGroupings = () => {
    emptyDir(path.join(dataPath, '/country-groupings'), 'country-groupings.json');
    let _countryGroupings = clone(countryGroupings);
    _countryGroupings.forEach(countryGrouping => generateCountryGroupingGeoJSONByCode(countryGrouping));
};

const simplifyCountryGroupings = () => {
    simplifyGeoJSONs('country-groupings');
};

const generateCountryGroupingGeoJSONByCode = (countryGrouping) => {
    const hrstart = process.hrtime();
    const filePath = '/country-groupings/'+countryGrouping.grouping_code+'.json';
    let _countryGrouping = countryGroupings.find(item => item.grouping_code === countryGrouping.grouping_code);
    if(!_countryGrouping || !_countryGrouping.countries) return {};
    let result = geoJsonUnion(clone(admin1.features.filter(feat => _countryGrouping.countries.includes(feat.properties.iso_a2))), filePath);
    if(!result) {
        process.stdout.write(clc.redBright(`Unable to generate country grouping ./data${filePath}, grouping_code=${countryGrouping.grouping_code} not found.\n`));
        return;
    }
    result.properties = {
        grouping_code: countryGrouping.grouping_code
    };
    const hrend = process.hrtime(hrstart);
    process.stdout.write(clc.greenBright(`Generated ./data${filePath}: ${hrend[0]}s ${hrend[1] / 1000000}ms\n`));
    fs.writeFileSync(path.join(dataPath, filePath), JSON.stringify(result));
};

const generateRegions = () => {
    emptyDir(path.join(dataPath, '/regions'), 'regions.json');
    let _regions = clone(regions);
    _regions.forEach(region => generateRegionGeoJSONByCode(region));
};

const generateRegionGeoJSONByCode = (region) => {
    const hrstart = process.hrtime();
    const filePath = '/regions/'+region.region_code+'.json';
    let result = geoJsonUnion(clone(buildData.features.filter(f => f.properties.iso_a2 === region.country_a2 && f.properties.region_code === region.region_code)), filePath);
    if(!result) {
        process.stdout.write(clc.redBright(`Unable to generate region ./data${filePath}, country_a2=${region.country_a2} and code=${region.region_code} not found.\n`));
        return;
    }
    result.properties = {
        country_a2: region.country_a2,
        region_code: region.region_code
    };
    const hrend = process.hrtime(hrstart);
    process.stdout.write(clc.greenBright(`Generated ./data${filePath}: ${hrend[0]}s ${hrend[1] / 1000000}ms\n`));
    fs.writeFileSync(path.join(dataPath, filePath), JSON.stringify(result));
};

const simplifyGeoJSONs = (dir) => {
    let files = getDir(path.join(dataPath, '/'+dir), dir+'.json');
    for(const file of files) {
        if(file.endsWith('-simplified.json')) continue;
        const hrstart = process.hrtime();
        const sourcePath = '/'+dir+'/'+file;
        const targetPath = sourcePath.replace('.json', '-simplified.json');
        process.stdout.write(clc.yellowBright(`Generating ./data${targetPath}\n`));
        const geojson = JSON.parse(fs.readFileSync(path.join(dataPath, sourcePath)));
        let result = turf.simplify(geojson, { tolerance: 0.01, highQuality: true, mutate: true });
        fs.writeFileSync(path.join(dataPath, targetPath), JSON.stringify(result));
        const hrend = process.hrtime(hrstart);
        moveUp();
        process.stdout.write(clc.greenBright(`Generated ./data${targetPath}: ${hrend[0]}s ${hrend[1] / 1000000}ms\n`));
    }
};

const moveUp = () => {
    process.stdout.write(clc.move.up(1));
    process.stdout.write(clc.erase.line);
    process.stdout.write(clc.move.lineBegin);
};

const getDir = (directory, exception) => {
    let files = fs.readdirSync(directory);
    if(files.length === 0) return [];
    if(exception) files = files.filter(file => file !== exception);
    return files;
};

const emptyDir = (directory, exception) => {
    let files = fs.readdirSync(directory);
    if(files.length === 0) return;

    for(const file of files) {
        if(file === exception) continue;
        fs.unlinkSync(path.join(directory, file));
    }
};

async function init() {
    let hrstart = process.hrtime();

    await generateAdmin1();
    generateRegions();
    generateCountries();
    generateCountryGroupings();
    simplifyCountryGroupings();
    generateContinents();
    simplifyContinents();

    let hrend = process.hrtime(hrstart);
    process.stdout.write(clc.magentaBright(`Total time: ${hrend[0]}s ${hrend[1] / 1000000}ms\n`));
}

init();