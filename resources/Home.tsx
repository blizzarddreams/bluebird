import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import ImageList from "./shared/ImageList";
import InfiniteScroll from "react-infinite-scroller";

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

const Home = (): JSX.Element => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadMoreImages();
  }, []);

  const loadMoreImages = (): void => {
    setIsLoading(true);
    fetch(`/latest?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImages([...images, ...data.images]);

          setPage(page + 1);
          setHasMore(data.images.length >= 40);
        }
        setTimeout(() => setIsLoading(false), 1000);
      });
  };

  return (
    <InfiniteScroll
      pageStart={1}
      loadMore={loadMoreImages}
      hasMore={!isLoading && hasMore}
    >
      <Box>
        <Box display="flex" flexDirection="row" flexWrap="wrap">
          {images && <ImageList images={images} />}
        </Box>
      </Box>
    </InfiniteScroll>
  );
};

export default Home;
