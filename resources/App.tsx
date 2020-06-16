import React from "react";
import { Box, Theme } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ReactDOM from "react-dom";
import Home from "./Home";
import Login from "./auth/Login";
import { makeStyles } from "@material-ui/core";
import Navbar from "./Navbar";
import Upload from "./user/Upload";
import ViewImage from "./image/ViewImage";
import EditImage from "./image/EditImage";
import DeleteImage from "./image/DeleteImage";
import Write from "./journal/Write";
import Profile from "./user/Profile";
import Gallery from "./user/Gallery";
import Journals from "./user/Journals";
import ViewJournal from "./journal/ViewJournal";
import Notifications from "./user/Notifications";
import Search from "./Search";
import Register from "./auth/Register";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    backgroundColor: "#13232d", //"#020f17", //"#080b17", //"#00070c", //"#01090f",
    color: "#eee", //"#dff0f7", //"#eee",
    minHeight: `calc(100% - ${theme.spacing(10)}px)`,
    //padding: theme.spacing(1),
    //  paddingTop: theme.spacing(10),
    padding: theme.spacing(10, 1, 0, 1),
  },
}));

const App = (): JSX.Element => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path="/login" component={Login} />

          <Route path="/register" component={Register} />

          <Route path="/upload" component={Upload} />

          <Route path="/write" component={Write} />

          <Route path="/profile/:username/gallery" component={Gallery} />

          <Route path="/profile/:username/journals" component={Journals} />

          <Route path="/profile/:username" component={Profile} />

          <Route path="/view/:imageId/edit" component={EditImage} />

          <Route path="/view/:imageId/delete" component={DeleteImage} />

          <Route path="/view/:imageId/" component={ViewImage} />

          <Route path="/journal/:journalId" component={ViewJournal} />

          <Route path="/notifications" component={Notifications} />

          <Route path="/search" component={Search} />

          <Route exact path="/" component={Home} />
        </Switch>
      </BrowserRouter>
    </Box>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
