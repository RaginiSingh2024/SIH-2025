import React, { useState } from 'react';

import { Stack, Paper, Typography, Button } from '@mui/material';

import Exp from './Exp';
import ProfileSection from '../components/ProfileSection';
import ProfileSectionItem from '../components/ProfileSectionItem';
import AddExperienceDialog, { type ExperienceFormData } from './AddExperience';

interface Experience {
  id: number;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  type: string;
  description: string;
  location: string;
  currentlyWorking: boolean;
  isWFH?: boolean;
  isDeleted: boolean;
}

const initialExperience: Experience[] = [
  {
    id: 1,
    company: 'Google',
    title: 'Software Engineer',
    startDate: '2020-01-01',
    endDate: '2021-01-01',
    type: 'Full Time',
    description:
      'Worked on the development of the Google Search Engine.jhbgcdxdfcfgtcfcfgtctfgcvbfgcftdfctfyujhfcxdxctfcvfgcvfbgtcvtffdfdtgfcgftdttfcvhgfcvftdcdtc',
    location: 'Mountain View, CA',
    currentlyWorking: true,
    isDeleted: false,
  },
  {
    id: 2,
    company: 'Google',
    title: 'Software Engineer',
    startDate: '2020-01-01',
    endDate: '2021-01-01',
    type: 'Full Time',
    description:
      'Worked on the development of the Google Search Engine.yuhfrwfnvojefnvgheuirfhvnjesngveuoovrdnueoiueshdnvoihfgoeiurjgfeoirhjfdoeisrhjvgeoiurhjerouighedfugo',
    location: 'Mountain View, CA',
    currentlyWorking: true,
    isDeleted: false,
  },
  {
    id: 3,
    company: 'Google',
    title: 'Software Engineer',
    startDate: '2020-01-01',
    endDate: '2021-01-01',
    type: 'Full Time',
    description:
      'Worked on the development of the Google Search Engine.hueifhvbeufhbnwruecdonvowqiurhfgvengueirngniuegheruhfgejnfdjsvnbfhbgrehgbriejfgnejuhnvgejurheirughertguerhng',
    location: 'Mountain View, CA',
    currentlyWorking: true,
    isDeleted: false,
  },
];

const Experience = () => {
  const [open, setOpen] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>(initialExperience);

  const handleSubmit = (data: ExperienceFormData) => {
    console.warn('Adding new experience:', data);

    const newExperience: Experience = {
      id: Date.now(), // Simple ID generation
      company: data.company,
      title: data.title,
      startDate: data.startDate,
      endDate: data.currentlyWorking ? undefined : data.endDate,
      type: data.type, // Default type, could be made configurable
      description: data.description,
      location: data.location,
      currentlyWorking: data.currentlyWorking,
      isWFH: data.isWFH,
      isDeleted: false,
    };

    setExperiences(prev => [...prev, newExperience]); // Add new experience at the top
  };

  const handleDeleteExperience = (experienceId: number) => {
    setExperiences(prevList =>
      prevList.map(experience =>
        experience.id === experienceId ? { ...experience, isDeleted: true } : experience
      )
    );
  };

  const activeExperiences = experiences.filter(experience => !experience.isDeleted);

  return (
    <>
      <ProfileSection
        title="Experience"
        icon="🏢"
        buttonText="+ Add Experience"
        onAddClick={() => setOpen(true)}
        isEmpty={activeExperiences.length === 0}
        emptyTitle="No experience added yet"
        emptyDescription='Click "Add Experience" to showcase your work history'
      >
        <Stack spacing={3}>
          {activeExperiences.map((experience: Experience) => (
            <ProfileSectionItem key={experience.id}>
              <Exp experience={experience} onDelete={handleDeleteExperience} />
            </ProfileSectionItem>
          ))}
        </Stack>
      </ProfileSection>
      
      {open && (
        <AddExperienceDialog open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      )}
    </>
  );
};

export default Experience;
