import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Theme,
  Box,
  Typography,
  Tabs,
  Tab,
  Checkbox,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Moment from "../util/Moment";
import ImageList from "../shared/ImageList";
import Cookies from "js-cookie";
interface User {
  id: number;
  name: string;
  email: string;
}
interface Comment {
  id: number;
  created_at: string;
  data: string;
  image_id?: string;
  journal_id?: string;
  profile_id?: string;
  user: User;
  image?: Image;
  journal?: Journal;
}

interface Image {
  id: number;
  image_url: string;
  thumbnail_url: string;
  nsfw: boolean;
  title: string;
  created_at: string;
  updated_at: string;
  user: User;
}
interface Journal {
  id: number;
  title: string;
}
interface Favorite {
  id: number;
  user: User;
  image: Image;
}
interface Follow {
  follower: User;
}

interface A11yProps {
  id: string;
  "aria-controls": string;
}
interface Notification {
  id: number;
  created_at: string;
  comment?: Comment;
  image?: Image;
  journal?: Journal;
  favorite?: Favorite;
  follow?: Follow;
}

interface Checkboxes {
  [checkbox: string]: boolean;
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  link: {
    color: "#6de6a8",
  },
}));

const TabPanel = (props: TabPanelProps): JSX.Element => {
  //const theme = useTheme();
  // true = desktop, false = mobile
  //const breakpoint = useMediaQuery(theme.breakpoints.up("sm"));
  //const darkMode = useContext(DarkModeContext);

  //const classes = useStyles({ darkMode, breakpoint: breakpoint });
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      //className={classes.tabPanel}
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box p={4}>{children}</Box>}
    </Typography>
  );
};

const Notifications = (): JSX.Element => {
  const tabs = ["comments", "follows", "images", "likes"];
  const classes = useStyles();
  const [checkboxes, setCheckboxes] = useState<Checkboxes>({});
  const [value, setValue] = useState(0);
  const csrf = Cookies.get("XSRF-TOKEN")!;

  const [notifications, setNotifications] = useState<Notification[]>(
    undefined!
  );

  useEffect(() => {
    fetch("/notifications-all")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications);
      });
  }, []);

  const setCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCheckboxes({ ...checkboxes, [e.target.name]: e.target.checked });
    console.log(checkboxes);
  };

  const handleTabChange = (
    e: React.ChangeEvent<{}>,
    newValue: number
  ): void => {
    setValue(newValue);
  };

  const a11yProps = (index: number): A11yProps => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const followNotificationMessage = (n: Notification): JSX.Element | null => {
    if (n.follow) {
      return (
        <Typography>
          <Link
            to={`/profile/${n.follow.follower.name}`}
            className={classes.link}
          >
            {n.follow.follower.name}
          </Link>{" "}
          followed you
          <Moment timestamp={n.created_at} relative />
          <Checkbox
            checked={checkboxes[n.id]}
            onChange={setCheck}
            name={n.id.toString()}
          />
        </Typography>
      );
    } else {
      return null;
    }
  };

  const favoriteNotificationMessage = (n: Notification): JSX.Element | null => {
    if (n.favorite) {
      return (
        <Typography>
          <Link
            to={`/profile/${n.favorite.user.name}`}
            className={classes.link}
          >
            {n.favorite.user.name}
          </Link>{" "}
          liked
          <Link to={`/view/${n.favorite.image.id}`} className={classes.link}>
            {n.favorite.image.title}
          </Link>
          <Checkbox
            checked={checkboxes[n.id]}
            onChange={setCheck}
            name={n.id.toString()}
          />
        </Typography>
      );
    } else {
      return null;
    }
  };

  const imageNotificationMessages = (n: Notification[]): JSX.Element | null => {
    const images: Image[] = [];
    n.forEach((notification) => {
      if (notification.image) {
        images.push(notification.image);
      }
    });
    return <ImageList images={images} />;
  };

  const commentNotificationMessage = (n: Notification): JSX.Element | null => {
    if (n.comment) {
      return (
        <Typography>
          <Link to={`/profile/${n.comment.user.name}`} className={classes.link}>
            {n.comment.user.name}
          </Link>{" "}
          commented on{" "}
          {n.comment?.image ? (
            <Link to={`/view/${n.comment.image.id}`} className={classes.link}>
              {n.comment.image.title}
            </Link>
          ) : n.comment?.journal ? (
            <Link
              to={`/journal/${n.comment.journal.id}`}
              className={classes.link}
            >
              {n.comment.journal.title}
            </Link>
          ) : (
            ` your profile`
          )}{" "}
          <Moment timestamp={n.created_at} relative />
          <Checkbox
            checked={checkboxes[n.id]}
            onChange={setCheck}
            name={n.id.toString()}
          />
        </Typography>
      );
    } else {
      return null;
    }
  };

  const selectAll = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const checks = notifications.reduce(
      (x: Checkboxes, y) => ((x[y.id] = true), x),
      {}
    );
    setCheckboxes(checks);
  };

  const deleteSelected = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    // only if checked
    const checkedCheckboxes = Object.keys(checkboxes).filter((checkbox) => {
      return checkboxes[checkbox];
    });
    fetch("/notifications/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrf,
      },
      body: JSON.stringify({ notifications: checkedCheckboxes }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifications({
            ...notifications.filter((notification) => {
              return !checkedCheckboxes.includes(notification.id.toString());
            }),
          });
        }
      });
    //console.log(checkboxes);
  };

  return (
    <>
      {notifications && (
        <Box>
          <Tabs value={value} onChange={handleTabChange}>
            {tabs.map((tab, index) => (
              <Tab key={tab} label={tab} {...a11yProps(index)} />
            ))}
          </Tabs>
          <TabPanel value={value} index={0}>
            {notifications.map((notification) =>
              commentNotificationMessage(notification)
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {notifications.map((notification) =>
              followNotificationMessage(notification)
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {imageNotificationMessages(notifications)}
          </TabPanel>
          <TabPanel value={value} index={3}>
            {notifications.map((notification) =>
              favoriteNotificationMessage(notification)
            )}
          </TabPanel>
          <Button onClick={selectAll}>Select All</Button>

          <Button onClick={deleteSelected}>Delete Selected</Button>
        </Box>
      )}
    </>
  );
};

export default Notifications;
