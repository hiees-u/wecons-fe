export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return '8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c'
})

