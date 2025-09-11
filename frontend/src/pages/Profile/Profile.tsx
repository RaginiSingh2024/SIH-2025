import { Box, Stack, Container } from '@mui/material';

import Skills from './Skills/Skills';
import SocialLinks from './SocialLinks';
import Achievements from './Achievements';
import Projects from './Projects/Projects';
import ProfileHeader from './ProfileHeader';
import Education from './Education/Education';
import Experience from './Experience/Experience';
import { ProfileProvider } from './ProfileContext';
import Certificates from './Certificates/Certificates';
import TrainingDetails from './Training Details/TrainingDetails';
import Extracurriculars from './Extracurriculars/Extracurriculars';


const Profile = () => (
  <ProfileProvider>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="column" spacing={4}>
        {/* Profile Header - Full Width */}
        <Box sx={{ width: '100%' }}>
          <ProfileHeader />
        </Box>
        
        {/* Social Links and Achievements - Full Width */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <SocialLinks />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Achievements />
          </Box>
        </Stack>
        
        {/* All Other Sections Stacked Below */}
        <Stack direction="column" spacing={3}>
          <Projects />
          <Experience />
          <Education />
          <Certificates />
          <Skills />
          <Extracurriculars />
          <TrainingDetails />
        </Stack>
      </Stack>
    </Container>
  </ProfileProvider>
);

export default Profile;
