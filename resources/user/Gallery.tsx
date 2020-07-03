import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@material-ui/core";
import ImageList from "../shared/ImageList";
import ProfileHeader from "./ProfileHeader";
import InfiniteScroll from "react-infinite-scroller";

interface Comment {
  id: number;
  created_at: string;
  updated_at: string;
  data: string;
  user: User;
}

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

interface Journal {
  id: number;
  created_at: string;
  updated_at: string;
  data: string;
  title: string;
}
interface User {
  id: number;
  name: string;
  email: string;
  description: string;
  birthday: string;
  private: boolean;
  tagline: string;
  updated_at: string;
  created_at: string;
  profile_comments: Comment[];
  feature_image: Image;
  feature_journal: Journal;
  images: Image[];
  following: User[];
  follower: User[];
  isFollowedByAuthUser?: boolean;
}

const Gallery = (): JSX.Element => {
  const [user, setUser] = useState<User>(null!);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { username } = useParams();

  useEffect(() => {
    loadMoreImages();
  }, []);

  const loadMoreImages = (): void => {
    fetch(`/user/${username}/gallery?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(true);
        if (data.success) {
          if (page === 1) {
            setUser({ ...data.user });
          } else {
            setUser({ ...user, images: [...user.images, ...data.user.images] });
          }
          setPage(page + 1);
          setHasMore(data.user.images.length >= 40);
        }
        setTimeout(() => setIsLoading(false), 1000);
      });
  };

  return (
    <>
      {user && (
        <InfiniteScroll
          pageStart={page}
          loadMore={loadMoreImages}
          hasMore={!isLoading && hasMore}
        >
          <ProfileHeader user={user} />
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            {user?.images && <ImageList images={user.images} />}
          </Box>
        </InfiniteScroll>
      )}
    </>
  );
};

export default Gallery;
