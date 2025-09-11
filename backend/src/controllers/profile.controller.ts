import { Request, Response } from 'express';
import mongoose from 'mongoose';

import profileModel from '../models/profile.model';
import userModel from '../models/user.model';

import catchAsync from '../utils/catchAsync.utils';
import ExpressResponse from '../libs/express/response.libs';

class ProfileController {
  // Get user profile
  public getProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;

    const profile = await profileModel.findOne({ userId }).populate('userId', 'name email');
    
    if (!profile) {
      return ExpressResponse.notFound(res, 'Profile not found');
    }

    ExpressResponse.success(res, 'Profile fetched successfully', { profile });
  });

  // Create or update profile
  public updateProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const profileData = req.body;

    // Ensure email matches user's email
    const user = await userModel.findById(userId);
    if (!user) {
      return ExpressResponse.notFound(res, 'User not found');
    }

    profileData.email = user.email;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { ...profileData, userId },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    ).populate('userId', 'name email');

    ExpressResponse.success(res, 'Profile updated successfully', { profile });
  });

  // Add project
  public addProject = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const projectData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $push: { projects: projectData } },
      { new: true, upsert: true }
    );

    ExpressResponse.success(res, 'Project added successfully', { profile });
  });

  // Update project
  public updateProject = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { projectId } = req.params;
    const projectData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId, 'projects._id': projectId },
      { $set: { 'projects.$': { ...projectData, _id: projectId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Project not found');
    }

    ExpressResponse.success(res, 'Project updated successfully', { profile });
  });

  // Delete project
  public deleteProject = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { projectId } = req.params;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Profile not found');
    }

    ExpressResponse.success(res, 'Project deleted successfully', { profile });
  });

  // Add experience
  public addExperience = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const experienceData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $push: { experiences: experienceData } },
      { new: true, upsert: true }
    );

    ExpressResponse.success(res, 'Experience added successfully', { profile });
  });

  // Update experience
  public updateExperience = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { experienceId } = req.params;
    const experienceData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId, 'experiences._id': experienceId },
      { $set: { 'experiences.$': { ...experienceData, _id: experienceId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Experience not found');
    }

    ExpressResponse.success(res, 'Experience updated successfully', { profile });
  });

  // Delete experience
  public deleteExperience = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { experienceId } = req.params;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $pull: { experiences: { _id: experienceId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Profile not found');
    }

    ExpressResponse.success(res, 'Experience deleted successfully', { profile });
  });

  // Add education
  public addEducation = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const educationData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $push: { education: educationData } },
      { new: true, upsert: true }
    );

    ExpressResponse.success(res, 'Education added successfully', { profile });
  });

  // Update education
  public updateEducation = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { educationId } = req.params;
    const educationData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId, 'education._id': educationId },
      { $set: { 'education.$': { ...educationData, _id: educationId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Education not found');
    }

    ExpressResponse.success(res, 'Education updated successfully', { profile });
  });

  // Delete education
  public deleteEducation = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { educationId } = req.params;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $pull: { education: { _id: educationId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Profile not found');
    }

    ExpressResponse.success(res, 'Education deleted successfully', { profile });
  });

  // Add skill
  public addSkill = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const skillData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $push: { skills: skillData } },
      { new: true, upsert: true }
    );

    ExpressResponse.success(res, 'Skill added successfully', { profile });
  });

  // Update skill
  public updateSkill = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { skillId } = req.params;
    const skillData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId, 'skills._id': skillId },
      { $set: { 'skills.$': { ...skillData, _id: skillId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Skill not found');
    }

    ExpressResponse.success(res, 'Skill updated successfully', { profile });
  });

  // Delete skill
  public deleteSkill = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { skillId } = req.params;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $pull: { skills: { _id: skillId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Profile not found');
    }

    ExpressResponse.success(res, 'Skill deleted successfully', { profile });
  });

  // Add certificate
  public addCertificate = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const certificateData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $push: { certificates: certificateData } },
      { new: true, upsert: true }
    );

    ExpressResponse.success(res, 'Certificate added successfully', { profile });
  });

  // Update certificate
  public updateCertificate = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { certificateId } = req.params;
    const certificateData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId, 'certificates._id': certificateId },
      { $set: { 'certificates.$': { ...certificateData, _id: certificateId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Certificate not found');
    }

    ExpressResponse.success(res, 'Certificate updated successfully', { profile });
  });

  // Delete certificate
  public deleteCertificate = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { certificateId } = req.params;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $pull: { certificates: { _id: certificateId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Profile not found');
    }

    ExpressResponse.success(res, 'Certificate deleted successfully', { profile });
  });

  // Add extracurricular
  public addExtracurricular = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const extracurricularData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $push: { extracurriculars: extracurricularData } },
      { new: true, upsert: true }
    );

    ExpressResponse.success(res, 'Extracurricular added successfully', { profile });
  });

  // Update extracurricular
  public updateExtracurricular = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { extracurricularId } = req.params;
    const extracurricularData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId, 'extracurriculars._id': extracurricularId },
      { $set: { 'extracurriculars.$': { ...extracurricularData, _id: extracurricularId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Extracurricular not found');
    }

    ExpressResponse.success(res, 'Extracurricular updated successfully', { profile });
  });

  // Delete extracurricular
  public deleteExtracurricular = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { extracurricularId } = req.params;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $pull: { extracurriculars: { _id: extracurricularId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Profile not found');
    }

    ExpressResponse.success(res, 'Extracurricular deleted successfully', { profile });
  });

  // Add accomplishment
  public addAccomplishment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const accomplishmentData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $push: { accomplishments: accomplishmentData } },
      { new: true, upsert: true }
    );

    ExpressResponse.success(res, 'Accomplishment added successfully', { profile });
  });

  // Update accomplishment
  public updateAccomplishment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { accomplishmentId } = req.params;
    const accomplishmentData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId, 'accomplishments._id': accomplishmentId },
      { $set: { 'accomplishments.$': { ...accomplishmentData, _id: accomplishmentId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Accomplishment not found');
    }

    ExpressResponse.success(res, 'Accomplishment updated successfully', { profile });
  });

  // Delete accomplishment
  public deleteAccomplishment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { accomplishmentId } = req.params;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $pull: { accomplishments: { _id: accomplishmentId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Profile not found');
    }

    ExpressResponse.success(res, 'Accomplishment deleted successfully', { profile });
  });

  // Add training details
  public addTrainingDetails = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const trainingData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $push: { trainingDetails: trainingData } },
      { new: true, upsert: true }
    );

    ExpressResponse.success(res, 'Training details added successfully', { profile });
  });

  // Update training details
  public updateTrainingDetails = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { trainingId } = req.params;
    const trainingData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId, 'trainingDetails._id': trainingId },
      { $set: { 'trainingDetails.$': { ...trainingData, _id: trainingId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Training details not found');
    }

    ExpressResponse.success(res, 'Training details updated successfully', { profile });
  });

  // Delete training details
  public deleteTrainingDetails = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { trainingId } = req.params;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $pull: { trainingDetails: { _id: trainingId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Profile not found');
    }

    ExpressResponse.success(res, 'Training details deleted successfully', { profile });
  });

  // Add social link
  public addSocialLink = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const socialLinkData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $push: { socialLinks: socialLinkData } },
      { new: true, upsert: true }
    );

    ExpressResponse.success(res, 'Social link added successfully', { profile });
  });

  // Update social link
  public updateSocialLink = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { socialLinkId } = req.params;
    const socialLinkData = req.body;

    const profile = await profileModel.findOneAndUpdate(
      { userId, 'socialLinks._id': socialLinkId },
      { $set: { 'socialLinks.$': { ...socialLinkData, _id: socialLinkId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Social link not found');
    }

    ExpressResponse.success(res, 'Social link updated successfully', { profile });
  });

  // Delete social link
  public deleteSocialLink = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { socialLinkId } = req.params;

    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $pull: { socialLinks: { _id: socialLinkId } } },
      { new: true }
    );

    if (!profile) {
      return ExpressResponse.notFound(res, 'Profile not found');
    }

    ExpressResponse.success(res, 'Social link deleted successfully', { profile });
  });

  // Update achievements (internal method, can be called when user completes actions)
  public updateAchievements = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { type, increment = 1 } = req.body;

    const updateField = `achievements.${type}`;
    
    const profile = await profileModel.findOneAndUpdate(
      { userId },
      { $inc: { [updateField]: increment } },
      { new: true, upsert: true }
    );

    ExpressResponse.success(res, 'Achievements updated successfully', { profile });
  });
}

export default new ProfileController();
