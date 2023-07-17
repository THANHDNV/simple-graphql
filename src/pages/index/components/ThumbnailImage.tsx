import { styled } from "@mui/material";
import { useCallback, useState } from "react";
import DetailImageModal from "./DetailImageModal";

const Image = styled("img")`
  cursor: pointer;
`;

interface Props {
  url: string;
  alt: string;
  id: string;
}

const ThumbnailImage = ({ url, alt, id }: Props) => {
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const onClickImage = useCallback(() => {
    setOpenDetailModal(true);
  }, [setOpenDetailModal]);

  return (
    <>
      <Image src={url} alt={alt} onClick={onClickImage} />
      <DetailImageModal
        id={id}
        open={openDetailModal}
        setOpen={setOpenDetailModal}
      />
    </>
  );
};

export default ThumbnailImage;
