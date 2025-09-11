import React, { useState } from 'react';

import { Button, Paper, Stack, Typography } from '@mui/material';

import AddAccomplishmentsDialog, { type AccomplishmentFormData } from './AddAccomplishments';

interface Accomplishment {
  id: number;
  title: string;
  text: string;
  isDeleted: boolean;
}

const initialAccomplishments: Accomplishment[] = [
  {
    id: 1,
    title: 'Accomplishment 1',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    isDeleted: false,
  },
  {
    id: 2,
    title: 'Accomplishment 2',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    isDeleted: false,
  },
];

const Accomplishments = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [accomplishments, setAccomplishments] = useState(initialAccomplishments);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = (data: AccomplishmentFormData) => {
    const newAccomplishment = {
      id: Date.now(),
      ...data,
      isDeleted: false,
    };
    setAccomplishments([...accomplishments, newAccomplishment as Accomplishment]);
  };

  const handleDeleteAccomplishment = (accomplishmentId: number) => {
    setAccomplishments(prevList =>
      prevList.map(accomplishment =>
        accomplishment.id === accomplishmentId
          ? { ...accomplishment, isDeleted: true }
          : accomplishment
      )
    );
  };

  return (
    <Paper variant="outlined">
      <Stack direction="row" spacing={2} justifyContent="space-between" mb={2}>
        <Typography variant="h5">Accomplishments</Typography>
        <Button variant="contained" color="primary" size="medium" onClick={() => setOpen(true)}>
          + Add
        </Button>
      </Stack>
      {accomplishments
        .filter(accomplishment => !accomplishment.isDeleted)
        .map((accomplishment: Accomplishment) => (
          <Stack
            key={accomplishment.id}
            direction="column"
            spacing={2}
            justifyContent="space-between"
            mb={2}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Typography variant="h6" color="primary">
                {accomplishment.title}
              </Typography>
              <Button
                color="error"
                variant="text"
                size="small"
                onClick={() => handleDeleteAccomplishment(accomplishment.id)}
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
            <Typography variant="body1">
              {isExpanded ? (
                <span style={{ fontWeight: 400, marginLeft: 4, marginTop: 2 }}>
                  {accomplishment.text || ''}
                </span>
              ) : (
                <span style={{ fontWeight: 400 }}>
                  {' '}
                  {accomplishment.text.length > 90
                    ? accomplishment.text.slice(0, 90) + '...'
                    : accomplishment.text}
                </span>
              )}
            </Typography>
            {accomplishment.text.length > 90 && (
              <Stack mt={1} direction="row" spacing={2} justifyContent="flex-end">
                <Button size="small" color="primary" onClick={() => handleToggle()}>
                  {isExpanded ? 'Show less' : 'Show more'}
                </Button>
              </Stack>
            )}
          </Stack>
        ))}
      <AddAccomplishmentsDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
};

export default Accomplishments;
