import React from 'react';

import { Typography, Stack, Button } from '@mui/material';

import { fDate } from 'src/utils/format-time';

// import 'remixicon/fonts/remixicon.css';

interface TrainingProps {
  training: any;
  onDelete: (trainingId: number) => void;
}

const Training = ({ training, onDelete }: TrainingProps) => {
  const handleDelete = () => {
    onDelete(training.id);
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Typography variant="subtitle1" fontWeight={600}>
          {training.program}
        </Typography>
        <Button
          color="error"
          variant="text"
          size="small"
          onClick={handleDelete}
          sx={{
            padding: 1,
            minWidth: '40px',
            minHeight: '40px',
            borderRadius: '8px',
          }}
        >
          <i className="ri-delete-bin-fill" style={{ fontSize: '1.3rem' }} />
        </Button>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography variant="body2" mb={1} color="primary" fontWeight={600}>
          {training.organization}
        </Typography>
        <span> | </span>
        <Typography variant="body2" mb={1} color="primary" fontWeight={600}>
          {fDate(training.sDate)} - {training.isOngoing ? 'Present' : fDate(training.eDate)}
        </Typography>
        <span> | </span>
        <Typography variant="body2" mb={1} color="primary" fontWeight={600}>
          {training.location}
        </Typography>
      </Stack>
      <Typography variant="body2" fontWeight={600} ml={3}>
        {training.description}
      </Typography>
    </>
  );
};

export default Training;
