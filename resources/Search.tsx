import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import { Pagination } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import ImageList from "./shared/ImageList";

const Search = (): JSX.Element => {
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(document.location.search.substring(1)).get("qs")
  );

  const [images, setImages] = useState<any>();

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setPage(1);
    history.push(`/search?qs=${search}`);
    setSearchParams(search);
  };

  useEffect(() => {
    fetch(`/search${location.search}&page=${page}`, {
      headers: { "X-CSRF-TOKEN": Cookies.get("XSRF-TOKEN")! },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImages(data.images);
          setPage(page + 1);
          console.log(data.images);
        }
      });
  }, [searchParams]);

  const handlePageChange = (
    e: React.ChangeEvent<unknown>,
    page: number
  ): void => {
    setPage(page);
    fetch(`/search?qs=${search || searchParams}&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImages(data.images);
          console.log(data.images);
        }
      });
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <TextField onChange={handleSearchValue} />
      </form>
      {images && <ImageList images={images} />}
      <Pagination count={10} onChange={handlePageChange} size="large" />;
    </>
  );
};

export default Search;
