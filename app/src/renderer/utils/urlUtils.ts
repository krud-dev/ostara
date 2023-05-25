import { UrlInfo, urls } from '../routes/urls';
import { findLast } from 'lodash';
import { matchPath } from 'react-router-dom';

export type PathParam<Path extends string> =
  // check if path is just a wildcard
  Path extends '*'
    ? '*'
    : // look for wildcard at the end of the path
    Path extends `${infer Rest}/*`
    ? '*' | PathParamRecursive<Rest>
    : // look for params in the absence of wildcards
      PathParamRecursive<Path>;

type PathParamRecursive<Path extends string> =
  // split path into individual path segments
  Path extends `${infer L}/${infer R}`
    ? PathParamRecursive<L> | PathParamRecursive<R>
    : // find params after `:`
    Path extends `${string}:${infer Param}`
    ? Param
    : // otherwise, there aren't any params present
      never;

export const getUrlInfo = (pathname: string): UrlInfo | undefined => {
  return findLast(urls, (u) => !!matchPath({ path: u.url }, pathname));
};
