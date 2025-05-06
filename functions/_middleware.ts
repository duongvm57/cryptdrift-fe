export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/api')) {
      const apiUrl = `https://api.vozlit.store${url.pathname}${url.search}`;
      
      return fetch(apiUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' ? request.body : undefined
      });
    }
    
    return context.next();
  }