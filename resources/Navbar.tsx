import React, { useState, useEffect } from "react";
import {
  Toolbar,
  AppBar,
  InputBase,
  Typography,
  IconButton,
  Box,
  makeStyles,
  Theme,
  fade,
} from "@material-ui/core";
import Cookies from "js-cookie";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Publish as PublishIcon,
  Book as JournalIcon,
  ExitToAppRounded as LogOutIcon,
} from "@material-ui/icons";
import Gravatar from "./util/Gravatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faSignOutAlt,
  faUserPlus,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

interface Style {
  darkMode: boolean;
}

interface Comment {
  id: number;
  created_at: string;
  data: string;
  image_id?: string;
  journal_id?: string;
  profile_id?: string;
}

interface Image {}
interface Journal {}
interface Favorite {}
interface Follow {}

interface Notification {
  created_at: string;
  comment?: Comment;
  image?: Image;
  journal?: Journal;
  favorite?: Favorite;
  follow?: Follow;
}
const useStyles = makeStyles((theme: Theme) => ({
  navBar: (props: Style) => ({
    backgroundColor: "#13232d", //"#020f17", //"#00070c", //"#01090f",
    boxShadow: "none",
    marginBottom: theme.spacing(4),
  }),
  toolBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  search: (props: Style) => ({
    backgroundColor: fade("#13232d", 0.1), //fade("#01090f", 0.1),

    position: "relative",
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      backgroundColor: fade("#01090f", 0.2),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }),
  input: (props: Style) => ({
    color: "transparent", //props.darkMode ? "#080b17" : "#dff0f7",
    padding: theme.spacing(1, 1, 1, 4),
    transition: theme.transitions.create("width"),
    width: theme.spacing(0),
    "&:focus": {
      color: "#eee",
      width: theme.spacing(40),
    },
  }),
  searchIcon: (props: Style) => ({
    padding: theme.spacing(0, 1),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#eee",
  }),
  navBarLink: {
    color: "#eee",
    textDecoration: "none",
    //display: "flex",
    //flexDirection: "column",
    //alignItems: "center",
    "&:active": {
      color: "#eee",
    },
  },
}));

const Navbar = (): JSX.Element => {
  const location = useLocation();
  const darkMode = false;
  const classes = useStyles({ darkMode });
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState(0);
  const history = useHistory();

  useEffect(() => {
    // const { pathname } = location;
    if (Cookies.get("email")) {
      fetch("/notifications-number")
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data.notifications);
        });
    }
  }, [location]);

  const handleLogout = (): void => {
    fetch("/logout", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Cookies.remove("email");
          Cookies.remove("name");
          history.push("/");
        }
      });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    history.push(`/search?qs=${search}`);
    setSearch("");
  };

  return (
    <AppBar className={classes.navBar} position="fixed">
      <Toolbar className={classes.toolBar}>
        <Box display="flex" alignItems="center">
          <Link to="/" className={classes.navBarLink}>
            <Box display="flex" flexDirection="row" alignItems="center">
              Bluebird <HomeIcon />
            </Box>
          </Link>
          <Box className={classes.search}>
            <Box className={classes.searchIcon}>
              <SearchIcon />
            </Box>
            <form onSubmit={handleSearchSubmit}>
              <InputBase
                placeholder="Search...."
                classes={{
                  input: classes.input,
                }}
                name="qs"
                onChange={handleSearchChange}
                inputProps={{ "aria-label": "search" }}
              />
            </form>
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          {Cookies.get("email") ? (
            <>
              <Link to={`/profile/${Cookies.get("name")!}`}>
                <Gravatar email={Cookies.get("email")!} size={4} />
              </Link>
              <Link to="/notifications">
                <IconButton className={classes.navBarLink}>
                  <FontAwesomeIcon icon={faBell} />
                  {notifications > 50 ? "50+" : notifications}
                </IconButton>
              </Link>
              <Link to="/upload">
                <IconButton className={classes.navBarLink}>
                  <PublishIcon />
                </IconButton>
              </Link>
              <Link to="/write">
                <IconButton className={classes.navBarLink}>
                  <JournalIcon />
                </IconButton>
              </Link>
              <IconButton onClick={handleLogout} className={classes.navBarLink}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </IconButton>
            </>
          ) : (
            <>
              <Link to="/login">
                <IconButton className={classes.navBarLink}>
                  <FontAwesomeIcon icon={faSignInAlt} />
                </IconButton>
              </Link>
              <Link to="/register">
                <IconButton className={classes.navBarLink}>
                  <FontAwesomeIcon icon={faUserPlus} />
                </IconButton>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
