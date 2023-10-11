import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius:0.75,
  boxShadow: 24,
  p: 4,
};
function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [selectedNote, setSelectedNote] = useState(null);
  const [updateData, setUpdateData] = useState({ title: '', content: '' });
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    axios.get('https://anupserver.onrender.com/api/notes')
      .then(response => setNotes(response.data))
      .catch(error => console.error('Error fetching notes:', error));
  }, []);

  const handleCreateNote = () => {
    axios.post('https://anupserver.onrender.com/api/notes', newNote)
      .then(response => {
        setNotes([...notes, response.data]);
        setNewNote({ title: '', content: '' });
      })
      .catch(error => console.error('Error creating note:', error));
  };

  const handleUpdateNote = () => {
    if (!selectedNote) return;

    axios.put(`https://anupserver.onrender.com/api/notes/${selectedNote._id}`, updateData)
      .then(response => {
        const updatedNotes = notes.map(note => (note._id === response.data._id ? response.data : note));
        setNotes(updatedNotes);
        setSelectedNote(null);
        setUpdateData({ title: '', content: '' });
      })
      .catch(error => console.error('Error updating note:', error));
  };

  const handleDeleteNote = (id) => {
    axios.delete(`https://anupserver.onrender.com/api/notes/${id}`)
      .then(response => {
        const filteredNotes = notes.filter(note => note._id !== id);
        setNotes(filteredNotes);
      })
      .catch(error => console.error('Error deleting note:', error));
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setUpdateData({ title: note.title, content: note.content });
  };

  const handleBoth = (e)=>{
    handleNoteClick(e);
    handleOpen();
  }

  const handleBoth2 = ()=>{
    handleUpdateNote();
    handleClose();
  }
  
  return (
    <div className="App flex justify-center items-center">
      <div className="flex flex-col items-center justify-center pt-16">
        <h1 className="text-7xl font-bold font-mono text-white">Notes App</h1>
        <div className="note-form flex flex-col mt-10 gap-5">
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            className="p-2"
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <textarea
            placeholder="Content"
            value={newNote.content}
            className="p-2"
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
          />
          <button
            onClick={handleCreateNote}
            className="rounded-xl p-1 bg-blue-300"
          >
            Create
          </button>
        </div>
        <div className="note-list  mt-10 grid grid-cols-4 ">
          {notes.map((note) => (
            <div
              key={note._id}
              className="note-item rounded-lg p-3 flex flex-col justify-around bg-blue-50 text-center m-10 h-[80%]"
            >
              <h3 className="text-3xl font-bold">{note.title}</h3>
              <p className="w-[100%] text-xl">{note.content}</p>
              <div className="flex gap-10 items-center justify-center">
                <button className="rounded-xl p-1 bg-blue-300 w-16">
                  View
                </button>
                <button
                  onClick={() => handleBoth(note)}
                  className="rounded-xl p-1 bg-blue-300 w-16"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="rounded-xl p-1 bg-blue-300 w-16"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div>
          
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            className='rounded-xl'
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="update-form flex  justify-center items-center">
                {selectedNote && (
                  <div className='flex-col flex bg-blue-50 p-2 rounded-lg'>
                    <input
                      type="text"
                      placeholder="Title"
                      value={updateData.title}
                      className='my-5 px-2'
                      onChange={(e) =>
                        setUpdateData({ ...updateData, title: e.target.value })
                      }
                    />
                    <textarea
                      placeholder="Content"
                      value={updateData.content}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          content: e.target.value,
                        })
                      }
                    />
                    <button onClick={handleBoth2} className='mt-5 rounded-xl p-1 bg-blue-300'>Update</button>
                  </div>
                )}
              </div>
            </Box>
          </Modal>
        </div>
        {/* <div className="update-form">
          {selectedNote && (
            <div>
              <input
                type="text"
                placeholder="Title"
                value={updateData.title}
                onChange={(e) =>
                  setUpdateData({ ...updateData, title: e.target.value })
                }
              />
              <textarea
                placeholder="Content"
                value={updateData.content}
                onChange={(e) =>
                  setUpdateData({ ...updateData, content: e.target.value })
                }
              />
              <button onClick={handleUpdateNote}>Update</button>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default App;
