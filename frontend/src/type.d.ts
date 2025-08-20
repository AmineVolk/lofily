declare module 'react-floating-button';
export type DynamicComponentType = {
  [id: number]: () => JSX.Element;
};
type DynamicStringType = {
  [id: number]: string;
};

export enum BgType {
  FREE = 'free',
  PRIMUIM = 'premium',
}
declare let process: {
  env: {
    NEXT_PUBLIC_BACKEND_URL: string;
    NEXT_PUBLIC_STRIPE_PK: string;
  };
};
