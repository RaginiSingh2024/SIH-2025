import React, { useState } from 'react';

import { Chip, Stack, } from '@mui/material';

import ProfileSection from '../components/ProfileSection';
import AddSkillsDialog, { type SkillsFormData } from './AddSkills';

const initialSkills = [
  {
    id: 1,
    title: 'UI/UX',
    level: 'Intermediate',
  },
  {
    id: 2,
    title: 'Software Developement',
    level: 'Intermediate',
  },
  {
    id: 3,
    title: 'Frontend',
    level: 'Intermediate',
  },
];

const Skills = () => {
  const [skills, setSkills] = useState(initialSkills);
  const [open, setOpen] = useState(false);
  const handleDeleteSkill = (skillToDelete: number) => {
    setSkills(skills.filter(skill => skill.id !== skillToDelete));
  };

  const handleSubmit = (data: SkillsFormData) => {
    // Check if skill already exists (case-insensitive comparison)
    const skillExists = skills.some(
      skill => skill.title.toLowerCase() === data.skillTitle.toLowerCase()
    );

    if (skillExists) {
      // You can add a toast notification here if needed
      console.warn('Skill already exists');
      return;
    }

    const newSkill = {
      id: skills.length + 1,
      title: data.skillTitle,
      level: data.level,
    };
    setSkills([...skills, newSkill]);
  };

  return (
    <>
      <ProfileSection
        title="Skills"
        icon="🛠️"
        buttonText="+ Add Skill"
        onAddClick={() => setOpen(true)}
        isEmpty={skills.length === 0}
        emptyTitle="No skills added yet"
        emptyDescription='Click "Add Skill" to showcase your technical abilities'
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {skills.map(skill => (
            <Chip
              key={skill.id}
              variant="outlined"
              label={`${skill.title} - ${skill.level}`}
              onDelete={() => handleDeleteSkill(skill.id)}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiChip-deleteIcon': {
                    color: 'white'
                  }
                },
                '& .MuiChip-deleteIcon': {
                  color: 'primary.main',
                  '&:hover': {
                    color: 'primary.dark'
                  }
                },
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </Stack>
      </ProfileSection>
      
      <AddSkillsDialog open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
    </>
  );
};

export default Skills;
