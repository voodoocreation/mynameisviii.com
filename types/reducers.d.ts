interface IRootReducers {
  appearances: IAppearancesReducers;
  news: INewsReducers;
  page: IPageReducers;
  releases: IReleasesReducers;
}

interface IAppearancesReducers {
  currentLocation?: ILatLng;
  currentSlug?: string;
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

interface INewsReducers {
  currentSlug?: string;
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

interface IReleasesReducers {
  currentSlug?: string;
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

interface IPageReducers {
  error?: IError;
  isLoading: boolean;
  isNavOpen: boolean;
  transitioningTo?: string;
}
