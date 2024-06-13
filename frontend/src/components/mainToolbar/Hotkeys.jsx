import React, { useEffect } from 'react';
import { Box, Typography, List, ListItem, Divider, Chip } from '@mui/material';


const hotkeys = [
  { key: 'Mouse Wheel', description: 'Zoom in / Zoom out'},
  { key: 'Ctrl + Z', description: 'Undo the last action.'},
  { key: 'Ctrl + Y', description: 'Redo the last action.'},
  { key: 'Delete', description: 'Delete selected objects.'},
  { key: 'Alt + Q', description: 'Set Pointer.'},
  { key: 'Alt + W', description: 'Set Grab.'},
  { key: 'Alt + Z', description: 'Set Rectangle.'},
  { key: 'Alt + X', description: 'Set Polygon.'},
  { key: 'Alt + C', description: 'Set Circle.'},
  { key: 'Alt + V', description: 'Set Arrow.'},
  { key: 'Alt + B', description: 'Set Text.'},
  { key: 'Alt + N', description: 'Set Pencil.'}
];

const Hotkeys = () => {
  return (
    <Box>
      <Box 
        sx={{ 
          maxHeight: '90vh', 
          overflowY: 'auto', 
          '&::-webkit-scrollbar': { width: '6px' }, 
          '&::-webkit-scrollbar-track': { background: '#f1f1f1' }, 
          '&::-webkit-scrollbar-thumb': { background: '#888' }, 
          '&::-webkit-scrollbar-thumb:hover': { background: '#555' } 
        }}
      >
        <List>
          {hotkeys.map((hotkey, index) => (
            <div key={index}>
              <ListItem>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <Chip 
                    label={hotkey.key} 
                    sx={{ mb: 1, backgroundColor: '#e0e0e0', color: '#000', fontWeight: 'bold', fontSize: '1rem', padding: '0.5rem' }} 
                  />
                  <Typography variant="body1" align="center">
                    {hotkey.description}
                  </Typography>
                </Box>
              </ListItem>
              {index < hotkeys.length - 1 && <Divider sx={{ my: 2 }} />}
            </div>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Hotkeys;