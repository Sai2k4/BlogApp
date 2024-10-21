// import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
// import axios from "axios";
// import TextareaAutosize from "@mui/material/TextareaAutosize";
// import config from "../config";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useStyles } from "./utils";

// const labelStyles = { mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" };
// const AddBlogs = () => {
//   const classes = useStyles();
//   const navigate = useNavigate();
//   const [inputs, setInputs] = useState({
//     title: "",
//     description: "",
//     imageURL: "",
//   });
//   const handleChange = (e) => {
//     setInputs((prevState) => ({
//       ...prevState,
//       [e.target.name]: e.target.value,
//     }));
//   };
//   const sendRequest = async () => {
//     const res = await axios
//       .post(`${config.BASE_URL}/api/blogs/add`, {
//         title: inputs.title,
//         desc: inputs.description,
//         img: inputs.imageURL,
//         user: localStorage.getItem("userId"),
//       })
//       .catch((err) => console.log(err));
//     const data = await res.data;
//     return data;
//   };
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(inputs);
//     sendRequest()
//       .then((data) => console.log(data))
//       .then(() => navigate("/blogs"));
//   };
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <Box
//           borderRadius={10}
//           boxShadow="10px 10px 20px #ccc"
//           padding={3}
//           margin={"auto"}
//           marginTop={3}
//           display="flex"
//           flexDirection={"column"}
//           width={"80%"}
//         >
//           <Typography
//             className={classes.font}
//             padding={3}
//             color="grey"
//             variant="h2"
//             textAlign={"center"}
//           >
//             Post Your Blog
//           </Typography>
//           <InputLabel className={classes.font} sx={labelStyles}>
//             Title
//           </InputLabel>
//           <TextField
//             className={classes.font}
//             name="title"
//             onChange={handleChange}
//             value={inputs.title}
//             margin="auto"
//             variant="outlined"
//           />
//           <InputLabel className={classes.font} sx={labelStyles}>
//             Description
//           </InputLabel>
//           <TextareaAutosize
//             className={classes.font}
//             name="description"
//             onChange={handleChange}
//             minRows={10}
//             margin="auto"
//             variant="outlined"
//             value={inputs.description}
//           />
//           <InputLabel className={classes.font} sx={labelStyles}>
//             ImageURL
//           </InputLabel>
//           <TextField
//             className={classes.font}
//             name="imageURL"
//             onChange={handleChange}
//             value={inputs.imageURL}
//             margin="auto"
//             variant="outlined"
//           />
//           <Button
//             sx={{ mt: 2, borderRadius: 4 }}
//             variant="contained"
//             type="submit"
//           >
//             Submit
//           </Button>
//         </Box>
//       </form>
//     </div>
//   );
// };

// export default AddBlogs;

import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import config from "../config";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./utils";

const labelStyles = { mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" };

const AddBlogs = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    imageURL: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submit button control

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async () => {

    const userId = localStorage.getItem("userId");
    console.log("User ID:", userId);
    if (!userId) {
        console.error("User ID not found in localStorage");
        return null;
    }

    // const userId = localStorage.getItem("userId");
    // if (!userId) {
    //   console.error("User ID not found in localStorage");
    //   return;
    // }

    try {
      const res = await axios.post(`${config.BASE_URL}/api/blogs/add`, {
        title: inputs.title,
        desc: inputs.description, // Renamed to 'desc' for consistency with the backend
        img: inputs.imageURL,
        user: userId, // Passed user ID from localStorage
      });
      return res.data;
    } catch (err) {
      console.error("Error while adding blog:", err);
      return null; // Handle error properly
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button when submitting

    sendRequest()
      .then((data) => {
        if (data) {
          console.log("Blog added:", data);
          navigate("/blogs"); // Navigate after successful addition
        } else {
          console.log("Failed to add the blog.");
        }
      })
      .finally(() => setIsSubmitting(false)); // Re-enable button after completion
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          borderRadius={10}
          boxShadow="10px 10px 20px #ccc"
          padding={3}
          margin={"auto"}
          marginTop={3}
          display="flex"
          flexDirection={"column"}
          width={"80%"}
        >
          <Typography
            className={classes.font}
            padding={3}
            color="grey"
            variant="h2"
            textAlign={"center"}
          >
            Post Your Blog
          </Typography>
          <InputLabel className={classes.font} sx={labelStyles}>
            Title
          </InputLabel>
          <TextField
            className={classes.font}
            name="title"
            onChange={handleChange}
            value={inputs.title}
            margin="auto"
            variant="outlined"
            required // Added required to ensure input is filled
          />
          <InputLabel className={classes.font} sx={labelStyles}>
            Description
          </InputLabel>
          <TextareaAutosize
            className={classes.font}
            name="description"
            onChange={handleChange}
            minRows={10}
            margin="auto"
            value={inputs.description}
            required // Added required
          />
          <InputLabel className={classes.font} sx={labelStyles}>
            Image URL
          </InputLabel>
          <TextField
            className={classes.font}
            name="imageURL"
            onChange={handleChange}
            value={inputs.imageURL}
            margin="auto"
            variant="outlined"
            required // Added required
          />
          <Button
            sx={{ mt: 2, borderRadius: 4 }}
            variant="contained"
            type="submit"
            disabled={isSubmitting} // Disable button during submission
          >
            {isSubmitting ? "Submitting..." : "Submit"} {/* Show progress state */}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default AddBlogs;
