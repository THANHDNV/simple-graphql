import { gql } from "../../__generated__";

export const GET_PHOTOS = gql(`
  query GET_PHOTOS($page: Int = 1, $limit: Int = 10, $search: String) {
    photos(options: {
      paginate: {
        page: $page
        limit: $limit
      }
      search: {
        q: $search
      }
    }) {
      data {
        id
        title
        thumbnailUrl
      }
      meta {
        totalCount
      }
    }
  }
`)
