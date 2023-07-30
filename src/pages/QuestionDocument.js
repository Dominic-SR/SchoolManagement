import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import axios from 'axios';
// @mui
import {
  Card,
  Grid,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'file', label: 'File', alignRight: false },
  { id: 'Document Name', label: 'Document Name', alignRight: false },
  { id: 'Created_at', label: 'Created_at', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user?.name?.toLowerCase()?.indexOf(query?.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function UserPage() {

  const BaseURL = 'localhost/api/assets/documents/'
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [document, setDocument] = useState();

  const [allDocuments, setAllDocuments] = useState();

  const handelVideoChange = (e) =>{
      setDocument(e.target.files[0])
  }

  const submitVideo = () =>{
      let formData = new FormData();
      formData.append('document',document);
      addVideo(formData)
  }


  function addVideo(data) {
      let baseURL = "http://localhost/api/documents/create"
      axios
        .post(baseURL, data)
        .then((response) => {
          alert("updated")
        });
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

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = allDocuments?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allDocuments?.length) : 0;

  const filteredUsers = applySortFilter(allDocuments, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers?.length && !!filterName;

  useEffect(()=>{
    getVideo()
  },[])
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          {/* <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button> */}

            <Grid container spacing={2}>
              
              <Grid item xs={8}>
              <TextField name="vide" type="file" accept="video/*" onChange={handelVideoChange} />
              </Grid>

              <Grid item xs={2}>
              <Button variant="contained" disabled={!document} onClick={submitVideo} size="large" startIcon={<Iconify icon="eva:plus-fill" />}>
                          Submit
              </Button>
              </Grid>
          </Grid>
          </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={allDocuments?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
                    const { document_id, document, created_at } = row;
                    const selectedUser = selected.indexOf(document) !== -1;

                    return (
                      <TableRow hover key={document_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography> */}

                            <video className="videoupload-player" id="videoElement" width="120" height="70" controls>
                             <source src={BaseURL+document}  type="video/mp4" />
                            </video>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{document}</TableCell>

                        <TableCell align="left">{created_at}</TableCell>

                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}

                        {/* <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                          Callll
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={allDocuments?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}





























































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
