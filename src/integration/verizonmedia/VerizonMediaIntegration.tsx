import React, { PureComponent } from 'react';
import type { AdsAPI, SourceDescription, THEOplayerView, THEOplayerViewComponent, THEOplayerViewProps } from 'react-native-theoplayer';
import { VerizonMediaConnector } from './VerizonMediaConnector';
import type { VerizonMediaPreplayResponse } from './source/VerizonMediaPreplayResponse';

interface WithVerizonMediaState {
  src?: SourceDescription;
}

export interface WithVerizonMediaProps extends THEOplayerViewProps {
  /**
   * Invoked on VerizonMedia prePlay response.
   */
  onVerizonPreplayResponse?: (response: VerizonMediaPreplayResponse) => void;
}

export type WithVerizonMediaComponent = THEOplayerViewComponent;

export const withVerizonMedia = (WrappedComponent: typeof THEOplayerView) =>
  class Wrapper extends PureComponent<WithVerizonMediaProps, WithVerizonMediaState> implements WithVerizonMediaComponent {
    readonly _root: React.RefObject<THEOplayerView>;

    readonly _verizonIntegration = new VerizonMediaConnector();

    static initialState: WithVerizonMediaState = {
      src: undefined,
    };

    constructor(props: WithVerizonMediaProps) {
      super(props);
      this._root = React.createRef();
      this.state = Wrapper.initialState;
    }

    componentDidMount() {
      // Install Verizon integration.
      this._verizonIntegration.setOnSourceReadyListener((src) => {
        this.setState({ src });
      });
      this._verizonIntegration.setOnPreplayResponseListener((response: VerizonMediaPreplayResponse) => {
        const { onVerizonPreplayResponse } = this.props;
        if (onVerizonPreplayResponse) {
          onVerizonPreplayResponse(response);
        }
      });
      const { source } = this.props;
      this.applySource(source);
    }

    componentDidUpdate(prevProps: Readonly<THEOplayerViewProps>) {
      const { source } = this.props;
      const { source: prevSource } = prevProps;
      if (JSON.stringify(source) !== JSON.stringify(prevSource)) {
        // Update source
        this.applySource(source);
      }
    }

    applySource(source: SourceDescription) {
      this._verizonIntegration.setSource(source);
    }

    public get ads(): AdsAPI {
      const adsApi = this._root?.current?.ads;
      return adsApi!; // TODO
    }

    seek(seekTime: number): void {
      return this._root?.current?.seek(seekTime);
    }

    render() {
      const wrapperProps = Object.assign({}, this.props);
      const { src } = this.state;
      return <WrappedComponent {...wrapperProps} ref={this._root} source={src || {}} />;
    }
  };
