/**
 * Checks if a point is contained in a polygon
 * (based on the Jordan curve theorem), for more info:
 * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
 * @param polygon array a series of the polygon's coordinates
 * @param point object representing the point's coordinates
 * @return boolean true if the point lies within the polygon, false otherwise
 */
const pointInPolygon = (polygon, point) => {
    let nvert = polygon.length;
    let c = false;
    for(let i = 0, j = nvert-1; i < nvert; j = i++) {
        let pI = polygon[i];
        let pJ = polygon[j];
        if(((pI[1] > point[1]) !== (pJ[1] > point[1])) &&
         (point[0] < (pJ[0] - pI[0]) * (point[1] - pI[1]) / (pJ[1] - pI[1]) + pI[0]) ) {
            c = !c;
        }
    }
    return c;
};

const cleanLocale = (locale) => {
    let result = '';
    if(locale !== null && typeof locale === 'string') {
        result = locale;
        result = result.replace('-', '_');
        result = result.split('_')[0];
        result = result.toLowerCase();
    }
    return result;
};

const translateNames = (items, locale, property) => {
    if(!items) return;
    items.forEach(item => translateName(item, locale, property));
    sortObjectArray(items, false, property);
};

const translateName = (item, locale, property) => {
    if(!item) return;
    locale = cleanLocale(locale);
    if(locale !== '') {
        if(item.i18n && item.i18n[locale]) {
            item[property] = item.i18n[locale];
        }
    }
    delete item.i18n;
};

const sortObjectArray = (arr, ignoreCase = false, property = null) => {
    arr.sort(function(a,b) {
        let x = a[property] ? a[property] : a[Object.keys(a)[0]];
        let y = b[property] ? b[property] : b[Object.keys(b)[0]];
        if(!ignoreCase) {
            x = x.toLowerCase();
            y = y.toLowerCase();
        }
        return x < y ? -1 : (x > y ? 1 : 0);
    });
};

const sortObject = (o) => {

    let sorted = {};
    let key;
    let a = [];

    Object.entries(o).forEach(([key, value]) => a.push(key));

    a.sort();

    for(key = 0; key < a.length; key++) {
        let k = a[key];
        sorted[k] = o[k];
    }
    return sorted;
};

const roundCoordinates = (coords) => {
    if(!(coords instanceof Array)) return;
    for(let i = 0; i < coords.length; i++) {
        let c = coords[i];
        if(c instanceof Array && c.length === 0) continue;
        if(c instanceof Array && c.length > 0 && c[0] instanceof Array) {
            roundCoordinates(c);
        } else {
            c.forEach((c2, i2) => {
                c[i2] = Math.round(c[i2] * 100000) / 100000; // 5 decimals
            });
        }
    }
};

const getRegionCode = (props) => {
    let regionCode = props.code_hasc;
    if(!regionCode || regionCode.endsWith('~')) regionCode = props.region_cod;
    if(!regionCode) regionCode = props.iso_a2;
    regionCode = regionCode ? regionCode.trim().replaceAll('.', '-').replaceAll('_', '-') : '';
    return regionCode;
};

const getRegionName = (props) => {
    return props.region_cod ? (props.woe_name ? props.woe_name : (props.region ? props.region : props.name)) : props.admin;
};

const getStateAlpha2 = (props) => {
    return props.iso_3166_2 ? props.iso_3166_2.trim().replaceAll('.', '-').replaceAll('_', '-') : '';
};

module.exports = {
    pointInPolygon,
    cleanLocale,
    translateNames,
    translateName,
    sortObjectArray,
    sortObject,
    roundCoordinates,
    getRegionCode,
    getRegionName,
    getStateAlpha2
};