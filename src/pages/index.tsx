import { useQuery } from "@apollo/client";
import * as graphql from "../config/graphql";
import MaterialContainer from "@mui/material/Container";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { styled } from "styled-components";
import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetchMore({
      variables: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      },
    });
  }, [fetchMore, paginationModel.page, paginationModel.pageSize]);

  return (
    <Container maxWidth="md">
      <Typography variant="h2">Photo Album</Typography>
      {loading && <CircularProgress />}
      {!!data && (
        <DataGrid
          columns={columns}
          rows={data.photos?.data || []}
          paginationMode="server"
          getRowHeight={() => "auto"}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 15]}
          rowCount={data.photos?.meta?.totalCount || 0}
          style={{
            width: "100%",
          }}
        />
      )}
    </Container>
  );
};
