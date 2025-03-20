// This middleware file enables outbound access for Cloudflare Functions
export const onRequest = async ({ next }) => {
  return await next();
}; 