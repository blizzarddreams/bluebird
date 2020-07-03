import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import { Pagination } from "@material-ui/lab";
import { TextField, Box } from "@material-ui/core";
import ImageList from "./shared/ImageList";
import InfiniteScroll from "react-infinite-scroller";

interface Image {
  id: number;
  image_url: string;
  thumbnail_url: string;
  nsfw: boolean;
  title: string;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    id: number;
  };
}

const Search = (): JSX.Element => {
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(document.location.search.substring(1)).get("qs")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    loadMoreImages();
  }, [searchParams]);

  const loadMoreImages = (): void => {
    fetch(`/search-images${location.search}&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(true);
        if (data.success) {
          setImages([...images, ...data.images]);

          setPage(page + 1);
          setHasMore(data.images.length >= 40);
        }
        setTimeout(() => setIsLoading(false), 1000);
      });
  };

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setPage(1);
    history.push(`/search-images?qs=${search}&page=${page}`);
    setSearchParams(search);
  };

  return (
    <InfiniteScroll
      pageStart={page}
      loadMore={loadMoreImages}
      hasMore={!isLoading && hasMore}
    >
      <form onSubmit={handleSearch}>
        <TextField onChange={handleSearchValue} />
      </form>
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {images && <ImageList images={images} />}
      </Box>
    </InfiniteScroll>
  );
};

export default Search;
