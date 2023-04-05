export function transformDate(d) {
    const date = new Date(d);
    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    };
    return date.toLocaleString('en-GB', options);
  }