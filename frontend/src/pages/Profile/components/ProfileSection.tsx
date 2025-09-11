import React from 'react';

import { Box, Paper, Stack, Button, Typography } from '@mui/material';

interface ProfileSectionProps {
  title: string;
  icon: string;
  buttonText: string;
  onAddClick: () => void;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  icon,
  buttonText,
  onAddClick,
  children,
  isEmpty = false,
  emptyTitle = 'No items added yet',
  emptyDescription = `Click "${buttonText}" to add items`,
}) => (
  <Paper 
    variant="outlined"
    sx={{ 
      p: 3,
      borderRadius: 2,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      },
      transition: 'box-shadow 0.3s ease'
    }}
  >
    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={3}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {icon} {title}
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        size="medium" 
        onClick={onAddClick}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
          px: 3,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        {buttonText}
      </Button>
    </Stack>
    
    {isEmpty ? (
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 6,
          color: 'text.secondary'
        }}
      >
        <Typography variant="h6" gutterBottom>
          {emptyTitle}
        </Typography>
        <Typography variant="body2">
          {emptyDescription}
        </Typography>
      </Box>
    ) : (
      children
    )}
  </Paper>
);

export default ProfileSection;
