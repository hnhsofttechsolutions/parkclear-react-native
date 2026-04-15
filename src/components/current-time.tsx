import React, { useEffect, useState } from 'react';
import { Colors } from '../utils/colors';
import AppText from './ui/app-text';

const CurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AppText
      font="bold"
      size={32}
      color={Colors.white}
      align="center"
      style={{ marginTop: 20 }}
    >
      {formatTime(time)}
    </AppText>
  );
};

export default CurrentTime;
