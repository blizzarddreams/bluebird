import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  makeStyles,
  Theme,
  fade,
  lighten,
  Grid,
  Paper,
  Card,
  CardContent,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import ProfileHeader from "./ProfileHeader";
import Moment from "../util/Moment";
interface Journal {
  id: number;
  created_at: string;
  updated_at: string;
  data: string;
  title: string;
  comments: any[];
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
  journals: Journal[];
  isFollowedByAuthUser?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  pagination: {
    "& .Mui-selected": {
      backgroundColor: lighten("#224660", 0.5),
    },
    "& .Mui-selected:hover": {
      backgroundColor: lighten("#224660", 0.5),
    },
    "& .MuiPaginationItem-page": {
      color: "#eee",
    },
    "& .MuiPaginationItem-ellipsis": {
      color: "#eee",
    },
  },
  link: {
    color: "#6de6a8",
  },
  timestamp: {
    color: "#adb9c5",
  },
  journalBox: {
    display: "flex",
    justifyContent: "center",
    //alignItems: "center",
    flexDirection: "column",
    //backgroundColor: "#0e1a28", //"#192a3d",
    backgroundColor: "#66d0f91a", //"#192a3d",
    color: "#dff0f7",
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  journalBoxTitle: {
    backgroundColor: "#0b1a2b",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

const Journals = (): JSX.Element => {
  const classes = useStyles();
  const [journalCount, setJournalCount] = useState(1);
  const [page, setPage] = useState(1);
  const { username } = useParams();
  const [user, setUser] = useState<User>(undefined!);
  useEffect(() => {
    fetch(`/user/${username}/journals?page=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJournalCount(Math.ceil(data.user.journalCount / 10));
          setUser(data.user);
        }
      });
  }, []);

  const handlePageChange = (e: ChangeEvent<unknown>, page: number): void => {
    setPage(page);
    fetch(`/user/${username}/journals?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      });
  };
  return (
    <>
      {user && (
        <>
          <ProfileHeader user={user} />
          <Grid container>
            <Grid item xs={10}>
              <Typography variant="h4" align="center">
                Journals
              </Typography>
              {user.journals.map((journal: Journal) => (
                <Paper
                  key={journal.id}
                  id={journal.id.toString()}
                  elevation={0}
                  className={classes.journalBox}
                >
                  <Link to={`/journal/${journal.id}`} className={classes.link}>
                    <Typography variant="h4">{journal.title}</Typography>
                  </Link>
                  <Typography variant="h6" className={classes.timestamp}>
                    <Moment timestamp={journal.created_at} relative />
                  </Typography>
                  <Typography>{journal.data}</Typography>
                  <Box display="flex" justifyContent="flex-end">
                    <Typography>
                      {journal.comments.length}{" "}
                      {journal.comments.length === 1 ? "Comment" : "Comments"}
                    </Typography>
                  </Box>
                </Paper>
              ))}
              <Pagination
                count={journalCount}
                className={classes.pagination}
                onChange={handlePageChange}
                size="large"
              />
            </Grid>
            <Grid item xs={2}>
              {user.journals.map((journal: Journal) => (
                <Link
                  key={journal.id}
                  to={`#${journal.id}`}
                  className={classes.link}
                >
                  <Typography key={journal.id}>{journal.title}</Typography>
                </Link>
              ))}
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Journals;
