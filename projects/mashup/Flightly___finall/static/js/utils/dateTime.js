export function formatUTCDateTime(utcTime) {
    const datePart = utcTime.split('T')[0];
    const timePart = utcTime.split('T')[1].split('+')[0];

    const [year, month, day] = datePart.split('-');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${monthNames[parseInt(month) - 1]} ${day}, ${year}`;

    let [hours, minutes] = timePart.split(':');
    let period = 'AM';
    hours = parseInt(hours);
    if (hours >= 12) {
        period = 'PM';
        if (hours > 12) {
            hours -= 12;
        }
    } else if (hours === 0) {
        hours = 12;
    }

    const formattedTime = `${hours}:${minutes} ${period}`;
    return { formattedDate, formattedTime };
}
