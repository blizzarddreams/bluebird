import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@material-ui/core";
import ImageList from "../shared/ImageList";
import ProfileHeader from "./ProfileHeader";

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
  const [user, setUser] = useState<User>(undefined!);
  const { username } = useParams();
  useEffect(() => {
    fetch(`/user/${username}/gallery`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
      });
  }, []);

  return (
    <>
      {user && (
        <>
          <ProfileHeader user={user} />
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            {user?.images && <ImageList images={user.images} />}
          </Box>
        </>
      )}
    </>
  );
};

export default Gallery;
