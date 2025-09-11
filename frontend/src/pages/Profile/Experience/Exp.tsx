import React, { useState } from 'react';

import { Button, Typography, Stack } from '@mui/material';

import { fDate } from 'src/utils/format-time';

// import 'remixicon/fonts/remixicon.css';

interface ExpProps {
  experience: any;
  onDelete: (experienceId: number) => void;
}

const Exp = ({ experience, onDelete }: ExpProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = () => {
    onDelete(experience.id);
  };

  const desc = experience.description || '';
  const shortDesc = desc.length > 90 ? desc.slice(0, 90) + '...' : desc;

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Typography variant="subtitle1" fontWeight={600}>
          {experience.title}
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
          {experience.company}
        </Typography>
        <span> | </span>
        <Typography variant="body2" mb={1} color="primary" fontWeight={600}>
          {experience.type}
        </Typography>
        <span> | </span>
        <Typography variant="body2" mb={1} color="primary" fontWeight={600}>
          {fDate(experience.startDate)} -{' '}
          {experience.currentlyWorking ? 'Present' : fDate(experience.endDate)}
        </Typography>
      </Stack>

      <Typography variant="body2" mb={1}>
        {experience.location}
      </Typography>
      <Typography variant="body2" fontWeight={600} ml={3}>
        • Description:-
        {isExpanded ? (
          <span style={{ fontWeight: 400, marginLeft: 4, marginTop: 2 }}>{desc}</span>
        ) : (
          <span style={{ fontWeight: 400 }}> {shortDesc}</span>
        )}
      </Typography>
      {desc.length > 90 && (
        <Stack mt={1} direction="row" spacing={2} justifyContent="flex-end">
          <Button size="small" color="primary" onClick={() => handleToggle()}>
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        </Stack>
      )}
    </>
  );
};

export default Exp;
