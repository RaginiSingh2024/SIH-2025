import React, { useState } from 'react';

import { Stack } from '@mui/material';

import Training from './Training';
import ProfileSection from '../components/ProfileSection';
import ProfileSectionItem from '../components/ProfileSectionItem';
import AddTrainingDetailsDialog, { type TrainingDetailsFormData } from './AddTrainingDetails';

interface TrainingDetailsData {
  id: number;
  program: string;
  organization: string;
  sDate: string;
  eDate: string;
  description: string;
  location?: string;
  isOnline: boolean;
  urls: string[];
  isDeleted: boolean;
}

const initialTrainingDetails: TrainingDetailsData[] = [
  {
    id: 1,
    program: 'BrainoBrain Wonderkid',
    organization: 'BrainoBrain',
    sDate: '2020-09-24',
    eDate: '2020-12-31',
    description: 'Awarded the title of Silver Topper in the BrainObrain Wonderkid competition.',
    location: 'Online',
    isOnline: true,
    urls: ['https://www.brainobrain.com'],
    isDeleted: false,
  },
  {
    id: 2,
    program: 'Advanced Web Development',
    organization: 'Udemy',
    sDate: '2021-01-15',
    eDate: '2021-03-31',
    description: 'Completed an intensive course on modern web development technologies.',
    location: 'Online',
    isOnline: true,
    urls: ['https://www.udemy.com'],
    isDeleted: false,
  },
];

const TrainingDetails = () => {
  const [open, setOpen] = useState(false);
  const [trainingDetails, setTrainingDetails] =
    useState<TrainingDetailsData[]>(initialTrainingDetails);

  const handleSubmit = (data: TrainingDetailsFormData) => {
    const newTrainingDetails: TrainingDetailsData = {
      id: Date.now(),
      program: data.program,
      organization: data.organization,
      sDate: data.sDate,
      eDate: data.eDate ?? '',
      description: data.description,
      location: data.location,
      isOnline: data.isOnline ?? true,
      urls: data.urls,
      isDeleted: false,
    };
    setTrainingDetails(prev => [...prev, newTrainingDetails]);
    setOpen(false);
  };

  const handleDeleteTraining = (trainingId: number) => {
    setTrainingDetails(prevList =>
      prevList.map(training =>
        training.id === trainingId ? { ...training, isDeleted: true } : training
      )
    );
  };

  const activeTrainings = trainingDetails.filter(training => !training.isDeleted);

  return (
    <>
      <ProfileSection
        title="Training Details"
        icon="📚"
        buttonText="+ Add Training"
        onAddClick={() => setOpen(true)}
        isEmpty={activeTrainings.length === 0}
        emptyTitle="No training details added yet"
        emptyDescription='Click "Add Training" to showcase your professional development'
      >
        <Stack spacing={3}>
          {activeTrainings.map((trainingDetail: TrainingDetailsData) => (
            <ProfileSectionItem key={trainingDetail.id}>
              <Training training={trainingDetail} onDelete={handleDeleteTraining} />
            </ProfileSectionItem>
          ))}
        </Stack>
      </ProfileSection>
      
      <AddTrainingDetailsDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default TrainingDetails;
