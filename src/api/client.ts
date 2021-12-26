const root = 'http://localhost:3001';

async function withoutBody<ResponseType>(endpoint: string, method: string): Promise<ResponseType> {
  const res = await fetch(root + endpoint, { method });
  return (await res.json()) as ResponseType;
}

async function withBody<RequestType, ResponseType>(
  endpoint: string,
  method: string,
  request: RequestType,
): Promise<ResponseType> {
  const res = await fetch(root + endpoint, {
    method,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return (await res.json()) as ResponseType;
}

async function get<ResponseType>(endpoint: string): Promise<ResponseType> {
  return withoutBody(endpoint, 'GET');
}

async function post<RequestType, ResponseType>(
  endpoint: string,
  request: RequestType,
): Promise<ResponseType> {
  return withBody(endpoint, 'POST', request);
}

async function put<RequestType, ResponseType>(
  endpoint: string,
  request: RequestType,
): Promise<ResponseType> {
  return withBody(endpoint, 'PUT', request);
}

export default {
  get,
  post,
  put,
};
