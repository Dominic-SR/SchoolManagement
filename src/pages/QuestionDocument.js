import { useState } from 'react';
import axios from 'axios';
// @mui
import {
  Stack,
  TextField,
  Button,
  Box,
  Grid
} from '@mui/material';
// components
import Iconify from '../components/iconify';

export default function UserPage() {

    const [document, setDocument] = useState()
    const handelVideoChange = (e) =>{
        setDocument(e.target.files[0])
    }

    const submitVideo = () =>{
        let formData = new FormData();
        formData.append('document',document);
        addVideo(formData)
    }


    function addVideo(data) {
        let baseURL = "http://localhost/project/includes/video_upload.php"
        axios
          .post(baseURL, data)
          .then((response) => {
            alert("updated")
          });
      }

  return (
    <Box sx={{ flexGrow: 1 }}>
        
        <Stack spacing={7}>
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
            
            <Grid item xs={2}>
            <TextField name="vide" type="file" accept="video/*" onChange={handelVideoChange} />
            </Grid>

            <Grid item xs={2}>
            <Button variant="contained" disabled={!document} onClick={submitVideo} size="large" startIcon={<Iconify icon="eva:plus-fill" />}>
                        Submit
            </Button>
            </Grid>
        </Grid>
        </Box>


        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>

            <Grid item xs={2}>
            <video className="videoupload-player" id="videoElement" width="640" height="380" controls>
                <source src="assets/documents/<?php echo $row['document']; ?>"  type="video/mp4" />
            </video>
            </Grid>

        </Grid>
        </Box>

        </Stack>

        
    </Box>
  );
}
