import { useForm, FormProvider } from 'react-hook-form';

import { Box, Stack, Typography } from '@mui/material';

import { RHFMultiSelect } from 'src/components/hook-form';

type FormValues = {
  courses: { label: string; value: string }[];
};

const courseOptions = [
  { label: "ITM SKILL University Internal Hackathon", value: 'nst-placement' },
  { label: '100 Days of Code', value: '100days' },
  { label: "Highest Ranked CGPA", value: 'nst-csai' },
  { label: 'Top 5 Highest Ranked CGPA', value: 'psp-revision' },
];

function Achievements() {
  const methods = useForm<FormValues>({
    defaultValues: {
      courses: [],
    },
  });

  return (
    <FormProvider {...methods}>
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
        <Stack spacing={2}>
          <Typography fontWeight="bold" color="text.primary">
            Achievements
          </Typography>

          {/* MultiSelect Dropdown */}
          <RHFMultiSelect
            name="courses"
            options={courseOptions}
            placeholder="Choose your course"
            chip
          />

          <Stack
            direction="row"
            divider={<Box sx={{ width: '1px', backgroundColor: 'grey.700' }} />}
            sx={{
              border: '1px solid',
              borderColor: 'grey.700',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Stack flex={1} spacing={0.5} sx={{ px: 2, py: 1.5, backgroundColor: 'grey.900' }}>
              <Typography variant="caption" color="text.secondary">
                All Time Rank
              </Typography>
              <Typography fontWeight="bold" color="text.primary">
                # 0
              </Typography>
            </Stack>

            <Stack flex={1} spacing={0.5} sx={{ px: 2, py: 1.5, backgroundColor: 'grey.900' }}>
              <Typography variant="caption" color="text.secondary">
                Total XP
              </Typography>
              <Typography fontWeight="bold" color="text.primary">
                ⚡ 0
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

export default Achievements;
