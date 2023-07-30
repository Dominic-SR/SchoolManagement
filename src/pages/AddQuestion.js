import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// @mui
import {
  Card,
  Grid,
  Stack,
  InputLabel,
  Button,
  Popover,
  MenuItem,
  Container,
  TextField,
  Typography,
  Link
} from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Draggable from 'react-draggable';
import dayjs, { Dayjs } from 'dayjs'
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

export default function UserPage() {

  const [data,setData] = useState({time:0})

  const BaseURL = 'localhost/api/assets/documents/';

  const vidRef = useRef(null);
  const DragRef = useRef(null);

  const [x, setX]= useState(0)

  const [y, setY]= useState(0)

  const [label, setLable] = useState(false)

  const [text, setText] = useState(false)

  const [table, setTable] = useState(false)

  const [link, setLink] = useState(false)

  const [image, setImage] = useState(false);

  const [statement, setStatement] = useState(false)

  const [singleChoice, setSingleChoice] = useState(false)

  const [open, setOpen] = useState(null);

  const [document, setDocument] = useState();

  const [formdataDocument, setFormDataDocument] = useState()
 
  const [uploadImage, setUploadImage] = useState()

  const [allDocuments, setAllDocuments] = useState();

  const [questionType, setQuestionType] = useState()

  const [getQuestionType, setGetQuestionType] = useState()

  const [submit,setSubmit] = useState(false);

  const [videoDuration, setVideoDuration] = useState()

  const [handleHour, setHandleHour] = useState()

  const [choiceList, setChoiceList] = useState([{}])

  const handleChange = (e) =>{
    const {name, value} = e.target;
    if(name === "image"){
      setData({...data,
        [name]: URL.createObjectURL(e.target.files[0])
      });
    }else{
    setData({...data,
      [name]: value
    });
    }
  }

  // const convertSeconds = (seconds) => {
  //   const hours = Math.floor(seconds / 3600)
  //   const minutes = Math.floor((seconds % 3600) / 60)
  
  //   return `${hours} hours : ${minutes} minutes`
  // }

  var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10)
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
  }

  const handelVideoChange = (e) =>{
      setDocument(URL.createObjectURL(e.target.files[0]))
      setFormDataDocument(e.target.files[0])
  }

  const handleLoadedMetadata = () =>{
      const vid = toHHMMSS(parseInt(vidRef.current.duration));
      if(vid.length === 8){
        setHandleHour(true);
      }else{
        setHandleHour(false);
      }
      setVideoDuration(vid)
  } 

  function onDragStartHandler (ev) {
    var rect = ev.target.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);
}

const handleStop = (event, dragElement) => {
  setX(dragElement.x)
  setY(dragElement.y)
  setData({...data,
  ['x']:dragElement.x,
  ['y']:dragElement.y
  })
};

const handleChangeAdd = (e, i) => {
  const { name,value } = e.target;

  const list = [...choiceList];
  list[i][name] = value;
  
  setChoiceList(list) 
}

const AddChoice = () =>{
  setChoiceList([...choiceList,{name:"",desc:""}]);
}

const RemoveChoice = (i) => {
  const list = [...choiceList];
  list.splice(i,1)
  setChoiceList(list)
}

  // const handleStartTimeChange = (e) => {
  //   let time = e.$m+":"+e.$s;
  //   console.log("start time",time)
  //   console.log("dur date",videoDuration)
  //   let date = new Date()
  //   let currentDate = date.toISOString().split('T')[0]
  //   console.log("####",new Date(currentDate+"T"+time))
  //   console.log("CONTITION", new Date(currentDate+"T"+time) < new Date(currentDate+"T"+videoDuration))
  //   if(videoDuration > time){
  //   Object.assign(data,{starttime:time})
  //   console.log("reload Data",data)
  //   setData(data)
  //   }
  // }

  // const handleEndTimeChange = (e) => {
  //   let time = e.$m+":"+e.$s;
  //   console.log("end time",time)
  //   console.log("dur date",time)
  //   if(videoDuration >= time){
  //     Object.assign(data,{endtime:time})
  //     console.log("reload Data",data)
  //     setData(data)
  //     }
  // }

  const removeClick = () =>{
    setData({})
    setOpen(null)
  }

  const editClick = () => {
    setSubmit(false)
    setOpen(null)
  }

  const submitVideo = () =>{
    if(document?.length > 0){
      let formData = new FormData();
      formData.append('document',formdataDocument);
      addVideo(formData)
    }
  }

  // Submit Function

  const lableSubmit = (e) =>{
    e.preventDefault();
    vidRef?.current.pause();
    let currentTime = vidRef?.current.currentTime
    setData({...data, 
    ['time']:currentTime})
    setSubmit(true)
    console.log("SUBMIT--->",data)
  }

  const textSubmit = (e) =>{
    e.preventDefault();
    vidRef?.current.pause();
    setSubmit(true)
  }

  const tableSubmit = (e) =>{
    e.preventDefault();
    vidRef?.current.pause();
    setSubmit(true)
  }

  const linkSubmit = (e) =>{
    e.preventDefault();
    vidRef?.current.pause();
    setSubmit(true)
  }

  const imageSubmit = (e) =>{
    e.preventDefault();
    vidRef?.current.pause();
    setSubmit(true)
  }

  const statementSubmit = (e) =>{
    e.preventDefault();
    vidRef?.current.pause();
    setSubmit(true)
  }

  const handleOpenMenu = () => {
    setOpen(DragRef.current);
  };
 
  // 
  const addFormClick = (e) =>{

        if(e.target.value === "Lable"){
          vidRef.current.pause();
          setLable(true)
          setGetQuestionType(e.target.name)
          setData({})
          setSubmit(false)
        }else{
          setLable(false)
        }

        if(e.target.value === "Text"){
          vidRef.current.pause();
          setText(true)
          setGetQuestionType(e.target.name)
          setSubmit(false)
          setData({})
        }else{
          setText(false)
        }

        if(e.target.value === "Table"){
          vidRef.current.pause();
          setTable(true)
          setGetQuestionType(e.target.name)
          setSubmit(false)
          setData({})
        }else{
          setTable(false)
        }

        if(e.target.value === "Link"){
          vidRef.current.pause();
          setLink(true)
          setGetQuestionType(e.target.name)
          setSubmit(false)
          setData({})
        }else{
          setLink(false)
        }

        if(e.target.value === "Image"){
          vidRef.current.pause();
          setImage(true)
          setGetQuestionType(e.target.name)
          setSubmit(false)
          setData({})
        }else{
          setImage(false)
        }

        if(e.target.value === "Statement"){
          vidRef.current.pause();
          setStatement(true)
          setSubmit(false)
          setData({})
        }else{
          setStatement(false)
        }

        if(e.target.value === "Single Choice"){
          vidRef.current.pause();
          setSingleChoice(true)
          setSubmit(false)
          setData({})
        }else{
          setSingleChoice(false)
        }

  }
 // API Calling

  function addVideo(payload) {
      let baseURL = "http://localhost/api/documents/create"
      axios
        .post(baseURL, payload)
        .then((response) => {
          if(response.status === 200){
            // pass data
            let dataLoad = {}
            console.log("QUS ID---->",getQuestionType)
            console.log("cond",getQuestionType === "1");
            if(getQuestionType === "1"){
              console.log("COMEEEEE")
              dataLoad = {"title_of_question":data?.lable,
                          "question_type_id":getQuestionType,
                          "document_id":response?.data?.insert_id,
                          "start_time":data?.time,
                          "x_key": data?.x,
                          "y_key": data?.y
                        }
                        addDocumentQuestion(dataLoad)
                      }


           
          }
        });
    }

  const addDocumentQuestion = (data) =>{
    let baseURL = 'http://localhost/api/documentquestion/create'
    axios.post(baseURL,data)
    .then(res=>{
      console.log("--->",res)
      alert("document question added successfully ...!")
      window.location.reload();
    }) 
  }

  const getVideo =() =>{
    axios.get('http://localhost/api/documents/read')
    .then(res => {
      setAllDocuments(res.data.documents)
    })
    .catch(err => {
        // Handle Error Here
        console.error(err);
    });
  }

  const getQuestionsType =() =>{
    axios.get('http://localhost/api/questions/read.php')
    .then(res => {
      setQuestionType(res.data.questions)
    })
    .catch(err => {
        // Handle Error Here
        console.error(err);
    });
  }


  const handleCloseMenu = () => {
    setOpen(null);
  };

  useEffect(()=>{
    getVideo()
    getQuestionsType()
  },[])
  
  useEffect(()=>{console.log("TRIGGERED",data);},[data])
  return (
    <>
      <Helmet>
        <title> Add Question </title>
      </Helmet>

      <Container>
      
      <Card style={{ padding: '35px' }}>
          
          <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
                    <Grid item xs={8}>
                    <TextField name="vide" type="file" accept="video/*" onChange={handelVideoChange} />
                    </Grid>
             
          </Stack>
          {document?.length > 0 && <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
                {questionType.map((i)=>(
                  <Button key={i.question_type_id} variant="outlined" value={i.question_type} name={i.question_type_id} onClick={addFormClick}>{i.question_type}</Button>
                ))}
          </Stack>}
          
          <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
            
        {(label && !submit) && <form onSubmit={lableSubmit}>
              <div style={{ width: "200px"}}>
                <TextField
                style={{ width: "200px", margin: "5px" }}
                type="text"
                label="Enter a lable"
                variant="outlined"
                name="lable"
                onChange={handleChange}
                />
                </div>
                <br />
                {/* <div style={{ width: "200px", margin: "5px" }}>
                {handleHour ? (<LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: "200px", margin: "5px" }} >
                <TimePicker format="HH:mm:ss" label="Start time" name="starttime" onChange={handleStartTimeChange}/>
                </LocalizationProvider>) : (<LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: "200px", margin: "5px" }} >
                <TimePicker format="mm:ss" label="Start time" name="starttime" onChange={handleStartTimeChange} />
                </LocalizationProvider>)}
                </div>
                <br  />
                <div style={{ width: "200px", margin: "5px" }}>              
                {handleHour ? (<LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: "200px", margin: "5px" }} >
                <TimePicker format="HH:mm:ss" label="End time" name="endtime" onChange={handleEndTimeChange}/>
                </LocalizationProvider>) : (<LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: "200px", margin: "5px" }} >
                <TimePicker format="mm:ss" label="End time" name="endtime" onChange={handleEndTimeChange} />
                </LocalizationProvider>)}
                </div>
                <br /> */}
                <Button variant="contained" type="submit" style={{float:"right"}} color="primary" size="small">
                  Add
                </Button>
        </form>}

        {text && <form onSubmit={textSubmit}>
            <Stack direction="row" mb={3}>
                <TextField
                style={{ width: "200px", margin: "5px" }}
                type="text"
                name="lable"
                label="Enter a lable"
                variant="outlined"
                onChange={handleChange}
                />
            </Stack>

            <InputLabel>Text</InputLabel>
            <Stack direction="row" mb={3}>
                <CKEditor
                    editor={ ClassicEditor }
                    data=""
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />
            </Stack>
              
                <Button variant="contained" type="submit" style={{float:"right"}} color="primary" size="small">
                Add
                </Button>
        </form>}

        {link && <form onSubmit={linkSubmit}>
          <TextField
                style={{ width: "200px", margin: "5px" }}
                type="text"
                name="lable"
                label="Enter a Lable"
                variant="outlined"
                onChange={handleChange}
                />
                <br />
                <TextField
                style={{ width: "200px", margin: "5px" }}
                type="text"
                name="link"
                label="Enter a Link"
                variant="outlined"
                onChange={handleChange}
                />
                <br />              
                <Button variant="contained" type="submit" style={{float:"right"}} color="primary" size="small">
                Add
                </Button>
        </form>}


        {image && <form onSubmit={imageSubmit}>
          <TextField
                style={{ width: "300px", margin: "px" }}
                type="file"
                name="image"
                variant="outlined"
                onChange={handleChange}
                />
                <br />
                <br />              
                <Button variant="contained" type="submit" style={{float:"right"}} color="primary" size="small">
                Add
                </Button>
        </form>}

        {statement && <form onSubmit={textSubmit}>
            <Stack direction="row" mb={3}>
                <TextField
                style={{ width: "200px", margin: "5px" }}
                type="text"
                name="lable"
                label="Enter a lable"
                variant="outlined"
                onChange={handleChange}
                />
            </Stack>

            <InputLabel>Text</InputLabel>
            <Stack direction="row" mb={3}>
                <CKEditor
                    editor={ ClassicEditor }
                    data=""
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />
            </Stack>
              
                <Button variant="contained" type="submit" style={{float:"right"}} color="primary" size="small">
                Add
                </Button>
        </form>}
      

        {singleChoice && <form onSubmit={textSubmit}>
            <Stack direction="row" mb={3}>
                <TextField
                style={{ width: "200px", margin: "5px" }}
                type="text"
                name="lable"
                label="Enter a lable"
                variant="outlined"
                onChange={handleChange}
                />
            </Stack>

            <InputLabel>Text</InputLabel>
            <Stack direction="row" mb={3}>
                <CKEditor
                    editor={ ClassicEditor }
                    data=""
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />
            </Stack>



            {choiceList?.map((data,i)=>(
            <div className="container-row" key={i}> <Stack direction="row" mb={3}>
                <TextField
                style={{ width: "200px", margin: "5px" }}
                type="text"
                name="choice"
                label="Enter a Choice"
                variant="outlined"
                onChange={handleChange}
                />
            </Stack>
                {choiceList?.length - 1 === i && <Stack direction="row" mb={3}>
            <Button variant="contained" type="submit" style={{float:"right"}} color="primary" size="small" onClick={AddChoice}>
                Add Choice
                </Button>
            </Stack>
                }
                {choiceList?.length - 1 !== i &&  <Stack direction="row" mb={3}>
            <Button variant="contained" type="submit" style={{float:"right"}} color="primary" size="small" onClick={RemoveChoice}>
                Remove Choice
                </Button>
            </Stack>
                }
            </div>
            ))}
              
                <Button variant="contained" type="submit" style={{float:"right"}} color="primary" size="small">
                Add
                </Button>
        </form>}
              
          </Stack>
        {document?.length > 0 && <Stack direction="row" alignItems="center" justifyContent="center" mb={5} >
                {submit && <DraggableCard 
                refData={DragRef}
                clickFunction={handleOpenMenu}
                onChange={onDragStartHandler }
                data={data}
                handleStop={handleStop}
                x={x}
                y={y}
                 />}
                <video width="520" height="420" name="video" controls src={document} ref={vidRef} onLoadedMetadata={handleLoadedMetadata} >
                  Your browser does not support the video tag.
                </video>
                
          </Stack>}

          
        {submit && <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
         <Button variant="contained" type="submit" style={{float:"right"}} color="primary" size="large" onClick={submitVideo}>
                Submit Video
                </Button> </Stack>}
          

        </Card>
      </Container>
            
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
      >
        <MenuItem style={{backgroundColor: "rgba(255, 255, 255, .4)"}}>
          <Iconify onClick={editClick} icon={'eva:edit-fill'} sx={{ mr: 2 }} />  
          <Iconify onClick={removeClick} icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
        </MenuItem>
      </Popover>      
    </>
  );
}


const DraggableCard = ({ refData, clickFunction, data, handleStop, x, y}) => {
  return (
    <Draggable 
     onStop={handleStop} 
     position={{x: x, y:y}}
    >
      <Card
        ref={refData}
        style={{ maxWidth: "400" ,padding:"10px", border:"1px solid white", borderRadius:"5px", backgroundColor: "rgba(255, 255, 255, .4)", color: "#ffffff", textAlign:"center", position: "absolute", zIndex:"1", wordWrap:"break-word123", flexDirection:"coloumn", cursor:"pointer"}}
        onClick={clickFunction}
      >
      {data?.lable && <Stack direction="row"  alignItems="center" justifyContent="center" mb={1} style={{wordWrap:"break-word456"}}>
        <Typography variant="text" style={{wordWrap:"break-word789"}}>{data?.lable}</Typography>
      </Stack>}
      {data?.link && <Stack direction="row" alignItems="center" justifyContent="center" mb={1} >
        <Link href={data?.link} variant="body2">{data?.link}</Link>
      </Stack>}

      {data?.image && <Stack direction="row" alignItems="center" justifyContent="center" mb={1} >
        <img src={data.image} height="180" width="280">{data?.link}</img>
      </Stack>}
      </Card>
    </Draggable>
  );
};





























































// import { useState } from 'react';
// import axios from 'axios';
// // @mui
// import {
//   Stack,
//   TextField,
//   Button,
//   Box,
//   Grid
// } from '@mui/material';
// // components
// import Iconify from '../components/iconify';

// export default function UserPage() {

//     const [document, setDocument] = useState()
//     const handelVideoChange = (e) =>{
//         setDocument(e.target.files[0])
//     }

//     const submitVideo = () =>{
//         let formData = new FormData();
//         formData.append('document',document);
//         addVideo(formData)
//     }


//     function addVideo(data) {
//         let baseURL = "http://localhost/api/documents/read"
//         axios
//           .post(baseURL, data)
//           .then((response) => {
//             alert("updated")
//           });
//       }

//   return (
//     <Box sx={{ flexGrow: 1 }}>
        
//         <Stack spacing={7}>
//         <Box sx={{ flexGrow: 2 }}>
//         <Grid container spacing={2}>
            
//             <Grid item xs={2}>
//             <TextField name="vide" type="file" accept="video/*" onChange={handelVideoChange} />
//             </Grid>

//             <Grid item xs={2}>
//             <Button variant="contained" disabled={!document} onClick={submitVideo} size="large" startIcon={<Iconify icon="eva:plus-fill" />}>
//                         Submit
//             </Button>
//             </Grid>
//         </Grid>
//         </Box>


//         <Box sx={{ flexGrow: 1 }}>
//         <Grid container spacing={3}>

//             <Grid item xs={2}>
//             <video className="videoupload-player" id="videoElement" width="640" height="380" controls>
//                 <source src="assets/documents/<?php echo $row['document']; ?>"  type="video/mp4" />
//             </video>
//             </Grid>

//         </Grid>
//         </Box>

//         </Stack>

        
//     </Box>
//   );
// }
