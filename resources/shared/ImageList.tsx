import React from "react";
import { makeStyles, Theme, Box, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

interface User {
  name: string;
  id: number;
}

interface Image {
  id: number;
  image_url: string;
  thumbnail_url: string;
  nsfw: boolean;
  title: string;
  created_at: string;
  updated_at: string;
  user: User;
}

interface ImageListProps {
  images: Image[];
}
const useStyles = makeStyles((theme: Theme) => ({
  nsfw: {
    border: `${theme.spacing(0.5)}px solid #9E0031`,
  },
  sfw: {
    border: `${theme.spacing(0.5)}px solid #21A179`, //#81AE9D
  },
}));

const ImageList = ({ images }: ImageListProps): JSX.Element => {
  const classes = useStyles();
  return (
    <>
      {images.length > 0 ? (
        <>
          {images.map((image) => (
            <Box
              key={image.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexDirection="column"
              style={{ padding: "1rem" }}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                style={{ height: "100%" }}
              >
                <Link to={`/view/${image.id}/`}>
                  <img
                    src={`/storage/${image.thumbnail_url}`}
                    className={image.nsfw ? classes.nsfw : classes.sfw}
                  ></img>
                </Link>
              </Box>
              <Typography variant="body1">{image.title}</Typography>
              <Typography variant="body2">{image.user.name}</Typography>
            </Box>
          ))}
        </>
      ) : (
        <h1>No images.</h1>
      )}
    </>
  );
};

export default ImageList;
