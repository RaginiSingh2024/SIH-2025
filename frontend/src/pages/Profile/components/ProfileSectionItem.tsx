import React from 'react';

import { Box } from '@mui/material';

interface ProfileSectionItemProps {
  children: React.ReactNode;
}

const ProfileSectionItem: React.FC<ProfileSectionItemProps> = ({ children }) => (
  <Box
    sx={{
      p: 2.5,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      bgcolor: 'background.paper',
      '&:hover': {
        borderColor: 'primary.main',
        bgcolor: 'action.hover',
      },
      transition: 'all 0.2s ease'
    }}
  >
    {children}
  </Box>
);

export default ProfileSectionItem;
