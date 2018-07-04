declare module "*.json";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.png";
declare module "*.svg";

declare module "jest-mock-axios";
declare module "lodash.merge";
declare module "next-redux-saga";
declare module "react-relative-time";
declare module "redux-saga-tester";

type TInputEvent = React.FormEvent<HTMLInputElement>;

// tslint:disable-next-line
interface Window {
  __NEXT_DATA__: {
    initialProps?: any;
    props?: any;
    page?: string;
  };
  __NEXT_REDUX_STORE__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (...args: any[]) => any;
  dataLayer: Array<{}>;
  google: {
    maps: any;
    [index: string]: any;
  };
  isServer?: boolean;
  Promise: any;
}

type TPromiseExecutor = (
  resolve: (value?: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void
) => void;

interface IStorePorts {
  dataLayer: Array<{}>;
  api: {
    [index: string]: any;
  };
  maps: {
    [index: string]: any;
  };
}

interface IError {
  message: string;
  status: number;
}

interface IImage {
  title: string;
  imageUrl: string;
}

interface IBuyStreamLink {
  platform: string;
  url: string;
}

interface INewsArticle {
  author: string;
  content: string;
  createdAt: string;
  excerpt: string;
  imageUrl: string;
  ogImageUrl: string;
  slug: string;
  title: string;
  type: string;
}

interface IReleaseTrack {
  genre: string;
  length: string;
  title: string;
  url: string;
}

interface IArtist {
  name: string;
  url: string;
}

interface IRelease {
  artist: IArtist;
  buyList: IBuyStreamLink[];
  description: string;
  genre: string;
  images: IImage[];
  isActive: boolean;
  length: string;
  productionType: string;
  recordLabel: string;
  releasedOn: string;
  slug: string;
  streamList: IBuyStreamLink[];
  title: string;
  tracklist: IReleaseTrack[][];
  type: string;
}

interface ILatLng {
  lat: number;
  lng: number;
}

interface ILocation {
  address?: string;
  latLng?: ILatLng;
  name: string;
  type: string;
  url?: string;
}

interface IOrganization {
  email?: string;
  logo: string;
  name: string;
  type?: string;
}

interface IPerformer {
  genre: string;
  imageUrl: string;
  location: ILocation;
  name: string;
  type?: string;
  url?: string;
}

interface IOffer {
  availability: string;
  name: string;
  price: number;
  priceCurrency: string;
  url?: string;
  validFrom?: string;
}

interface IPriceRange {
  min?: IOffer;
  max?: IOffer;
}

interface IAppearance {
  acts: IPerformer[];
  audience?: string;
  description: string;
  finishingAt: string;
  images: IImage[];
  imageUrl: string;
  isActive: boolean;
  location: ILocation;
  ogImageUrl: string;
  organizer: IOrganization;
  sales: IOffer[];
  slug: string;
  startingAt: string;
  status: string;
  title: string;
  type: string;
}
