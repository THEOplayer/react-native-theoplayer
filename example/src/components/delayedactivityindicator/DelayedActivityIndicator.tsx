import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import React, { useEffect, useState } from 'react';

interface DelayedActivityIndicatorProps extends ActivityIndicatorProps {
  delay?: number;
}

const DEFAULT_DELAY = 200;

export const DelayedActivityIndicator = (props: DelayedActivityIndicatorProps) => {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    const { delay } = props;
    const timer = setTimeout(() => {
      setShowing(true);
    }, delay || DEFAULT_DELAY);
    return () => clearTimeout(timer);
  });

  return (
    <ActivityIndicator
      style={{
        opacity: showing ? 1.0 : 0.0,
      }}
      {...props}
    />
  );
};
