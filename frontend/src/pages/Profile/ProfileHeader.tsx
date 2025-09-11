import { useState } from 'react';

import { Tooltip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';

import EditProfileDialog from './EditProfileDialog';

function ProfileHeader() {
  const [openEdit, setOpenEdit] = useState(false);

  const user = {
    firstName: 'Anoop Gupta',
    username: 'anoop',
    description: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore necessitatibus vero mollitia sint dolores facere ipsa aliquid inventore culpa, minus expedita maiores non voluptatibus perferendis recusandae quidem, quia doloremque perspiciatis.',
    gender: 'Male' as const,
    email: 'anoop@example.com',
    phone: '1234567890',
    dob: new Date('1990-01-01'),
    addressline1: '123 Main Street',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    country: 'India',
    // These are for display only
    college: 'School of Future Tech',
    initials: 'AG',
    followers: 0,
    following: 0,
  };

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%,',
          borderRadius: 3,
          p: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
            pointerEvents: 'none'
          }
        }}
      >
        {/* Top section */}
        <Stack direction="row" spacing={3} alignItems="center" mb={3}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                fontSize: 32,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '3px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
            >
              {user.initials}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: '#4CAF50',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'white'
                }}
              />
            </Box>
          </Box>

          <Stack spacing={0.5} flex={1}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {user.firstName}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.9,
                fontWeight: 500
              }}
            >
              @{user.username}
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {user.followers} Followers
              </Typography>
              <Typography sx={{ opacity: 0.7 }}>•</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {user.following} Following
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* College */}
        <Typography 
          variant="body2" 
          sx={{ 
            opacity: 0.9,
            bgcolor: 'rgba(255,255,255,0.1)',
            px: 2,
            py: 1,
            borderRadius: 2,
            mb: 2,
            fontWeight: 500
          }}
        >
          🎓 {user.college}
        </Typography>

        {/* Description */}
        <Typography 
          variant="body2" 
          sx={{ 
            opacity: 0.9,
            lineHeight: 1.6,
            mb: 3
          }}
        >
          {user.description.slice(0, 120)}...
        </Typography>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Tooltip title="Coming Soon">
            <span style={{ display: 'inline-block' }}>
              <Button
                variant="contained"
                startIcon={<LockIcon />}
                disabled
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)',
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(255,255,255,0.7)',
                  },
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3
                }}
              >
                Generate Resume
              </Button>
            </span>
          </Tooltip>

          <Button 
            variant="contained" 
            onClick={() => setOpenEdit(true)}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            ✏️ Edit Profile
          </Button>
        </Stack>
      </Box>

      {/* Edit Profile Dialog */}
      {openEdit && (
        <EditProfileDialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          defaultValues={user}
          onSubmit={data => {
            console.error('Updated profile:', data);
          }}
        />
      )}
    </>
  );
}

export default ProfileHeader;
