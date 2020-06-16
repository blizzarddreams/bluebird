import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  makeStyles,
  Theme,
  TextField,
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
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  comment: {
    margin: theme.spacing(1),
    width: "95%",
    backgroundColor: "#0d2030", //"#08141e",
    color: "#eee",
  },
}));

const Comments = ({ comments, className }: CommentsProps): JSX.Element => {
  const classes = useStyles();

  const testIDK = (e: React.MouseEvent<HTMLParagraphElement>): void => {};
  return (
    <>
      {comments.map((comment) => (
        <Card className={`${classes.comment} ${className}`} key={comment.id}>
          <CardContent>
            <Grid container>
              <Grid item xs={2}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <p onClick={testIDK}>afewa</p>
                  <Link to={`/profile/${comment.user.name}`}>
                    <Gravatar email={comment.user.email} size={8} />
                    <Typography variant="body1">{comment.user.name}</Typography>
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
