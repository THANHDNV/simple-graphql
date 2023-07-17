import { useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Modal, styled } from "@mui/material";
import * as graphql from "../../../config/graphql";
import { grey } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback } from "react";

const Wrapper = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 72px 24px 24px;
  display: flex;
  align-items: center;
  background: ${grey[50]};
  border-radius: 8px;
  min-height: 96px;
  min-width: 108px;
  max-height: 100%;
  max-width: 100%;
`;

const CloseButton = styled(Button)`
  position: absolute;
  min-width: 40px;
  width: 40px;
  height: 40px;
  top: 24px;
  right: 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${grey[50]};
  border: 1px solid ${grey[600]};
  color: ${grey[600]};

  &:hover {
    background: ${grey[100]};
`;

const Image = styled("img")`
  max-width: calc(100vw - 24px * 2);
  max-height: calc(100vh - 24px - 72px);
`;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}

const DetailImageModal = ({ open, setOpen, id }: Props) => {
  const { loading, data } = useQuery(graphql.GET_PHOTO_DETAIL, {
    variables: {
      id,
    },
  });

  const onClose = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Modal open={open} onClose={onClose} data-testid={`photo-detail-modal`}>
      <Wrapper>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        {loading && <CircularProgress />}
        {!loading && !!data?.photo?.url && (
          <Image
            src={data.photo.url}
            alt={data.photo.title as string}
            data-testid={`photo-detail-modal-image`}
          />
        )}
      </Wrapper>
    </Modal>
  );
};

export default DetailImageModal;
