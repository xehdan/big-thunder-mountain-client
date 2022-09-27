import {format, utcToZonedTime} from "date-fns-tz";


const formatUTCtoLocale = (value, format= "d.M.yyyy HH:mm:ss.SSS \'GMT\' XXX (z)" ) => {
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    const zonedDate = utcToZonedTime(value, timeZone)
    // zonedDate could be used to initialize a date picker or display the formatted local date/time


    const output = format(zonedDate, format, { timeZone: timeZone })

    return output
}

export default formatUTCtoLocale;