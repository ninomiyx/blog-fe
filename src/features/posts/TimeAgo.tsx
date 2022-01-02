import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const TimeAgo: React.FunctionComponent<{ timestamp: Date }> = ({ timestamp }) => {
  let TimeStr = '';
  if (timestamp) {
    const date = new Date(timestamp);
    const timePeriod = formatDistanceToNow(date);
    TimeStr = `${timePeriod} ago`;
  }
  return (
    <span>
      &nbsp;
      <i>{TimeStr}</i>
    </span>
  );
};

export default TimeAgo;
