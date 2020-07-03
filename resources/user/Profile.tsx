import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Theme,
  makeStyles,
  Grid,
  Button,
  TextField,
  fade,
  lighten,
  Paper,
} from "@material-ui/core";
import Moment from "../util/Moment";
import Comments from "../shared/Comments";
import Cookies from "js-cookie";
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
  feature_image?: Image;
  feature_journal?: Journal;
  following: User[];
  followers: User[];
  isFollowedByAuthUser?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    padding: theme.spacing(4),
    margin: theme.spacing(4),
    backgroundColor: "#192a3d", //"#030d15", //"#08141e",
  },
  input: {
    color: "#eee",
    borderColor: "#eee !important",
    "& .MuiFormLabel-root": {
      color: "#79838a",
    },
    "& .MuiOutlinedInput-root": {
      marginBottom: theme.spacing(1),
      color: "#eee",
      borderColor: "#eee !important",
      backgroundColor: fade("#66d0f9", 0.1),
      "&.Mui-focused fieldset": {
        borderColor: "#09a6f4",
        color: "#eee",
      },
    },
    "&:focus": {
      borderColor: "#eee",
    },
  },
  tagline: {
    fontStyle: "italic",
  },
  flex: {
    display: "flex",
  },
  imageContainer: {
    width: "100%",
    height: "40%",
    margin: theme.spacing(1),
    backgroundColor: "#66d0f91a", //"#192a3d", //"#08141e",
  },
  followContainer: {
    width: "100%",
    height: "40%",
    margin: theme.spacing(1),
    backgroundColor: "#66d0f91a", //"#192a3d", //"#08141e",
    //padding: theme.spacing(1),
  },
  container: {
    //width: "100%",
    padding: theme.spacing(1),
    minHeight: "40%",
    backgroundColor: "#66d0f91a", //"#192a3d", //"#08141e",
  },
  commentContainer: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    backgroundColor: "#66d0f91a", //"#192a3d", //"#08141e",
  },
  userFollow: {
    color: "#eee",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: {
    flexWrap: "nowrap",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#66d0f91a", //"#192a3d", //"#192a3d",
    color: "#dff0f7",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
  transparentBackground: {
    backgroundColor: "transparent",
    boxShadow: "none",
    border: "none",
  },
  flexBoxComments: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "transparent", //"#192a3d", //"#192a3d",
    color: "#dff0f7",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
  flexBoxImage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#66d0f91a", //"#192a3d", //"#192a3d",
    color: "#dff0f7",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    height: "40%",
  },
  grid: {
    margin: theme.spacing(1),
  },
  journalData: {
    marginTop: theme.spacing(1),
  },
  button: {
    color: "#eee",
    backgroundColor: "#288d75", //"#01090f",
    "&:hover": {
      backgroundColor: lighten("#288d75", 0.1),
    },
  },
}));

const Profile = (): JSX.Element => {
  const classes = useStyles();
  const { username } = useParams();
  const [user, setUser] = useState<User>(undefined!);
  const [comment, setComment] = useState("");
  const csrf = Cookies.get("XSRF-TOKEN")!;

  useEffect(() => {
    fetch(`/user/${username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) setUser(data.user);
      });
  }, []);

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetch("/comment", {
      method: "POST",
      body: JSON.stringify({
        comment_type: "profile",
        id: user.id,
        data: comment,
      }),
      headers: {
        "X-XSRF-TOKEN": csrf,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser({
            ...user,
            profile_comments: [data.comment, ...user.profile_comments].slice(
              0,
              10
            ),
          });
        }
      });
  };

  return (
    <>
      {user && (
        <>
          <ProfileHeader user={user} />
          <Grid container className={classes.gridContainer}>
            <Grid item xs={6} className={classes.grid}>
              {user?.feature_image && (
                <>
                  <Paper elevation={3} classes={{ root: classes.flexBoxImage }}>
                    <Link
                      to={`/view/${user.feature_image.id}`}
                      className={classes.image}
                    >
                      <img
                        src={`/storage/${user.feature_image.image_url}`}
                        className={classes.image}
                      ></img>
                    </Link>
                    <Typography variant="h5">
                      {user.feature_image.title}
                    </Typography>
                  </Paper>

                  <Paper classes={{ root: classes.flexBox }}>
                    <Typography variant="h4" align="center">
                      Following
                    </Typography>
                    <Box display="flex" flexDirection="row" flexWrap="wrap">
                      {user.following.map((user: User) => (
                        <Button className={classes.userFollow} key={user.id}>
                          {user.name}
                        </Button>
                      ))}
                    </Box>
                    <Typography variant="h4" align="center">
                      Followers
                    </Typography>
                    <Box display="flex" flexDirection="row" flexWrap="wrap">
                      {user.followers.map((user: User) => (
                        <Button className={classes.userFollow} key={user.id}>
                          {user.name}
                        </Button>
                      ))}
                    </Box>
                  </Paper>
                </>
              )}
            </Grid>
            <Grid item xs={6} className={classes.grid}>
              {user?.feature_journal && (
                <Paper elevation={2} classes={{ root: classes.flexBox }}>
                  <Typography variant="h5">
                    {user.feature_journal.title}
                  </Typography>
                  <Typography>
                    Created at{" "}
                    <Moment
                      timestamp={user.feature_journal.created_at}
                      fullTime
                    />
                  </Typography>
                  <Typography className={classes.journalData}>
                    {user.feature_journal.data}
                  </Typography>
                </Paper>
              )}

              <Paper
                elevation={2}
                classes={{
                  root: `${classes.flexBox} ${classes.transparentBackground}`,
                }}
              >
                <Typography variant="h4">Comments</Typography>

                <Box
                  component="form"
                  className={classes.form}
                  onSubmit={handleCommentSubmit}
                >
                  <TextField
                    name="comment"
                    id="outlined-basic"
                    label="Comment"
                    fullWidth
                    value={comment}
                    multiline
                    rows={"8"}
                    onChange={handleCommentChange}
                    variant="outlined"
                    classes={{
                      root: classes.input,
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    className={classes.button}
                  >
                    Submit
                  </Button>
                  <Comments comments={user?.profile_comments} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Profile;
