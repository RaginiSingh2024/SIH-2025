import { useState } from 'react';

import { LinkedIn, GitHub, Add } from '@mui/icons-material';
import { Stack, Typography, Button, IconButton } from '@mui/material';

import SocialLinksDialog from './SocialLinksDialog';

const SocialLinks = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Stack
      sx={{
        borderRadius: 2,
        padding: 3,
        maxWidth: 420,
        width: '100%',
        color: '#ffffff',
        wordBreak: 'break-word',
      }}
    >
      <Stack mb={2} direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
          Social Accounts
        </Typography>
        <Button startIcon={<Add />} variant="contained" color="primary" onClick={handleOpen}>
          Add
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center" className="custom-scroll">
        <IconButton sx={{ color: 'text.primary' }}>
          <LinkedIn />
        </IconButton>
        <IconButton sx={{ color: 'text.primary' }}>
          <GitHub />
        </IconButton>
      </Stack>

      {open ? <SocialLinksDialog open={open} onClose={handleClose} /> : null}
    </Stack>
  );
};

export default SocialLinks;
