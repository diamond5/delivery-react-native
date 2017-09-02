class Datehelpers {

  static GetFormattedDate(date) {

    if (date !== undefined && date !== null) {
      var d = date.split('-')
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return d[2] +' '+months[Number(d[1]-1)] + ', ' + d[0]
    }
    else {
      return ' '
    }
  }

  static GetFormattedTime(time) {
    if (time !== undefined && time !== null) {
     time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
       if (time.length > 1) { 
         time = time.slice (1);
         time[5] = +time[0] < 12 ? ' AM' : ' PM';
         time[0] = +time[0] % 12 || 12; 
       }
     return time.join ('');
    }
    else {
      return ' '
    }
  }

  static GetFormattedTimeFromDateTime(dateTime) {

    if (dateTime !== undefined && dateTime !== null) {
      dateTime = String(dateTime);
      var d = new Date(dateTime);
      return (d.getHours() >= 10 ? String(d.getHours()):"0"+String(d.getHours())) + ":" + (d.getMinutes() >= 10 ? String(d.getMinutes()):"0"+String(d.getMinutes()));
    }
    else {
      return ' '
    }
  }

}
export default Datehelpers
