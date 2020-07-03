import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  makeStyles,
  Theme,
} from "@material-ui/core";
import Gravatar from "../util/Gravatar";
import Moment from "../util/Moment";
import { Link } from "react-router-dom";

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

interface CommentsProps {
  comments: Comment[];
}

const useStyles = makeStyles((theme: Theme) => ({
  comment: {
    margin: theme.spacing(1),
    width: "95%",
    backgroundColor: "#66d0f91a", //"#08141e",
    color: "#eee",
  },
  commentUsername: {
    color: "#3cec70",
    textDecoration: "none",
  },
}));

const Comments = ({ comments }: CommentsProps): JSX.Element => {
  const classes = useStyles();

  return (
    <>
      {comments.map((comment) => (
        <Card className={classes.comment} key={comment.id}>
          <CardContent>
            <Grid container>
              <Grid item xs={2}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Link
                    to={`/profile/${comment.user.name}`}
                    className={classes.commentUsername}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      flexDirection="column"
                    >
                      <Gravatar email={comment.user.email} size={8} />
                      <Typography variant="body1">
                        {comment.user.name}
                      </Typography>
                    </Box>
                  </Link>
                  <Typography>
                    {comment.created_at === comment.updated_at ? (
                      <Moment timestamp={comment.created_at} relative={true} />
                    ) : (
                      <>
                        <Moment
                          timestamp={comment.updated_at}
                          relative={true}
                        />
                        {"*"}
                      </>
                    )}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={10}>
                <Typography>{comment.data}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default Comments;
