import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { Label } from 'src/components/label';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: BoxProps) {
  const { user } = useMockedUser();
  const router = useRouter();

  const handleVisitProfile = () => {
    router.push('/app/profile');
  };

  return (
    <Box
      sx={[{ px: 2, py: 5, textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 48, height: 48 }}>
            {user?.displayName?.charAt(0).toUpperCase()}
          </Avatar>

          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            Developer
          </Label>
        </Box>

        <Box sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ mb: 0, color: 'var(--layout-nav-text-primary-color)' }}
          >
            Built By Ai
          </Typography>

          <Typography
            variant="body2"
            noWrap
            sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
          >
            BTech 2nd Year
          </Typography>
        </Box>    
        <Stack spacing={1}>
          <Button
            fullWidth
            size="small"
            color="inherit"
            variant="outlined"
            onClick={handleVisitProfile}
          >
            Visit Profile
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
