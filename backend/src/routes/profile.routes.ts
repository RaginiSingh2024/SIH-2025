import { Router } from 'express';

import profileController from '../controllers/profile.controller';
import userAuth from '../middlewares/user.auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(userAuth);

// Main profile routes
router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);

// Projects routes
router.post('/projects', profileController.addProject);
router.put('/projects/:projectId', profileController.updateProject);
router.delete('/projects/:projectId', profileController.deleteProject);

// Experience routes
router.post('/experiences', profileController.addExperience);
router.put('/experiences/:experienceId', profileController.updateExperience);
router.delete('/experiences/:experienceId', profileController.deleteExperience);

// Education routes
router.post('/education', profileController.addEducation);
router.put('/education/:educationId', profileController.updateEducation);
router.delete('/education/:educationId', profileController.deleteEducation);

// Skills routes
router.post('/skills', profileController.addSkill);
router.put('/skills/:skillId', profileController.updateSkill);
router.delete('/skills/:skillId', profileController.deleteSkill);

// Certificates routes
router.post('/certificates', profileController.addCertificate);
router.put('/certificates/:certificateId', profileController.updateCertificate);
router.delete('/certificates/:certificateId', profileController.deleteCertificate);

// Extracurriculars routes
router.post('/extracurriculars', profileController.addExtracurricular);
router.put('/extracurriculars/:extracurricularId', profileController.updateExtracurricular);
router.delete('/extracurriculars/:extracurricularId', profileController.deleteExtracurricular);

// Accomplishments routes
router.post('/accomplishments', profileController.addAccomplishment);
router.put('/accomplishments/:accomplishmentId', profileController.updateAccomplishment);
router.delete('/accomplishments/:accomplishmentId', profileController.deleteAccomplishment);

// Training details routes
router.post('/training', profileController.addTrainingDetails);
router.put('/training/:trainingId', profileController.updateTrainingDetails);
router.delete('/training/:trainingId', profileController.deleteTrainingDetails);

// Social links routes
router.post('/social-links', profileController.addSocialLink);
router.put('/social-links/:socialLinkId', profileController.updateSocialLink);
router.delete('/social-links/:socialLinkId', profileController.deleteSocialLink);

// Achievements routes
router.put('/achievements', profileController.updateAchievements);

export default router;
