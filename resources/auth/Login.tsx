import React, { useState } from "react";
import Cookies from "js-cookie";
import {
  makeStyles,
  Theme,
  Box,
  Typography,
  TextField,
  fade,
  Button,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

interface Credentials {
  email: string;
  password: string;
}

interface Errors {
  email: string[];
  password: string[];
}

interface Style {
  darkMode: boolean;
}
const useStyles = makeStyles((theme: Theme) => ({
  input: {
    margin: theme.spacing(1),
    width: "40%",
    "& .MuiFormLabel-root": {
      color: "#eee",
      //color: (props: Style): string => (props.darkMode ? "#eee" : "#222"),
    },
    "& .MuiOutlinedInput-root": {
      //color: (props: Style): string => (props.darkMode ? "#eee" : "#222"),
      color: "#eee",
      backgroundColor: fade("#66d0f9", 0.1),
      borderRadius: theme.shape.borderRadius,

      "&.Mui-focused fieldset": {
        borderColor: "#114B5F",
      },
    },
    "& .MuiFormHelperText-root": {
      fontWeight: "bold",
    },
    "&:focus": {
      borderColor: "#eee",
    },
  },
}));
const Login = (): JSX.Element => {
  const darkMode = false; // placeholder
  const history = useHistory();
  const classes = useStyles();
  const csrf = Cookies.get("XSRF-TOKEN")!;
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({
    email: [],
    password: [],
  });

  const handleCredentialsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const name = e.target.getAttribute("name");
    setCredentials({ ...credentials, [name as string]: e.target.value });
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log(csrf);
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrf,
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
          Cookies.set("email", data.email);
          Cookies.set("name", data.name);
          history.push("/");
        }
      });
  };

  return (
    <form onSubmit={handleLoginSubmit}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h1">Login</Typography>

        <TextField
          name="email"
          id="outlined-basic"
          label="E-Mail"
          onChange={handleCredentialsChange}
          value={credentials.email}
          variant="outlined"
          error={errors.email.length > 0}
          helperText={errors.email.join("\n")}
          classes={{
            root: classes.input,
          }}
        />

        <TextField
          name="password"
          id="outlined-basic"
          label="Password"
          type="password"
          onChange={handleCredentialsChange}
          value={credentials.password}
          error={errors.password.length > 0}
          helperText={errors.password.join("\n")}
          variant="outlined"
          classes={{
            root: classes.input,
          }}
        />
        <Button type="submit">Submit</Button>
      </Box>
    </form>
  );
};

export default Login;
