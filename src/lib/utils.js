const monthTr = {
    1: "Jan.",
    2: "Feb.",
    3: "Mar.",
    4: "Apr.",
    5: "May",
    6: "Jun.",
    7: "Jul.",
    8: "Aug.",
    9: "Sep.",
    10: "Oct.",
    11: "Nov.",
    12: "Dec."
}

function daySuffix(day) {
    switch (day) {
        case 1: return '1st';
        case 2: return '2nd';
        case 3: return '3rd';
        default: return day + "th";
    }
}

export function formatDate(input) {
    const d = new Date(input);
    return `${monthTr[d.getMonth()+1]} ${daySuffix(d.getDay()-1)} ${d.getFullYear()}`
}

export function formatDateTime(input) {
    const d = new Date(input);
    return formatDate(input) + " " + d.toLocaleTimeString();
}


/**
 * @param {string} str
 */
export function htmlentities(str, nl2br=false) {
    let newstr = str.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
    if (nl2br) newstr = newstr.replace(/\r/g, "").replace(/\n/g, "<br />");
    return newstr;
}



export default {
    formatDate, formatDateTime, htmlentities
}