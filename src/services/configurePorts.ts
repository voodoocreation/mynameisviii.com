import { configureApi, configureMockApi, TApi, TMockApi } from "./configureApi";
import { configureHttpClient } from "./configureHttpClient";
import { configureLocalStorage } from "./configureLocalStorage";

export interface IPorts {
  api: TApi;
  dataLayer: any[];
  features: string[];
  maps: {
    [index: string]: any;
  };
}

export interface IPortsConfig {
  dataLayer?: any[];
  features?: string[];
  fetch: typeof window.fetch;
  maps?: {
    [index: string]: any;
  };
}

export interface ITestPorts {
  api: TMockApi;
  dataLayer: any[];
  features: string[];
  maps: {
    [index: string]: any;
  };
}

export interface ITestPortsParam {
  api?: Partial<TMockApi>;
  dataLayer?: any[];
  features?: string[];
  maps?: {
    [index: string]: any;
  };
}

export const configurePorts = (config: IPortsConfig): IPorts => {
  const dataLayer: any[] = config.dataLayer || [];
  dataLayer.push = dataLayer.push.bind(dataLayer);

  const api = configureApi(
    configureHttpClient({
      fetch: config.fetch
    }),
    configureLocalStorage()
  );

  return {
    api,
    dataLayer,
    features: config.features || [],
    maps: config.maps || {}
  };
};

export const configureTestPorts = (ports: ITestPortsParam = {}): ITestPorts => {
  const dataLayer: any[] = ports.dataLayer ? ports.dataLayer : [];
  const api: TMockApi = { ...configureMockApi(), ...(ports.api as any) };

  return {
    api,
    dataLayer,
    features: ports.features || [],
    maps: {
      ...window.google.maps,
      ...(ports.maps || {})
    }
  };
};
