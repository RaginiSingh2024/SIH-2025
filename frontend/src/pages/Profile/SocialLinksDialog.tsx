import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { GitHub, LinkedIn, Language, Code } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, Stack, Typography, Button } from '@mui/material';

import { RHFTextField } from 'src/components/hook-form';
import { RHFAutocomplete } from 'src/components/hook-form';

import { SocialLinksSchema } from './Schema';

const platformOptions = [
  { label: 'GitHub', value: 'github', icon: <GitHub fontSize="small" /> },
  { label: 'LinkedIn', value: 'linkedin', icon: <LinkedIn fontSize="small" /> },
  { label: 'Codeforces', value: 'codeforces', icon: <Code fontSize="small" /> },
  { label: 'HackerRank', value: 'hackerrank', icon: <Code fontSize="small" /> },
  { label: 'CodeChef', value: 'codechef', icon: <Code fontSize="small" /> },
  { label: 'Portfolio', value: 'portfolio', icon: <Language fontSize="small" /> },
  { label: 'LeetCode', value: 'leetcode', icon: <Code fontSize="small" /> },
];

const defaultValues = {
  platform: null,
  url: '',
};
type FormValues = {
  platform: { label: string; value: string } | null;
  url: string;
};

export default function SocialLinksDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const methods = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(SocialLinksSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: FormValues) => {
    console.warn('✅ Submitted:', data);
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Select Social Platform</DialogTitle>

        <DialogContent sx={{ pb: 4, pt: 2 }}>
          <Stack spacing={2}>
            <Stack>
              <Typography variant="subtitle2" mb={0.5}>
                Social Platform
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>

              <RHFAutocomplete
                name="platform"
                placeholder="Search a platform"
                options={platformOptions}
                getOptionLabel={option => option.label}
                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {option.icon}
                      <Typography>{option.label}</Typography>
                    </Stack>
                  </li>
                )}
              />
            </Stack>

            <Stack>
              <Typography variant="subtitle2" mb={0.5}>
                Profile Link
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>

              <RHFTextField name="url" placeholder="Paste your profile link" />
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="flex-end" pt={1}>
              <Button onClick={onClose} variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                onClick={handleSubmit(onSubmit)}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
