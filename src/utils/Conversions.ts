
export default class Conversions {

    static fDateToDateStr( theDate : Date) : string {

        const aUTCDate = "" + theDate.getDate();
        let aUTCDateStr = "" + aUTCDate;
        if( aUTCDateStr.length < 2) {
            aUTCDateStr = "0" + aUTCDateStr;
        }

        const aUTCMonth = "" + (theDate.getMonth()+ 1);
        let aUTCMonthStr = "" + aUTCMonth;
        if( aUTCMonthStr.length < 2) {
            aUTCMonthStr = "0" + aUTCMonthStr;
        }

        const aUTCFullYear = theDate.getFullYear();
        let aUTCFullYearStr = "" + aUTCFullYear;

        const aDateStr =  aUTCDateStr + "/" + aUTCMonthStr + "/" + aUTCFullYearStr;
        return aDateStr;
    }




    static fDateToDateWOsepsStr( theDate : Date): string {

        const aUTCDate = "" + theDate.getDate();
        let aUTCDateStr = "" + aUTCDate;
        if( aUTCDateStr.length < 2) {
            aUTCDateStr = "0" + aUTCDateStr;
        }

        const aUTCMonth = "" + (theDate.getMonth()+ 1);
        let aUTCMonthStr = "" + aUTCMonth;
        if( aUTCMonthStr.length < 2) {
            aUTCMonthStr = "0" + aUTCMonthStr;
        }

        const aUTCFullYear = theDate.getFullYear();
        const aUTCFullYearStr = "" + aUTCFullYear;

        const aDateStr =  aUTCFullYearStr + aUTCMonthStr + aUTCDateStr;
        return aDateStr;
    }




    static fDateToTimestampStr( theDate : Date) {

        if( theDate == null) {
            return null;
        }

        const aDate = "" + theDate.getDate();
        let aDateStr = "" + aDate;
        if( aDateStr.length < 2) {
            aDateStr = "0" + aDateStr;
        }

        const aMonth = "" + (theDate.getMonth()+ 1);
        let aMonthStr = "" + aMonth;
        if( aMonthStr.length < 2) {
            aMonthStr = "0" + aMonthStr;
        }

        const aFullYear = theDate.getFullYear();
        const aFullYearStr = "" + aFullYear;

        const aHours = theDate.getHours();
        let aHoursStr = "" + aHours;
        if( aHoursStr.length < 2) {
            aHoursStr = "0" + aHoursStr;
        }

        const aMinutes = theDate.getMinutes();
        let aMinutesStr = "" + aMinutes;
        if( aMinutesStr.length < 2) {
            aMinutesStr = "0" + aMinutesStr;
        }

        const aSeconds = theDate.getSeconds();
        let aSecondsStr = "" + aSeconds;
        if( aSecondsStr.length < 2) {
            aSecondsStr = "0" + aSecondsStr;
        }

        const aMilliseconds = theDate.getMilliseconds();
        let aMillisecondsStr = "" + aMilliseconds;
        if( aMillisecondsStr.length < 3) {
            if( aMillisecondsStr.length < 2) {
                aMillisecondsStr = "00" + aMillisecondsStr;
            }
            else {
                aMillisecondsStr = "0" + aMillisecondsStr;
            }
        }

        const aTimestampStr = aDateStr + "/" + aMonthStr + "/" + aFullYearStr
            + " "
            + aHoursStr + ":" + aMinutesStr + ":" + aSecondsStr + "." + aMillisecondsStr;

        return aTimestampStr;
    }






    static fDateToTimestampWOsepsStr( theDate : Date) {

        const aDate = "" + theDate.getDate();
        let aDateStr = "" + aDate;
        if( aDateStr.length < 2) {
            aDateStr = "0" + aDateStr;
        }

        const aMonth = "" + (theDate.getMonth()+ 1);
        let aMonthStr = "" + aMonth;
        if( aMonthStr.length < 2) {
            aMonthStr = "0" + aMonthStr;
        }

        const aFullYear = theDate.getFullYear();
        const aFullYearStr = "" + aFullYear;

        const aHours = theDate.getHours();
        let aHoursStr = "" + aHours;
        if( aHoursStr.length < 2) {
            aHoursStr = "0" + aHoursStr;
        }

        const aMinutes = theDate.getMinutes();
        let aMinutesStr = "" + aMinutes;
        if( aMinutesStr.length < 2) {
            aMinutesStr = "0" + aMinutesStr;
        }

        const aSeconds = theDate.getSeconds();
        let aSecondsStr = "" + aSeconds;
        if( aSecondsStr.length < 2) {
            aSecondsStr = "0" + aSecondsStr;
        }

        const aMilliseconds = theDate.getMilliseconds();
        let aMillisecondsStr = "" + aMilliseconds;
        if( aMillisecondsStr.length < 3) {
            if( aMillisecondsStr.length < 2) {
                aMillisecondsStr = "00" + aMillisecondsStr;
            }
            else {
                aMillisecondsStr = "0" + aMillisecondsStr;
            }
        }


        const aTimestampStr = aFullYearStr +aMonthStr + aDateStr +
            + aHoursStr + aMinutesStr + aSecondsStr;

        return aTimestampStr;
    }

}