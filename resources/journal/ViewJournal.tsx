import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Grid, Typography, makeStyles, Theme } from "@material-ui/core";

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

interface User {
  id: number;
  name: string;
  email: string;
}
interface Journal {
  id: number;
  created_at: string;
  updated_at: string;
  data: string;
  title: string;
  user: User;
  comments: Comment[];
}

type LatestJournal = Pick<Journal, "title" | "id" | "created_at">;

const useStyles = makeStyles((theme: Theme) => ({
  link: {
    color: "#6de6a8",
  },
  box: {
    backgroundColor: "#192a3d",
    padding: theme.spacing(1),
    //borderRadius: theme.shape(1),
  },
}));

const ViewJournal = (): JSX.Element => {
  const classes = useStyles();
  const { journalId } = useParams();
  const [journal, setJournal] = useState<Journal>(undefined!);
  const [latestJournals, setLatestJournals] = useState<LatestJournal[]>(
    undefined!
  );

  useEffect(() => {
    fetch(`/journals/${journalId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJournal(data.journal);
          setLatestJournals(data.journals);
        }
      });
  }, []);

  return (
    <>
      {journal && latestJournals && (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="h5">{journal.title}</Typography>
                <Typography>{journal.data}</Typography>
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                className={classes.box}
              >
                <Typography variant="h5">Latest Journals</Typography>
                {latestJournals.map((journal) => (
                  <Link
                    to={`/journal/${journal.id}`}
                    key={journal.id}
                    className={classes.link}
                  >
                    <Typography variant="h6">{journal.title}</Typography>
                  </Link>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default ViewJournal;
