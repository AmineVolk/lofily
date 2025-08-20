import jwt_decode from 'jwt-decode';

export const getCookieByField = (cookie: string, field: string): string => {
  const valueCookie = cookie?.split(';').find((cookieItem) => {
    const t = cookieItem.split('=');
    return t[0].trim() === field;
  });
  return valueCookie?.split('=')[1] || '';
};

export const getFieldFromAccessToken = (
  token: string,
  field: string,
): string => {
  if (!token) return '';
  const decodedToken = jwt_decode(token);
  return decodedToken[field];
};
