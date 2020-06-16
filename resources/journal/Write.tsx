import React, { useState } from "react";
import {
  Box,
  TextField,
  makeStyles,
  Theme,
  fade,
  lighten,
  Button,
} from "@material-ui/core";
import Cookies from "js-cookie";
interface Fields {
  title: string;
  data: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    color: "#eee",
    width: "95%",
    borderColor: "#eee !important",
    "& .MuiFormLabel-root": {
      color: "#79838a",
    },
    "& .MuiOutlinedInput-root": {
      marginBottom: "4rem",
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
  button: {
    color: "#eee",
    bacgkroundColor: "#288d75", //"#01090f",
    "&:hover": {
      backgroundColor: lighten("#288d75", 0.1),
    },
  },
}));

const Write = (): JSX.Element => {
  const [fields, setFields] = useState<Fields>({
    title: "",
    data: "",
  });

  const classes = useStyles();
  const csrf = Cookies.get("XSRF-TOKEN")!;

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.getAttribute("name")!;
    setFields({ ...fields, [name]: e.target.value });
  };

  const handleJournalSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetch("/write", {
      method: "POST",
      body: JSON.stringify(fields),
      headers: {
        "X-XSRF-TOKEN": csrf,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <Box component="form" onSubmit={handleJournalSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          onChange={handleFieldChange}
          value={fields.title}
          classes={{ root: classes.input }}
          fullWidth
        />
        <TextField
          name="data"
          variant="outlined"
          label="Description"
          onChange={handleFieldChange}
          value={fields.data}
          classes={{
            root: classes.input,
          }}
          //error={!!errors.description.length}
          //helperText={errors.description.join("\n")}
          fullWidth
          multiline
          rows="14"
        />
        <Button type="submit" variant="contained" className={classes.button}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Write;
