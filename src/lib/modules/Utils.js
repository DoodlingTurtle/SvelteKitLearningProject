/** @type {Map<number, string>}*/
const monthTr = new Map();
monthTr.set(1 , "Jan.");
monthTr.set(2 , "Feb.");
monthTr.set(3 , "Mar.");
monthTr.set(4 , "Apr.");
monthTr.set(5 , "May");
monthTr.set(6 , "Jun.");
monthTr.set(7 , "Jul.");
monthTr.set(8 , "Aug.");
monthTr.set(9 , "Sep.");
monthTr.set(10, "Oct.");
monthTr.set(11, "Nov.");
monthTr.set(12, "Dec.");

/** @param {string | number} day */
function daySuffix(day) {
    switch (day) {
        case 1: return '1st';
        case 2: return '2nd';
        case 3: return '3rd';
        default: return day + "th";
    }
}

/** @param {string | number | Date} input */
export function formatDate(input) {
    const d = new Date(input);
    const m = monthTr.get(d.getMonth() + 1);

    return `${m} ${daySuffix(d.getDate())} ${d.getFullYear()}`
}

/** @param {string | number | Date} input */
export function formatDateTime(input) {
    const d = new Date(input);
    return formatDate(input) + " " + d.toLocaleTimeString();
}


/** @param {string} str */
export function htmlentities(str, nl2br=false) {
    let newstr = str.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
    if (nl2br) newstr = newstr.replace(/\r/g, "").replace(/\n/g, "<br />");
    return newstr;
}

export function empty(value, bTrimString=true) {
    switch(typeof(value))  {
        case 'number':
            return value == 0;

        case 'string':
            return bTrimString ? value.trim().length == 0 : value.length == 0;

        case 'object':
            if(value === null) return true;
            if(value instanceof Array) return value.length == 0;
            return false;

        case 'undefined':
            return true;

        default:
            throw new Error(`could not define if '${value}' is empty is typeof '${typeof(value)}' `);
    }
}

export default {
    formatDate, formatDateTime, htmlentities, empty
}