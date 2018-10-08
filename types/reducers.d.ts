interface IRootReducers {
  appearances: IAppearancesReducers;
  features: IFeaturesReducers;
  galleries: IGalleriesReducers;
  news: INewsReducers;
  page: IPageReducers;
  releases: IReleasesReducers;
  resources: IResourcesReducers;
  stems: IStemsReducers;
}

interface IAppearancesReducers {
  currentLocation?: ILatLng;
  currentSlug?: string;
  error?: IError;
  hasAllItems: boolean;
  isLoading: boolean;
  items: {
    [index: string]: IAppearance;
  };
  lastEvaluatedKey?: {
    isActive?: string;
    slug: string;
    startingAt: string;
  };
}

interface IFeaturesReducers {
  items: string[];
}

interface IGalleriesReducers {
  currentSlug?: string;
  error?: IError;
  hasAllItems: boolean;
  isLoading: boolean;
  items: {
    [index: string]: IGallery;
  };
}

interface INewsReducers {
  currentSlug?: string;
  error?: IError;
  hasAllItems: boolean;
  isLoading: boolean;
  items: {
    [index: string]: INewsArticle;
  };
  lastEvaluatedKey?: {
    createdAt: string;
    isActive?: string;
    slug: string;
  };
}

interface IPageReducers {
  currentRoute?: string;
  error?: IError;
  hasNewVersion: boolean;
  isLoading: boolean;
  isNavOpen: boolean;
  isOnline: boolean;
  transitioningTo?: string;
}

interface IReleasesReducers {
  currentSlug?: string;
  error?: IError;
  hasAllItems: boolean;
  isLoading: boolean;
  items: {
    [index: string]: IRelease;
  };
  lastEvaluatedKey?: {
    releasedOn: string;
    isActive?: string;
    slug: string;
  };
}

interface IResourcesReducers {
  error?: IError;
  hasAllItems: boolean;
  isLoading: boolean;
  items: {
    [index: string]: IResource;
  };
  lastEvaluatedKey?: {
    createdAt: string;
    isActive?: string;
    slug: string;
  };
}

interface IStemsReducers {
  error?: IError;
  hasAllItems: boolean;
  isLoading: boolean;
  items: {
    [index: string]: IStem;
  };
  lastEvaluatedKey?: {
    createdAt: string;
    isActive?: string;
    slug: string;
  };
}
