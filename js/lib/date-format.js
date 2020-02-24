const DAY = 86400000;
const HOUR = 3600000;
const MINUTE = 60000;

const relativeTimeFormat = Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat() : null;
function specialCaseFormatting(date) {
    const diff = Date.now() - date.valueOf();
    if (diff > DAY * 3) return null;
    if (!relativeTimeFormat) return null; // lacks browser support?
    if (diff < HOUR) return relativeTimeFormat.format(Math.round(-diff / MINUTE), "minute");
    if (diff < DAY) return relativeTimeFormat.format(Math.round(-diff / HOUR), "hour");
    return relativeTimeFormat.format(Math.round(-diff / DAY), "day");
}

const dateTimeFormat = new Intl.DateTimeFormat("default", { dateStyle: 'full' });
export default function format(dateish) {
    const date = new Date(dateish);
    return specialCaseFormatting(date) || dateTimeFormat.format(date);
}