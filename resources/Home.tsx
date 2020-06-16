import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  Theme,
  darken,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "./shared/ImageList";

interface User {
  name: string;
  id: number;
}
interface Image {
  created_at: string;
  description: string;
  id: number;
  image_url: string;
  nsfw: boolean;
  thumbnail_url: string;
  title: string;
  updated_at: string;
  user_id: number;
  user: User;
}

const useStyles = makeStyles((theme: Theme) => ({
  nsfw: {
    border: `${theme.spacing(0.5)}px solid #9E0031`,
  },
  sfw: {
    border: `${theme.spacing(0.5)}px solid #21A179`, //#81AE9D
  },
}));

const Home = (): JSX.Element => {
  const [images, setImages] = useState<Image[]>();
  const classes = useStyles();

  useEffect(() => {
    fetch("/latest")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImages(data.images);
        }
      });
  }, []);

  return (
    <Box>
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {images && <ImageList images={images} />}
      </Box>
    </Box>
  );
};

export default Home;
