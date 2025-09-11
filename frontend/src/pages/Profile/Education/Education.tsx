import { useState } from 'react';

import { Stack } from '@mui/material';

import Edu from './Edu';
import ProfileSection from '../components/ProfileSection';
import ProfileSectionItem from '../components/ProfileSectionItem';
import AddEducationDialog, { type EducationFormData } from './AddEducation';

interface Education {
  id: number;
  institution: string;
  degree: string;
  sYear: string;
  eYear: string;
  ongoing: boolean;
  isDeleted: boolean;
}

const degrees: Education[] = [
  {
    id: 1,
    institution: 'Narayana',
    degree: 'Intermediate - XII',
    sYear: '2020',
    eYear: '2021',
    ongoing: false,
    isDeleted: false,
  },
  {
    id: 2,
    institution: 'Meridian',
    degree: '7-10th',
    sYear: '2020',
    eYear: '2021',
    ongoing: false,
    isDeleted: false,
  },
  {
    id: 3,
    institution: 'SIWS',
    degree: '1-6th',
    sYear: '2020',
    eYear: '2021',
    ongoing: false,
    isDeleted: false,
  },
];

const Education = () => {
  const [open, setOpen] = useState(false);
  const [educations, setEducations] = useState<Education[]>(degrees);

  const handleSubmit = (data: EducationFormData) => {
    console.warn('Adding new education:', data);

    const getYear = (date: string | undefined): string => {
      if (!date) return '';
      const year = new Date(date).getFullYear();
      return isNaN(year) ? '' : String(year);
    };

    const newEducation: Education = {
      id: Date.now(),
      institution: data.institution,
      degree: data.degree,
      sYear: getYear(data.sYear),
      eYear: getYear(data.eYear) ?? '',
      ongoing: data.ongoing,
      isDeleted: false,
    };
    setEducations(prev => [...prev, newEducation]);
  };

  const handleDeleteEducation = (educationId: number) => {
    setEducations(prevList =>
      prevList.map(education =>
        education.id === educationId ? { ...education, isDeleted: true } : education
      )
    );
  };

  const activeEducations = educations.filter(education => !education.isDeleted);

  return (
    <>
      <ProfileSection
        title="Education"
        icon="🎓"
        buttonText="+ Add Education"
        onAddClick={() => setOpen(true)}
        isEmpty={activeEducations.length === 0}
        emptyTitle="No education added yet"
        emptyDescription='Click "Add Education" to showcase your academic background'
      >
        <Stack spacing={3}>
          {activeEducations.map((degree: Education) => (
            <ProfileSectionItem key={degree.id}>
              <Edu edu={degree} onDelete={handleDeleteEducation} />
            </ProfileSectionItem>
          ))}
        </Stack>
      </ProfileSection>
      
      <AddEducationDialog open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
    </>
  );
};

export default Education;
