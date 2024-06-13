import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Button } from '@mui/material';
import { styled } from '@mui/system';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: '8px',
  margin: '0 auto',
}));
const ColorPalette = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));


const Draw = () => {
  const [tool, setTool] = useState('');
  const [color, setColor] = useState('');
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  const handleColorClick = (selectedColor) => {
    setColor(selectedColor);
  };

  return (
    <Container>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="tool-select-label">Select Tool</InputLabel>
        <Select
          labelId="tool-select-label"
          id="tool-select"
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          label="Select Tool"
        >
          <MenuItem value="pen">Pen</MenuItem>
          <MenuItem value="pencil">Pencil</MenuItem>
          <MenuItem value="brush">Brush</MenuItem>
          <MenuItem value="eraser">Eraser</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="shape-select-label">Select Shape</InputLabel>
        <Select
          labelId="shape-select-label"
          id="shape-select"
          label="Select Shape"
        >
          <MenuItem value="rect">Rectangle</MenuItem>
          <MenuItem value="circle">Circle</MenuItem>
          <MenuItem value="star">Star</MenuItem>
        </Select>
      </FormControl>
		<ColorPalette>
		{colors.map((col) => (
          <Button 
            key={col} 
            onClick={() => handleColorClick(col)} 
            sx={{ backgroundColor: col, minWidth: '36px', minHeight: '36px', borderRadius: '50%', '&:hover': { backgroundColor: col, opacity: 0.8 }, border: color === col ? '2px solid black' : 'none' }}
          />
        ))}
		</ColorPalette>
    </Container>
  );
};

export default Draw;
