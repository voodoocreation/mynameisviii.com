// tslint:disable max-classes-per-file

declare module "next/app" {
  export default class App extends React.Component {}
  export class Container extends React.Component {}
}

interface INextPageComponentMethods {
  getInitialProps?(props: any): Promise<any>;
}
type NextPageComponent<P> =
  | React.ComponentClass<P> & INextPageComponentMethods
  | React.StatelessComponent<P> & INextPageComponentMethods;

// tslint:enable max-classes-per-file
