import { fetchAdminPosts } from '../../../utils/fetchAdminPosts'

export default defineCachedEventHandler(
  event => fetchAdminPosts(event, getRouterParam(event, 'id')),
  {
    name: 'blog-post-detail',
    maxAge: 60 * 10,
    swr: true,
    getKey: event => getRouterParam(event, 'id') || 'invalid',
  },
)
