import React, { useState } from "react";
import {
  Box,
  Typography,
  makeStyles,
  Theme,
  Button,
  Paper,
  lighten,
} from "@material-ui/core";
import Gravatar from "../util/Gravatar";
import Moment from "../util/Moment";
import {
  CalendarToday as RegisteredIcon,
  Cake as BirthdayIcon,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

interface User {
  id: number;
  name: string;
  email: string;
  tagline: string;
  created_at: string;
  isFollowedByAuthUser?: boolean;
}
interface ProfileHeaderProps {
  user: User;
}

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    display: "flex",
    justifyContent: "space-between",
    color: "#eee",
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    backgroundColor: "#66d0f91a", //"#192a3d", //"#030d15", //"#08141e",
  },
  tagline: {
    fontStyle: "italic",
  },
  flex: {
    display: "flex",
  },
  link: {
    color: "#6de6a8",
  },
  boxwidth100: {
    width: "100%",
  },
  notFollowingButton: {
    borderColor: "#6de6a8",
  },
  followingButton: {
    backgroundColor: "#6de6a8",
    "&:hover": {
      backgroundColor: lighten("#6de6a8", 0.1),
    },
  },
}));
const ProfileHeader = ({ user }: ProfileHeaderProps): JSX.Element => {
  const csrf = Cookies.get("XSRF-TOKEN")!;
  const [isFollowingUser, setIsFollowingUser] = useState<boolean | undefined>(
    user.isFollowedByAuthUser
  );
  console.log(user.isFollowedByAuthUser);
  const followUser = (e: React.MouseEvent<HTMLButtonElement>): void => {
    fetch("/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrf,
      },
      body: JSON.stringify({ id: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsFollowingUser(data.following);
        }
      });
  };
  const classes = useStyles();
  return (
    <>
      <Paper elevation={3} className={classes.box}>
        <Box display="flex" flexDirection="row" className={classes.boxwidth100}>
          <Box
            display="flex"
            flexDirection="row"
            className={classes.boxwidth100}
          >
            <Gravatar email={user.email} size={10} />
            <Box display="flex" flexDirection="column">
              <Typography variant="h5">{user.name}</Typography>
              <Typography variant="h6" className={classes.tagline}>
                {user.tagline}
              </Typography>
              <Typography variant="h6" className={classes.flex}>
                <RegisteredIcon />
                Registered at <Moment timestamp={user.created_at} fullTime />
              </Typography>
            </Box>
          </Box>
          <Box>
            {user.isFollowedByAuthUser ? (
              isFollowingUser ? (
                <Button
                  onClick={followUser}
                  className={classes.followingButton}
                  variant="contained"
                >
                  Following
                </Button>
              ) : (
                <Button
                  onClick={followUser}
                  className={classes.notFollowingButton}
                  variant="outlined"
                >
                  Follow
                </Button>
              )
            ) : null}
          </Box>
        </Box>
      </Paper>
      <Paper className={classes.box}>
        <Link to={`/profile/${user.name}/gallery`}>
          <Button className={classes.link}>Gallery</Button>
        </Link>
        <Link to={`/profile/${user.name}/journals`} className={classes.link}>
          <Button className={classes.link}>Journals</Button>
        </Link>
      </Paper>
    </>
  );
};

export default ProfileHeader;
