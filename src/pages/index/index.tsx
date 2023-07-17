import { useQuery } from "@apollo/client";
import * as graphql from "../../config/graphql";
import { GridPaginationModel } from "@mui/x-data-grid";
import {
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounceCallback } from "@react-hook/debounce";
import { Container } from "./styled";
import PhotosTable from "./components/PhotosTable";

export const IndexPage = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const { loading, data, fetchMore } = useQuery(graphql.GET_PHOTOS, {
    defaultOptions: {
      variables: {
        limit: 5,
        page: 1,
      },
    },
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [search, setSearch] = useState("");

  const onPaginationModelChange = useCallback(
    async (model: GridPaginationModel) => {
      if (isLoadingMore) return;

      setIsLoadingMore(true);

      await fetchMore({
        variables: {
          page: model.page + 1,
          limit: model.pageSize,
        },
      }).finally(() => {
        setIsLoadingMore(false);
      });

      setPaginationModel(model);
    },
    [fetchMore, isLoadingMore]
  );

  const onSearch: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const value = event.target.value;

      setSearch(value);
    },
    []
  );

  const onChangeSearchTerm = useDebounceCallback(
    (searchTerm: string) => {
      setIsLoadingMore(true);

      fetchMore({
        variables: {
          page: 1,
          limit: paginationModel.pageSize,
          search: searchTerm,
        },
      })
        .then(() => {
          setPaginationModel((currentModel) => ({
            ...currentModel,
            page: 0,
          }));
        })
        .finally(() => {
          setIsLoadingMore(false);
        });
    },
    150,
    false
  );

  useEffect(() => {
    onChangeSearchTerm(search);
  }, [onChangeSearchTerm, search]);

  return (
    <Container maxWidth="md">
      <Typography variant="h2">Photo Album</Typography>
      <TextField
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        value={search}
        onChange={onSearch}
      />
      {!!data && (
        <PhotosTable
          data={data.photos?.data}
          totalCount={data.photos?.meta?.totalCount}
          pagination={paginationModel}
          onChangePagination={onPaginationModelChange}
        />
      )}
      {(loading || isLoadingMore) && <CircularProgress />}
    </Container>
  );
};
