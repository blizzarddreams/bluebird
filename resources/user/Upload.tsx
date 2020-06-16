import React, { useState, useRef } from "react";
import {
  makeStyles,
  Theme,
  Box,
  fade,
  TextField,
  IconButton,
  Typography,
  lighten,
  Button,
} from "@material-ui/core";
import { Photo as PhotoIcon } from "@material-ui/icons";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import Tags from "react-tagsinput";

interface Fields {
  title: string;
  description: string;
  tags: string;
}

interface Errors {
  title: string[];
  description: string[];
  image: string[];
  tags: string[];
}
const useStyles = makeStyles(() => ({
  inputBase: {
    color: "#eee",
    borderBottomColor: "#66d0f9",
    borderColor: "#66d0f9",
    backgroundColor: fade("#66d0f9", 0.1),
    borderRadius: "0",
    paddingInline: "1rem",
  },
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

  inputHidden: {
    display: "none",
  },
  buttonUpload: {
    color: "#eee",
  },
  form: {
    width: "100%",
  },
  button: {
    color: "#eee",
    bacgkroundColor: "#288d75", //"#01090f",
    "&:hover": {
      backgroundColor: lighten("#288d75", 0.1),
    },
  },
}));

const Upload = (): JSX.Element => {
  const history = useHistory();
  const [fields, setFields] = useState<Fields>({
    title: "",
    description: "",
    tags: "",
  });
  const [errors, setErrors] = useState<Errors>({
    title: [],
    description: [],
    image: [],
    tags: [],
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const csrf = Cookies.get("XSRF-TOKEN")!;
  const classes = useStyles();

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.getAttribute("name");
    setFields({ ...fields, [name as string]: e.target.value });
  };

  const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = new FormData();
    console.log(fields.description);
    form.append("title", fields.title);
    form.append("description", fields.description);
    if (fileRef?.current?.files) {
      form.append("image", fileRef.current.files[0]);
    }
    form.append("tags", fields.tags);
    form.append("rating", "sfw");

    fetch("/upload", {
      method: "POST",
      body: form,
      headers: {
        "X-XSRF-TOKEN": csrf,
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          history.push("/");
        } else {
          setErrors({ ...data.errors });
        }
      });
  };

  return (
    <form onSubmit={handleUploadSubmit}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h2">Upload</Typography>
        {errors.image.length ? (
          <Typography>{errors.image.join("\n")}</Typography>
        ) : null}
        <TextField
          name="title"
          id="outlined-basic"
          label="Title"
          fullWidth
          value={fields.title}
          onChange={handleFieldChange}
          variant="outlined"
          error={!!errors.title.length}
          helperText={errors.title.join("\n")}
          classes={{
            root: classes.input,
          }}
        />
        <TextField
          name="description"
          variant="outlined"
          label="Description"
          onChange={handleFieldChange}
          value={fields.description}
          classes={{
            root: classes.input,
          }}
          error={!!errors.description.length}
          helperText={errors.description.join("\n")}
          fullWidth
          multiline
          rows="8"
        />
        <TextField
          name="tags"
          id="outlined-basic"
          label={'Tags (Separate by ",")'}
          fullWidth
          value={fields.tags}
          onChange={handleFieldChange}
          variant="outlined"
          error={!!errors.tags.length}
          helperText={errors.tags.join("\n")}
          classes={{
            root: classes.input,
          }}
        />
        <input
          id="icon-button-file"
          type="file"
          name="file"
          accept="image/*"
          ref={fileRef}
          className={classes.inputHidden}
        />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" component="span">
            <PhotoIcon className={classes.buttonUpload} />
          </IconButton>
        </label>
        <Button type="submit" className={classes.button}>
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default Upload;
