import { useQuery } from "@apollo/client";
import * as graphql from "../config/graphql";
import MaterialContainer from "@mui/material/Container";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { styled } from "styled-components";
import {
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounceCallback } from "@react-hook/debounce";

const Container = styled(MaterialContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
`;

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "id",
    width: 12,
    resizable: false,
    disableColumnMenu: true,
    headerAlign: "center",
    hideSortIcons: true,
    align: "center",
  },
  {
    field: "title",
    headerName: "Title",
    flex: 0.75,
    disableColumnMenu: true,
    headerAlign: "center",
    hideSortIcons: true,
  },
  {
    field: "thumbnailUrl",
    headerName: "Thumbnail",
    disableColumnMenu: true,
    flex: 1,
    renderCell: ({ row }) => {
      return <img src={row.thumbnailUrl} alt={row.title} />;
    },
    headerAlign: "center",
    hideSortIcons: true,
    align: "center",
  },
];

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
        <DataGrid
          columns={columns}
          rows={data.photos?.data || []}
          paginationMode="server"
          getRowHeight={() => "auto"}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={[5, 10, 15]}
          rowCount={data.photos?.meta?.totalCount || 0}
          style={{
            width: "100%",
          }}
        />
      )}
      {(loading || isLoadingMore) && <CircularProgress />}
    </Container>
  );
};
