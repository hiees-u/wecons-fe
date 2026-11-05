import { fetchAdminPosts } from '../../utils/fetchAdminPosts'

export default defineCachedEventHandler(
  event => fetchAdminPosts(event),
  {
    name: 'blog-posts',
    maxAge: 60 * 5,
    swr: true,
    getKey: (event) => {
      const url = getRequestURL(event)
      return `posts:${url.search}`
    },
  },
)
