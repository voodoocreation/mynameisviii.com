/* tslint:disable:interface-over-type-literal */

type PLUpdateOnlineStatus = boolean;

type PLSetCurrentRoute = string;
type PLChangeRouteStarted = string;
type PLChangeRouteDone = undefined;
type PLChangeRouteFailed = IError;

type PLFetchAppearancesDone = {
  items: {
    [index: string]: IAppearance;
  };
  lastEvaluatedKey?: {
    isActive: string;
    slug: string;
    startingAt: string;
  };
};
type PLFetchAppearancesFailed = IError;
type PLFetchAppearanceBySlugStarted = string;
type PLFetchAppearanceBySlugDone = IAppearance;
type PLFetchAppearanceBySlugFailed = IError;
type PLGeocodeCurrentAppearanceAddressDone = ILatLng;
type PLGeocodeCurrentAppearanceAddressFailed = IError;
type PLSetCurrentAppearanceSlug = string;

type PLFetchLatestNewsDone = {
  items: {
    [index: string]: INewsArticle;
  };
  lastEvaluatedKey?: {
    createdAt: string;
    isActive: string;
    slug: string;
  };
};
type PLFetchLatestNewsFailed = IError;
type PLFetchNewsArticleBySlugStarted = string;
type PLFetchNewsArticleBySlugDone = INewsArticle;
type PLFetchNewsArticleBySlugFailed = IError;
type PLSetCurrentNewsArticleSlug = string;

type PLFetchReleasesDone = {
  items: {
    [index: string]: IRelease;
  };
  lastEvaluatedKey?: {
    isActive: string;
    releasedOn: string;
    slug: string;
  };
};
type PLFetchReleasesFailed = IError;
type PLFetchReleaseBySlugStarted = string;
type PLFetchReleaseBySlugDone = IRelease;
type PLFetchReleaseBySlugFailed = IError;
type PLSetCurrentReleaseSlug = string;

type PLFetchStemsDone = {
  items: {
    [index: string]: IStem;
  };
  lastEvaluatedKey?: {
    isActive: string;
    createdAt: string;
    slug: string;
  };
};
type PLFetchStemsFailed = IError;

type PLTrackEvent = {
  event: string;
  [index: string]: any;
};

/* tslint:enable:interface-over-type-literal */
