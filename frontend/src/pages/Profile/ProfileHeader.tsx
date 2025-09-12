import { useState } from 'react';

import LockIcon from '@mui/icons-material/Lock';
import {
  Avatar,
  Box,
  Button,
  Card,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

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
      <Card
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
      <Box
        sx={{
          p: 4,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
              : 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
          color: 'white',
          position: 'relative',
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
                bgcolor: 'background.paper',
                color: 'text.primary',
                border: '3px solid',
                borderColor: 'divider',
                boxShadow: 2
              }}
            >
              {user.initials}
            </Avatar>
            <Box
              sx={(theme) => ({
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: 'success.main',
                border: '2px solid',
                borderColor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              })}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'common.white'
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
          sx={(theme) => ({ 
            opacity: 0.95,
            bgcolor: 'background.paper',
            color: 'text.primary',
            px: 2,
            py: 1,
            borderRadius: 2,
            mb: 2,
            fontWeight: 500,
            border: '1px solid',
            borderColor: 'divider'
          })}
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
                sx={(theme) => ({
                  bgcolor: 'action.disabled',
                  color: 'text.disabled',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  '&.Mui-disabled': {
                    color: 'text.disabled',
                    bgcolor: 'action.disabled',
                  },
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  backdropFilter: 'blur(10px)'
                })}
              >
                Generate Resume
              </Button>
            </span>
          </Tooltip>

          <Button 
            variant="contained" 
            onClick={() => setOpenEdit(true)}
            sx={(theme) => ({
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              border: '1px solid',
              borderColor: 'primary.dark',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'translateY(-1px)',
                boxShadow: 3
              },
              transition: 'all 0.2s ease'
            })}
          >
            ✏️ Edit Profile
          </Button>
        </Stack>
      </Box>
    </Card>

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
