import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import ThumbnailImage from "./ThumbnailImage";

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
      return (
        <ThumbnailImage url={row.thumbnailUrl} alt={row.title} id={row.id} />
      );
    },
    headerAlign: "center",
    hideSortIcons: true,
    align: "center",
  },
];

interface Props {
  data?: any[] | null;
  totalCount?: number | null;
  pagination?: GridPaginationModel;
  onChangePagination: (model: GridPaginationModel) => void;
}

const PhotosTable = ({
  data,
  totalCount,
  pagination,
  onChangePagination,
}: Props) => {
  return (
    <DataGrid
      columns={columns}
      rows={data || []}
      paginationMode="server"
      getRowHeight={() => "auto"}
      paginationModel={pagination}
      onPaginationModelChange={onChangePagination}
      pageSizeOptions={[5, 10, 15]}
      rowCount={totalCount ?? 0}
      rowSelection={false}
      style={{
        width: "100%",
      }}
    />
  );
};

export default PhotosTable;
