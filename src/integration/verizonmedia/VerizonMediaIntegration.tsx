import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import type { SourceDescription, THEOplayerView, THEOplayerViewProps } from 'react-native-theoplayer';
import { VerizonMediaConnector } from './VerizonMediaConnector';
import type { VerizonMediaPreplayResponse } from './source/VerizonMediaPreplayResponse';

export interface WithVerizonMediaProps extends THEOplayerViewProps {
  /**
   * Invoked on VerizonMedia prePlay response.
   */
  onVerizonPreplayResponse?: (response: VerizonMediaPreplayResponse) => void;
}

export const withVerizonMedia = (WrappedComponent: typeof THEOplayerView) => {
  interface WithVerizonMediaComponentProps extends WithVerizonMediaProps {
    forwardRef: ForwardedRef<any>;
  }
  function Wrapper(props: WithVerizonMediaComponentProps) {
    const [connector] = useState(new VerizonMediaConnector());
    const [src, setSrc] = useState<SourceDescription | undefined>(undefined);

    // Initial setup
    useEffect(() => {
      connector.setOnSourceReadyListener((src) => {
        setSrc(src);
      });
      connector.setOnPreplayResponseListener((response: VerizonMediaPreplayResponse) => {
        const { onVerizonPreplayResponse } = props;
        if (onVerizonPreplayResponse) {
          onVerizonPreplayResponse(response);
        }
      });
    }, []);

    // Source changes
    useEffect(() => {
      connector.setSource(props.source);
    }, [JSON.stringify(props.source)]);

    const { forwardRef, ...passThrougProps } = props;
    return <WrappedComponent {...passThrougProps} ref={forwardRef} source={src || {}} />;
  }

  const Wrapped = forwardRef((props: WithVerizonMediaProps, ref: ForwardedRef<typeof WrappedComponent>) => <Wrapper {...props} forwardRef={ref} />);
  Wrapped.displayName = 'VerizonMedia';
  return Wrapped;
};
