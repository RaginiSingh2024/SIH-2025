import React, { useState } from 'react';

import { Stack } from '@mui/material';

import Project from './Project';
import ProfileSection from '../components/ProfileSection';
import ProfileSectionItem from '../components/ProfileSectionItem';
import AddProjectDialog, { type ProjectFormData } from './AddProject';

interface Project {
  id: number;
  title: string;
  role: string;
  skills: string[];
  codeLinks: string[];
  hostedLinks: string[];
  description: string;
  isDeleted: boolean;
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: 'E-Bike Website',
    role: 'Developer',
    skills: ['HTML', 'CSS', 'JavaScript'],
    codeLinks: ['#', '#'],
    hostedLinks: ['#'],
    description:
      'Visually appealing animations, ability to choose the design of own choice, responsiveness. A basic landing page for an E-bike seller creating an inquisitive interface for customers.',
    isDeleted: false,
  },
  {
    id: 2,
    title: 'Gemini Clone',
    role: 'Developer',
    skills: ['HTML', 'CSS', 'JavaScript', 'Google Gemini API', 'React'],
    codeLinks: ['#', '#'],
    hostedLinks: ['#'],
    description:
      'NLP, Real time Web Access, Content generation, Summarisation & Translation and many other useful features inherited from Google Gemini API.',
    isDeleted: false,
  },
  {
    id: 3,
    title: 'Music Player Website',
    role: 'Developer',
    skills: ['HTML', 'CSS', 'JavaScript'],
    codeLinks: ['#', '#'],
    hostedLinks: ['#'],
    description:
      'Play, Pause and change of music track using UI buttons. Music Player web application that plays music tracks on your',
    isDeleted: false,
  },
];

const Projects = () => {
  const [open, setOpen] = useState(false);
  const [projectList, setProjectList] = useState(initialProjects);

  const handleSubmit = async (data: ProjectFormData) => {
    console.warn('Projects handleSubmit called with:', data);
    const newProject = {
      id: Date.now(), // Simple ID generation
      ...data,
    };
    console.warn('New project created:', newProject);
    setProjectList(prevList => [...prevList, newProject as Project]);
    setOpen(false);
    console.warn('Dialog closed and project list updated');
  };

  const handleDeleteProject = (projectId: number) => {
    setProjectList(prevList =>
      prevList.map(project =>
        project.id === projectId ? { ...project, isDeleted: true } : project
      )
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const activeProjects = projectList.filter(project => !project.isDeleted);

  return (
    <>
      <ProfileSection
        title="Projects"
        icon="💼"
        buttonText="+ Add Project"
        onAddClick={() => setOpen(true)}
        isEmpty={activeProjects.length === 0}
        emptyTitle="No projects added yet"
        emptyDescription='Click "Add Project" to showcase your work'
      >
        <Stack spacing={3}>
          {activeProjects.map((project: Project) => (
            <ProfileSectionItem key={project.id}>
              <Project project={project} onDelete={handleDeleteProject} />
            </ProfileSectionItem>
          ))}
        </Stack>
      </ProfileSection>
      {open && <AddProjectDialog open={open} onClose={handleClose} onSubmit={handleSubmit} />}
    </>
  );
};

export default Projects;
