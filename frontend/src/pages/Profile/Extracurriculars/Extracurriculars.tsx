import React, { useState } from 'react';

import { Stack, Button, Typography } from '@mui/material';

import ProfileSection from '../components/ProfileSection';
import ProfileSectionItem from '../components/ProfileSectionItem';
import AddExtracurricularsDialog, { type ExtracurricularFormData } from './AddExtracurriculars';

// import 'remixicon/fonts/remixicon.css';

interface Extracurricular {
  id: number;
  title: string;
  text: string;
  isDeleted: boolean;
}

const initialExtracurriculars: Extracurricular[] = [
  {
    id: 1,
    title: 'Extracurricular 1',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    isDeleted: false,
  },
  {
    id: 2,
    title: 'Extracurricular 2',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    isDeleted: false,
  },
];

const Extracurriculars = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [extracurriculars, setExtracurriculars] = useState(initialExtracurriculars);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = (data: ExtracurricularFormData) => {
    const newExtracurricular = {
      id: Date.now(),
      ...data,
      isDeleted: false,
    };
    setExtracurriculars([...extracurriculars, newExtracurricular as Extracurricular]);
  };

  const handleDeleteExtracurricular = (extracurricularId: number) => {
    setExtracurriculars(prevList =>
      prevList.map(extracurricular =>
        extracurricular.id === extracurricularId
          ? { ...extracurricular, isDeleted: true }
          : extracurricular
      )
    );
  };

  const activeExtracurriculars = extracurriculars.filter(extracurricular => !extracurricular.isDeleted);

  return (
    <>
      <ProfileSection
        title="Extracurricular & POR"
        icon="🎯"
        buttonText="+ Add Activity"
        onAddClick={() => setOpen(true)}
        isEmpty={activeExtracurriculars.length === 0}
        emptyTitle="No activities added yet"
        emptyDescription='Click "Add Activity" to showcase your extracurricular activities'
      >
        <Stack spacing={3}>
          {activeExtracurriculars.map((extracurricular: Extracurricular) => (
            <ProfileSectionItem key={extracurricular.id}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 600
                    }}
                  >
                    {extracurricular.title}
                  </Typography>
                  <Button
                    color="error"
                    variant="text"
                    size="small"
                    onClick={() => handleDeleteExtracurricular(extracurricular.id)}
                    sx={{
                      padding: 1,
                      minWidth: '40px',
                      minHeight: '40px',
                      borderRadius: '8px',
                      '&:hover': {
                        bgcolor: 'error.light',
                        color: 'white',
                      }
                    }}
                  >
                    <i className="ri-delete-bin-fill" style={{ fontSize: '1.3rem' }} />
                  </Button>
                </Stack>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.6
                  }}
                >
                  {isExpanded ? (
                    extracurricular.text || ''
                  ) : (
                    extracurricular.text.length > 90
                      ? extracurricular.text.slice(0, 90) + '...'
                      : extracurricular.text
                  )}
                </Typography>
                
                {extracurricular.text.length > 90 && (
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => handleToggle()}
                    sx={{
                      alignSelf: 'flex-start',
                      textTransform: 'none',
                      fontWeight: 500,
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </Button>
                )}
              </Stack>
            </ProfileSectionItem>
          ))}
        </Stack>
      </ProfileSection>
      
      <AddExtracurricularsDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Extracurriculars;
