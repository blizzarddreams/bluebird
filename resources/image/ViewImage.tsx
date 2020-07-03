import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Grid,
  makeStyles,
  Theme,
  Typography,
  Button,
  lighten,
  fade,
  TextField,
} from "@material-ui/core";
import {
  Star as StarIcon,
  GetApp as DownloadIcon,
  LocalActivityOutlined as FeatureIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon, // CreateIcon
} from "@material-ui/icons";
import Cookies from "js-cookie";
import Gravatar from "../util/Gravatar";
import Moment from "../util/Moment";
import Comments from "../shared/Comments";
interface User {
  name: string;
  id: number;
  email: string;
}

interface Comment {
  id: number;
  created_at: string;
  updated_at: string;
  image_id?: number;
  profile_id?: number;
  journal_id?: number;
  data: string;
  user: User;
}

interface Tag {
  id: number;
  name: string;
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
  favorited: boolean;
  user: User;
  comments: Comment[];
  tags: Tag[];
  isOwnedByViewingUser?: boolean;
  featured?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  buttonSubmit: {
    width: "95%",
  },
  padding: {
    padding: theme.spacing(1),
  },
  nsfw: {
    border: `${theme.spacing(0.5)}px solid #9E0031`,
  },
  sfw: {
    border: `${theme.spacing(0.5)}px solid #21A179`, //#81AE9D
  },
  nsfwText: {
    color: "#9E0031",
  },
  sfwText: {
    color: "#21A179",
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  isFavoritedButton: {
    backgroundColor: "#ffCb47",
    "&:hover": {
      backgroundColor: lighten("#ffcb47", 0.1),
    },
  },
  isNotFavoritedButton: {
    color: "#eee",
    borderColor: "#ffcb47",
    "&:hover": {
      backgroundColor: fade("#ffcb47", 0.1),
    },
    "& .MuiTouchRipple-root": {
      color: "#ffcb47",
    },
  },
  isFeaturedButton: {
    backgroundColor: "#edb4d1",
    "&:hover": {
      backgroundColor: lighten("#edb4d1", 0.1),
    },
  },
  isNotFeaturedButton: {
    color: "#eee",
    borderColor: "#edb4d1",
    "&:hover": {
      backgroundColor: fade("#edb4d1", 0.1),
    },
    "& .MuiTouchRipple-root": {
      color: "#edb4d1",
    },
  },
  starButton: {
    color: "#FFCB47",
  },
  downloadButton: {
    color: "#eee",
    borderColor: "#76f7bf",
    "&:hover": {
      backgroundColor: fade("#76f7bf", 0.1),
    },
    "& .MuiTouchRipple-root": {
      color: "#76f7bf",
    },
    /*"&:hover": {
      backgroundColor: lighten("#76f7bf", 0.1),
    },*/
  },
  deleteButton: {
    color: "#eee",
    borderColor: "#ff6978",
    width: "100%",
    "&:hover": {
      backgroundColor: fade("#ff6978", 0.1),
    },
    "& .MuiTouchRipple-root": {
      color: "#ff6978",
    },
  },
  editButton: {
    color: "#eee",
    borderColor: "#6cdda3", //"#72dd6c",
    width: "100%",
    "&:hover": {
      backgroundColor: fade("#6cdda3", 0.1),
    },
    "& .MuiTouchRipple-root": {
      color: "#6cdda3",
    },
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    padding: theme.spacing(1),
    backgroundColor: "#66d0f91a", //"#08141e",
  },
  commentContainer: {
    margin: theme.spacing(1),
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
    width: "95%",
    "&:focus": {
      borderColor: "#eee",
    },
  },
  submitButton: {
    color: "#eee",
    backgroundColor: "#288d75", //"#01090f",
    "&:hover": {
      backgroundColor: lighten("#288d75", 0.1),
    },
  },
  form: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  tagButton: {
    margin: theme.spacing(1),
    borderColor: "#28718d",
    color: "#eee",
  },
  box: {
    width: "100%",
  },
}));

const ViewImage = (): JSX.Element => {
  const [image, setImage] = useState<Image>(undefined!);
  const [text, setText] = useState("");
  const { imageId } = useParams();
  const classes = useStyles();
  const csrf = Cookies.get("XSRF-TOKEN")!;

  useEffect(() => {
    fetch(`/image/${imageId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImage(data.image);
        }
      });
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetch("/comment", {
      method: "POST",
      body: JSON.stringify({
        comment_type: "image",
        id: image.id,
        data: text,
      }),
      headers: {
        "X-XSRF-TOKEN": csrf,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImage({ ...image, comments: image.comments.concat(data.comment) });
        }
      });
  };

  const handleFavorite = (): void => {
    fetch("/image/favorite", {
      method: "POST",
      body: JSON.stringify({ id: image?.id }),
      headers: {
        "X-XSRF-TOKEN": csrf,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImage({
            ...image,
            favorited: data.favorited as boolean,
          });
        }
      });
  };

  const handleFeature = (): void => {
    fetch("/image/feature", {
      method: "POST",
      body: JSON.stringify({ id: image?.id }),
      headers: {
        "X-XSRF-TOKEN": csrf,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data.featured);
          setImage({
            ...image,
            featured: data.featured as boolean,
          });
        }
      });
  };
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      {image && (
        <Grid container>
          <Grid item xs={10} className={classes.padding}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              className={classes.imageContainer}
            >
              <img
                src={`/storage/${image.image_url}`}
                className={`${classes.image} ${
                  image.nsfw ? classes.nsfw : classes.sfw
                }`}
              ></img>
              <Box
                display="flex"
                className={classes.box}
                flexDirection="column"
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  className={classes.box}
                >
                  <Typography variant="h4">{image.title}</Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  className={classes.box}
                >
                  <Gravatar email={image.user.email} size={4} />
                  <Typography variant="body1">
                    {image.user.name} posted at{" "}
                    <Box component="span" fontStyle="italic">
                      <Moment timestamp={image.created_at} fullTime />
                    </Box>
                  </Typography>
                </Box>
                <Typography>{image.description}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              {image.nsfw ? (
                <Typography variant="h4" className={classes.nsfwText}>
                  NSFW
                </Typography>
              ) : (
                <Typography variant="h4" className={classes.sfwText}>
                  SFW
                </Typography>
              )}
              <Box display="flex" flexDirection="column">
                <a
                  href={`/storage/${image.image_url}`}
                  download
                  style={{ width: "100%" }}
                >
                  <Button
                    className={`${classes.downloadButton} ${classes.button}`}
                    variant="outlined"
                  >
                    <DownloadIcon /> Download
                  </Button>
                </a>
                <Button
                  variant={image.favorited ? "contained" : "outlined"}
                  onClick={handleFavorite}
                  className={`${
                    image.favorited
                      ? classes.isFavoritedButton
                      : classes.isNotFavoritedButton
                  } ${classes.button}`}
                >
                  <StarIcon />
                  {image.favorited ? " Favorited" : " Favorite"}
                </Button>
                {image.isOwnedByViewingUser ? (
                  <>
                    <Button
                      variant={image.featured ? "contained" : "outlined"}
                      onClick={handleFeature}
                      className={`${
                        image.featured
                          ? classes.isFeaturedButton
                          : classes.isNotFeaturedButton
                      } ${classes.button}`}
                    >
                      <FeatureIcon />
                      {image.featured ? "Featured" : "Feature"}
                    </Button>
                    <Link to="delete">
                      <Button
                        variant="outlined"
                        className={`${classes.deleteButton} ${classes.button}`}
                      >
                        <DeleteIcon />
                        Delete
                      </Button>
                    </Link>
                    <Link to="edit">
                      <Button
                        variant="outlined"
                        className={`${classes.editButton} ${classes.button}`}
                      >
                        <EditIcon />
                        Edit
                      </Button>
                    </Link>
                  </>
                ) : null}
              </Box>
              <Box display="flex" flexDirection="row" flexWrap="wrap">
                {image?.tags?.map((tag: Tag) => (
                  <Button
                    key={tag.id}
                    variant="outlined"
                    className={classes.tagButton}
                  >
                    {tag.name}
                  </Button>
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              className={classes.commentContainer}
            >
              <Comments comments={image?.comments} />

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
                  value={text}
                  multiline
                  rows={"8"}
                  onChange={handleTextChange}
                  variant="outlined"
                  classes={{
                    root: classes.input,
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  className={classes.submitButton}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ViewImage;
