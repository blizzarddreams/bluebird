import React, { useState, useRef, useEffect } from "react";
import {
  makeStyles,
  Box,
  fade,
  Typography,
  lighten,
  Button,
} from "@material-ui/core";
import Cookies from "js-cookie";
import { useHistory, useParams } from "react-router-dom";

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

const DeleteImage = (): JSX.Element => {
  const history = useHistory();
  const { imageId } = useParams();
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

  useEffect(() => {
    fetch(`/image/${imageId}/delete`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setFields(data.image);
        }
      });
  }, []);

  /*
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.getAttribute("name");
    setFields({ ...fields, [name as string]: e.target.value });
  };*/

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = new FormData();
    console.log(fields.description);
    form.append("id", imageId);
    form.append("title", fields.title);
    form.append("description", fields.description);
    if (fileRef?.current?.files?.[0]) {
      form.append("image", fileRef.current.files[0]);
    }
    form.append("tags", fields.tags);
    form.append("rating", "sfw");

    fetch("/image/edit", {
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
    <form onSubmit={handleEditSubmit}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h2">Delete Image</Typography>
        <Typography>Are you sure you want to delete this?</Typography>
        {errors.image.length ? (
          <Typography>{errors.image.join("\n")}</Typography>
        ) : null}
        <Typography variant="h6">{fields.title}</Typography>
        <Typography variant="body1">{fields.description}</Typography>

        <Button type="submit" className={classes.button}>
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default DeleteImage;
