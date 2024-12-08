// npm install @mui/material @emotion/react @emotion/styled
//npm install socket.io-client

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Card,
  CardMedia,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { AccountCircle, Delete } from "@mui/icons-material";
import { io } from "socket.io-client";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const socket = io("http://localhost:4000"); // Connect to the server

const Chat = ({setMenuSection}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]); // Track selected messages
  const [openMenu, setOpenMenu] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const open = Boolean(anchorEl);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const message = {
        id:1,
        userId: "12345", // Replace with dynamic user ID
        text: input,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        time: new Date().toLocaleTimeString(), // HH:MM:SS
      };

      setMessages((prevMessages) => [...prevMessages,
        {
         
          userId: "12345", // Replace with dynamic user ID
          text: input,
          file:null,
          date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
          time: new Date().toLocaleTimeString(), // HH:MM:SS
        }]);
        // console.log('ds')
      socket.emit("sendMessage", message); // Send message to server
      setInput(""); // Clear the input field
    }
  };

  const handleMenuOpen = (event, messageId) => {
    setAnchorEl(event.currentTarget);
    setCurrentMessageId(messageId);
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  const handleMenuAction = (action) => {
    if (action === "Select Multiple") {
      toggleSelection(currentMessageId);
    } else if (action === "Delete Message") {
      deleteMessage(currentMessageId);
    }
    setAnchorEl(null);
    setOpenMenu(false);
  };

  const toggleSelection = (id) => {
    setSelectedMessages((prevSelectedMessages) =>
      prevSelectedMessages.includes(id)
        ? prevSelectedMessages.filter((messageId) => messageId !== id)
        : [...prevSelectedMessages, id]
    );
  };

  const deleteMessage = (id) => {
    setMessages(messages.filter((message) => message.id !== id));
    setSelectedMessages(selectedMessages.filter((messageId) => messageId !== id));
  };

  const deleteSelectedMessages = () => {
    setMessages(messages.filter((message) => !selectedMessages.includes(message.id)));
    setSelectedMessages([]); // Clear selection after deleting
  };

    // Function to handle when the page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User is not active (inactive)
        setIsActive(false);
        socket.emit('userStatus', { userId: 'user123', isActive: false }); // Send inactive status to the server
      } else {
        // User is active
        setIsActive(true);
        socket.emit('userStatus', { userId: 'user123', isActive: true }); // Send active status to the server
      }
    };
  
    // Use effect to listen for visibility changes
    useEffect(() => {
      document.addEventListener('visibilitychange', handleVisibilityChange);
  
      // Initial status update (when user opens the page)
      socket.emit('userStatus', { userId: 'user123', isActive: true });
  
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, []);


    
    const [uploadedFile, setUploadedFile] = useState(null);

    const handleUpload = (event) => {
      const file = event.target.files[0]; // Get the first selected file
      if (file) {
        // setUploadedFile(file);
    console.log(file);
        // Create the message object
        const newMessage = {
          userId: "12345", // Replace with dynamic user ID
          text: input || "", // Use input or a default message
          file: file, // Attach the uploaded file
          date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
          time: new Date().toLocaleTimeString(), // Format: HH:MM:SS
        };
    
        // Update the messages state
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    
        // Emit the new message to the server
        socket.emit("sendMessage", {
          ...newMessage,
          file: undefined, // Files should not be directly sent via socket; handle separately if needed
        });
    
        // Clear the input field
        setInput("");
    
        console.log("Uploaded File:", file);
        console.log("New Message Sent:", newMessage);
    
        // Further file upload processing (e.g., sending to the server via an API)
        // Example: axios.post('/upload', formData)
      }
    };
  
    // Ref to the file input for triggering manually
    const fileInputRef = React.useRef();
  
    const triggerFileInput = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click(); // Simulate click on the hidden file input
      }
    };

    const actions = [
      { icon: <FileCopyIcon />, name: 'Copy' },
      { icon: <SaveIcon />, name: 'Save' },
      { icon: <AttachFileIcon onClick={triggerFileInput} />, name: "Upload" },
      { icon: <ShareIcon />, name: 'Share' },
    ];
  return (
    <Box display="flex" flexDirection="column" height="100vh">
            {/* Hidden file input for uploading */}
            <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleUpload}
      />

      {/* Header */}
      <Box
        bgcolor="primary.main"
        color="white"
        py={2}
        px={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h5">Mozrilla Chat</Typography>
<Box>
        {/* Show Delete Icon only when messages are selected */}
        {selectedMessages.length > 0 && (
          <Tooltip title="Delete Selected">
            <IconButton
              color="inherit"
              onClick={deleteSelectedMessages}
              sx={{ marginLeft: 2 }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        )}

        <IconButton
          color="inherit"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={() => handleMenuAction("Profile")}>Profile</MenuItem>
          <MenuItem onClick={() => handleMenuAction("Settings")}>Settings</MenuItem>
          <MenuItem onClick={() => setMenuSection('login')}>Logout</MenuItem>
        </Menu>
      </Box>
      </Box>

      {/* Chat Section */}
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 2,
          backgroundColor: "#f8f9fa",
        }}
      >
        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                justifyContent: message.userId === "12345" ? "flex-end" : "flex-start",
                backgroundColor: selectedMessages.includes(message.id) ? "rgba(0, 114, 245, 0.3)" : "transparent",
              }}
              onClick={() => toggleSelection(message.id)}
              onContextMenu={(e) => handleMenuOpen(e, message.id)}
            >
              <Paper
                sx={{
                  padding: 1,
                  maxWidth: "70%",
                  bgcolor: message.userId === "12345" ? "primary.main" : "grey.300",
                  color: message.userId === "12345" ? "white" : "black",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {message.userId}
                </Typography>
                {message.file && (
  <Card sx={{ maxWidth: 345, margin: 2 }}>
    <CardMedia
      component="img"
      height="200"
      image={URL.createObjectURL(message.file)} // Create a preview URL from the file
      alt={message.text} // Use t  he file name as the alt text
    />
      </Card>
    
)}

                <Typography>{message.text}</Typography>
                <Typography variant="body2" sx={{ textAlign: "right" }}>
                  {message.date} {message.time}
                </Typography>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Paper>
<Box>
      {/* Input Section */}
      <Box sx={{backgroundColor:'#f8f9fa', }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'relative', bottom: 10, left: 25, width:40, height:45, transform:'scale(-10px)' }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
      <Box display="flex" p={2} borderTop="1px solid #ddd" bgcolor="white" sx={{overflow:'auto'}}>
  <TextField
    fullWidth
    placeholder="Type a message..."
    value={input}
    onChange={(e) => setInput(e.target.value)}
    variant="outlined"
    multiline
    minRows={1} // Start with one row of height
    maxRows={7} // Limit the number of rows before scrolling starts
    sx={{
      resize: 'none', // Prevent resizing manually
      maxHeight: '30vh', // Limit the height to 30% of the viewport height
      overflow: 'none', // Allow scrolling if the content overflows
      position:'relative'
    }}
    
  />
  <Box display="flex" sx={{justifyContent:'center', alignItems:'flex-end', }}>
  <Button
    variant="contained"
    color="primary"
    onClick={sendMessage}
    sx={{  height:'55px',marginLeft:'5px'  }}
  >
    <SendIcon />
  </Button>
  </Box>
</Box>

</Box>
    </Box>
  );
};

export default Chat;
