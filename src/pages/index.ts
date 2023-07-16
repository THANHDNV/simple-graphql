import { useQuery } from '@apollo/client'
import * as graphql from '../config/graphql'
import { useEffect } from 'react'

export const IndexPage = () => {
  const { loading, data, fetchMore } = useQuery(graphql.GET_PHOTOS)

  useEffect(() => {
    console.log(data?.photos)
  }, [data])

  return null
}
