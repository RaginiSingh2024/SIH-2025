import { useState, useEffect } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  Alert,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// Session storage keys
const LEARNING_PATH_STORAGE_KEY = 'lms_learning_path';
const SYLLABUS_STORAGE_KEY = 'lms_syllabus_data';
const DOCUMENTS_STORAGE_KEY = 'lms_documents_data';

// Mock AI analysis function
const analyzeUserProgress = (syllabusData: any, documentsData: any) => {
  const analysisResult = {
    overallProgress: Math.floor(Math.random() * 100),
    strengthAreas: [] as any[],
    weaknessAreas: [] as any[],
    recommendations: [] as any[],
    nextSteps: [] as any[],
    estimatedCompletionWeeks: Math.floor(Math.random() * 12) + 4,
  };

  // Simulate AI analysis based on uploaded documents and syllabus
  const subjects = syllabusData?.subjects || [];
  const documents = documentsData || [];

  // Analyze strengths and weaknesses
  subjects.forEach((subject: any, index: number) => {
    const hasRelatedDocs = documents.some((doc: any) => 
      doc.name.toLowerCase().includes(subject.name.toLowerCase().split(' ')[0])
    );
    
    if (hasRelatedDocs || Math.random() > 0.6) {
      analysisResult.strengthAreas.push({
        subject: subject.name,
        score: Math.floor(Math.random() * 30) + 70,
        reason: hasRelatedDocs 
          ? 'Strong foundation based on uploaded materials'
          : 'Good theoretical understanding'
      });
    } else {
      analysisResult.weaknessAreas.push({
        subject: subject.name,
        score: Math.floor(Math.random() * 40) + 30,
        reason: 'Needs more practice and study materials'
      });
    }
  });

  return analysisResult;
};

// Generate personalized learning path
const generateLearningPath = (syllabusData: any, analysis: any) => {
  const path = {
    phases: [
      {
        id: 1,
        title: 'Foundation Building',
        duration: '2-3 weeks',
        description: 'Strengthen core concepts and fill knowledge gaps',
        tasks: [] as any[],
        priority: 'high',
        completed: false,
      },
      {
        id: 2,
        title: 'Skill Development',
        duration: '4-6 weeks',
        description: 'Build practical skills through hands-on projects',
        tasks: [] as any[],
        priority: 'medium',
        completed: false,
      },
      {
        id: 3,
        title: 'Advanced Topics',
        duration: '3-4 weeks',
        description: 'Master advanced concepts and specialized areas',
        tasks: [] as any[],
        priority: 'low',
        completed: false,
      },
      {
        id: 4,
        title: 'Assessment Preparation',
        duration: '2-3 weeks',
        description: 'Prepare for exams and final assessments',
        tasks: [] as any[],
        priority: 'high',
        completed: false,
      },
    ],
    milestones: [
      {
        id: 1,
        title: 'Complete Foundation Phase',
        description: 'Master all fundamental concepts',
        targetDate: '2025-10-15',
        completed: false,
      },
      {
        id: 2,
        title: 'First Project Completion',
        description: 'Complete your first major project',
        targetDate: '2025-11-01',
        completed: false,
      },
      {
        id: 3,
        title: 'Mid-term Readiness',
        description: 'Ready for mid-term examinations',
        targetDate: '2025-11-15',
        completed: false,
      },
      {
        id: 4,
        title: 'Final Assessment Ready',
        description: 'Prepared for final evaluations',
        targetDate: '2025-12-10',
        completed: false,
      },
    ],
  };

  // Generate tasks based on weakness areas
  analysis.weaknessAreas.forEach((weakness: any, index: number) => {
    const phaseIndex = index % path.phases.length;
    path.phases[phaseIndex].tasks.push({
      id: `task_${Date.now()}_${index}`,
      title: `Study ${weakness.subject}`,
      description: `Focus on improving ${weakness.subject} concepts`,
      type: 'study',
      estimatedHours: Math.floor(Math.random() * 10) + 5,
      priority: weakness.score < 40 ? 'high' : 'medium',
      completed: false,
      resources: [
        `${weakness.subject} - Study Guide.pdf`,
        `${weakness.subject} - Practice Problems.pdf`,
        `${weakness.subject} - Video Lectures.mp4`,
      ],
    });
  });

  // Add practical tasks
  const practicalTasks = [
    {
      title: 'Complete Coding Assignment',
      description: 'Build a practical project to reinforce learning',
      type: 'project',
      estimatedHours: 15,
    },
    {
      title: 'Take Practice Quiz',
      description: 'Test your understanding with practice questions',
      type: 'assessment',
      estimatedHours: 2,
    },
    {
      title: 'Join Study Group',
      description: 'Collaborate with peers on difficult topics',
      type: 'collaboration',
      estimatedHours: 3,
    },
    {
      title: 'Review Past Exams',
      description: 'Analyze previous exam patterns and questions',
      type: 'review',
      estimatedHours: 4,
    },
  ];

  practicalTasks.forEach((task, index) => {
    const phaseIndex = (index + 1) % path.phases.length;
    path.phases[phaseIndex].tasks.push({
      id: `practical_${Date.now()}_${index}`,
      ...task,
      priority: 'medium',
      completed: false,
      resources: [`${task.title} - Guide.pdf`],
    });
  });

  return path;
};

// Get or initialize learning path data
const getLearningPathFromStorage = () => {
  const stored = sessionStorage.getItem(LEARNING_PATH_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
};

const saveLearningPathToStorage = (data: any) => {
  sessionStorage.setItem(LEARNING_PATH_STORAGE_KEY, JSON.stringify(data));
};

// ----------------------------------------------------------------------

export default function LearningPath() {
  const [learningPath, setLearningPath] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [expandedPhase, setExpandedPhase] = useState<number | false>(false);
  const [loading, setLoading] = useState(true);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);

  useEffect(() => {
    // Initialize learning path
    const initializeLearningPath = () => {
      setLoading(true);
      
      // Get data from session storage
      const storedPath = getLearningPathFromStorage();
      const syllabusData = JSON.parse(sessionStorage.getItem(SYLLABUS_STORAGE_KEY) || '{}');
      const documentsData = JSON.parse(sessionStorage.getItem(DOCUMENTS_STORAGE_KEY) || '[]');

      if (storedPath) {
        setLearningPath(storedPath.path);
        setAnalysis(storedPath.analysis);
      } else {
        // Generate new learning path
        const newAnalysis = analyzeUserProgress(syllabusData, documentsData);
        const newPath = generateLearningPath(syllabusData, newAnalysis);
        
        const learningPathData = {
          analysis: newAnalysis,
          path: newPath,
          createdAt: new Date().toISOString(),
        };

        setAnalysis(newAnalysis);
        setLearningPath(newPath);
        saveLearningPathToStorage(learningPathData);
      }
      
      setLoading(false);
    };

    initializeLearningPath();
  }, []);

  const handlePhaseChange = (phaseId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPhase(isExpanded ? phaseId : false);
  };

  const handleTaskComplete = (phaseId: number, taskId: string) => {
    if (!learningPath) return;

    const updatedPath = { ...learningPath };
    const phase = updatedPath.phases.find((p: any) => p.id === phaseId);
    if (phase) {
      const task = phase.tasks.find((t: any) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        
        // Check if all tasks in phase are completed
        const allTasksCompleted = phase.tasks.every((t: any) => t.completed);
        phase.completed = allTasksCompleted;
        
        setLearningPath(updatedPath);
        saveLearningPathToStorage({ analysis, path: updatedPath, createdAt: new Date().toISOString() });
      }
    }
  };

  const handleRegeneratePath = () => {
    setLoading(true);
    
    // Clear existing data and regenerate
    sessionStorage.removeItem(LEARNING_PATH_STORAGE_KEY);
    
    setTimeout(() => {
      const syllabusData = JSON.parse(sessionStorage.getItem(SYLLABUS_STORAGE_KEY) || '{}');
      const documentsData = JSON.parse(sessionStorage.getItem(DOCUMENTS_STORAGE_KEY) || '[]');
      
      const newAnalysis = analyzeUserProgress(syllabusData, documentsData);
      const newPath = generateLearningPath(syllabusData, newAnalysis);
      
      const learningPathData = {
        analysis: newAnalysis,
        path: newPath,
        createdAt: new Date().toISOString(),
      };

      setAnalysis(newAnalysis);
      setLearningPath(newPath);
      saveLearningPathToStorage(learningPathData);
      setLoading(false);
    }, 2000);
  };

  const handleExportPlan = () => {
    if (!learningPath || !analysis) {
      alert('No learning path data to export!');
      return;
    }

    const exportData = {
      title: 'Personalized Learning Path',
      generatedOn: new Date().toLocaleDateString(),
      overallProgress: analysis.overallProgress,
      estimatedWeeks: analysis.estimatedCompletionWeeks,
      strengthAreas: analysis.strengthAreas,
      focusAreas: analysis.weaknessAreas,
      phases: learningPath.phases,
      milestones: learningPath.milestones,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning-path-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleViewDocumentation = (resourceName: string) => {
    // Redirect to external documentation
    const documentationUrls: { [key: string]: string } = {
      'Study Guide': 'https://example.com/study-guides',
      'Practice Problems': 'https://example.com/practice',
      'Video Lectures': 'https://example.com/videos',
      'Code Examples': 'https://example.com/code-examples',
      'Research Papers': 'https://example.com/research',
      'default': 'https://example.com/documentation'
    };

    const baseUrl = Object.keys(documentationUrls).find(key => 
      resourceName.toLowerCase().includes(key.toLowerCase())
    );
    
    const url = baseUrl ? documentationUrls[baseUrl] : documentationUrls.default;
    window.open(url, '_blank');
  };

  const handleStartStudySession = () => {
    alert('Study session timer started! Focus on your current tasks.');
    // In a real app, this could start a pomodoro timer or study session tracker
  };

  const handleJoinStudyGroup = () => {
    alert('Connecting you to study groups... This feature will be available soon!');
    // In a real app, this could redirect to a study group matching system
  };

  const handleViewProgress = () => {
    if (!learningPath) return;
    setProgressDialogOpen(true);
  };

  const getProgressData = () => {
    if (!learningPath) return null;
    
    const totalTasks = learningPath.phases.reduce((sum: number, phase: any) => sum + phase.tasks.length, 0);
    const completedTasks = learningPath.phases.reduce((sum: number, phase: any) => 
      sum + phase.tasks.filter((task: any) => task.completed).length, 0
    );
    
    const phaseProgress = learningPath.phases.map((phase: any) => {
      const phaseTotalTasks = phase.tasks.length;
      const phaseCompletedTasks = phase.tasks.filter((task: any) => task.completed).length;
      return {
        name: phase.title,
        total: phaseTotalTasks,
        completed: phaseCompletedTasks,
        percentage: Math.round((phaseCompletedTasks / phaseTotalTasks) * 100),
      };
    });

    const completedMilestones = learningPath.milestones.filter((milestone: any) => milestone.completed).length;
    
    return {
      totalTasks,
      completedTasks,
      remainingTasks: totalTasks - completedTasks,
      overallPercentage: Math.round((completedTasks / totalTasks) * 100),
      phaseProgress,
      totalMilestones: learningPath.milestones.length,
      completedMilestones,
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'study': return 'solar:bed-bold';
      case 'project': return 'solar:code-bold';
      case 'assessment': return 'solar:document-bold';
      case 'collaboration': return 'solar:users-group-rounded-bold';
      case 'review': return 'solar:eye-bold';
      default: return 'solar:document-bold';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Analyzing your learning progress...
          </Typography>
          <LinearProgress sx={{ width: '100%', maxWidth: 400, mx: 'auto' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Creating your personalized learning path based on syllabus and uploaded documents
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Personalized Learning Path
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          AI-powered study plan tailored to your progress and uploaded materials
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:eye-bold" />}
            onClick={handleRegeneratePath}
          >
            Regenerate Path
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:download-bold" />}
            onClick={handleExportPlan}
          >
            Export Plan
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:document-bold" />}
            onClick={handleViewProgress}
          >
            View Progress
          </Button>
        </Stack>
      </Box>

      {analysis && (
        <>
          {/* Progress Overview */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Learning Progress Overview
            </Typography>
            <Stack direction="row" spacing={4} flexWrap="wrap">
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Overall Progress
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={analysis.overallProgress}
                    sx={{ width: 200, mr: 2 }}
                  />
                  <Typography variant="h6">{analysis.overallProgress}%</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Estimated Completion
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {analysis.estimatedCompletionWeeks} weeks
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Strong Areas
                </Typography>
                <Typography variant="h6" color="success.main">
                  {analysis.strengthAreas.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Focus Areas
                </Typography>
                <Typography variant="h6" color="warning.main">
                  {analysis.weaknessAreas.length}
                </Typography>
              </Box>
            </Stack>
          </Card>

          {/* Strengths and Weaknesses */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Card sx={{ flex: 1, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                <Iconify icon="solar:flag-bold" sx={{ mr: 1 }} />
                Strength Areas
              </Typography>
              <Stack spacing={2}>
                {analysis.strengthAreas.map((strength: any, index: number) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2">{strength.subject}</Typography>
                      <Chip label={`${strength.score}%`} color="success" size="small" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {strength.reason}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>

            <Card sx={{ flex: 1, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
                <Iconify icon="solar:heart-bold" sx={{ mr: 1 }} />
                Focus Areas
              </Typography>
              <Stack spacing={2}>
                {analysis.weaknessAreas.map((weakness: any, index: number) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2">{weakness.subject}</Typography>
                      <Chip label={`${weakness.score}%`} color="warning" size="small" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {weakness.reason}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Stack>
        </>
      )}

      {/* Learning Phases */}
      {learningPath && (
        <>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Learning Phases
          </Typography>

          {learningPath.phases.map((phase: any) => (
            <Accordion
              key={phase.id}
              expanded={expandedPhase === phase.id}
              onChange={handlePhaseChange(phase.id)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                sx={{ '& .MuiAccordionSummary-content': { my: 2 } }}
              >
                <Box sx={{ width: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">{phase.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {phase.duration} • {phase.description}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={phase.priority}
                        size="small"
                        color={getPriorityColor(phase.priority)}
                        variant="outlined"
                      />
                      <Chip
                        label={phase.completed ? 'Completed' : 'In Progress'}
                        size="small"
                        color={phase.completed ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        label={`${phase.tasks.filter((t: any) => t.completed).length}/${phase.tasks.length} Tasks`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Stack>
                  </Stack>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {/* Phase Tasks */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Tasks & Activities
                    </Typography>
                    <List sx={{ py: 0 }}>
                      {phase.tasks.map((task: any, index: number) => (
                        <ListItem
                          key={task.id}
                          divider={index < phase.tasks.length - 1}
                          sx={{ py: 1.5 }}
                        >
                          <ListItemButton
                            onClick={() => handleTaskComplete(phase.id, task.id)}
                            sx={{ borderRadius: 1 }}
                          >
                            <ListItemIcon>
                              <Avatar
                                sx={{
                                  bgcolor: task.completed ? 'success.main' : 'grey.300',
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                <Iconify
                                  icon={task.completed ? 'solar:check-circle-bold' : getTaskIcon(task.type)}
                                  width={24}
                                  sx={{ color: task.completed ? 'white' : 'text.primary' }}
                                />
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      textDecoration: task.completed ? 'line-through' : 'none',
                                      opacity: task.completed ? 0.7 : 1,
                                    }}
                                  >
                                    {task.title}
                                  </Typography>
                                  <Chip
                                    label={task.type}
                                    size="small"
                                    variant="outlined"
                                  />
                                  <Chip
                                    label={`${task.estimatedHours}h`}
                                    size="small"
                                    color="info"
                                    variant="outlined"
                                  />
                                </Stack>
                              }
                              secondary={task.description}
                            />
                            <IconButton
                              size="small"
                              color={task.completed ? 'success' : 'default'}
                            >
                              <Iconify
                                icon={task.completed ? 'solar:check-circle-bold' : 'solar:document-bold'}
                                width={20}
                              />
                            </IconButton>
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  {/* Phase Resources */}
                  {phase.resources && phase.resources.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Study Resources
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {phase.resources.map((resource: string, index: number) => (
                          <Chip
                            key={index}
                            label={resource}
                            onClick={() => handleViewDocumentation(resource)}
                            icon={<Iconify icon="solar:document-bold" width={16} />}
                            variant="outlined"
                            sx={{ cursor: 'pointer' }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Milestones */}
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <Iconify icon="solar:flag-bold" sx={{ mr: 1 }} />
              Learning Milestones
            </Typography>
            <Stack spacing={2}>
              {learningPath.milestones.map((milestone: any, index: number) => (
                <Box key={milestone.id}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle1">{milestone.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {milestone.description}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={new Date(milestone.targetDate).toLocaleDateString()}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={milestone.completed ? 'Achieved' : 'Pending'}
                        size="small"
                        color={milestone.completed ? 'success' : 'default'}
                      />
                    </Stack>
                  </Stack>
                  {index < learningPath.milestones.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Stack>
          </Card>

          {/* AI Recommendations */}
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              AI Recommendations
            </Typography>
            <Typography variant="body2">
              Based on your uploaded documents and syllabus analysis, focus on strengthening your weak areas
              while maintaining progress in your strong subjects. Consider forming study groups for collaborative
              learning and practice coding assignments regularly to improve practical skills.
            </Typography>
          </Alert>

          {/* Action Buttons */}
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
              <Button
                variant="contained"
                startIcon={<Iconify icon="solar:clock-circle-bold" />}
                onClick={handleStartStudySession}
                color="primary"
              >
                Start Study Session
              </Button>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="solar:users-group-rounded-bold" />}
                onClick={handleJoinStudyGroup}
              >
                Join Study Group
              </Button>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="solar:document-bold" />}
                onClick={() => handleViewDocumentation('Learning Resources')}
              >
                View All Resources
              </Button>
            </Stack>
          </Card>
        </>
      )}

      {/* Progress Dialog */}
      <Dialog 
        open={progressDialogOpen} 
        onClose={() => setProgressDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:document-bold" />
            <Typography variant="h6">Learning Progress Summary</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {(() => {
            const progressData = getProgressData();
            if (!progressData) return null;
            
            return (
              <Stack spacing={3} sx={{ mt: 1 }}>
                {/* Overall Progress */}
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Overall Progress</Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="body2">Total Tasks</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {progressData.completedTasks} / {progressData.totalTasks}
                        </Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={progressData.overallPercentage} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {progressData.overallPercentage}% Complete ({progressData.remainingTasks} remaining)
                      </Typography>
                    </Box>
                    
                    <Stack direction="row" spacing={3}>
                      <Chip 
                        label={`${progressData.completedMilestones}/${progressData.totalMilestones} Milestones`}
                        color="primary"
                        variant="outlined"
                      />
                      <Chip 
                        label={`${analysis?.estimatedCompletionWeeks || 0} weeks estimated`}
                        color="info"
                        variant="outlined"
                      />
                    </Stack>
                  </Stack>
                </Card>

                {/* Phase Progress */}
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Progress by Phase</Typography>
                  <Stack spacing={2}>
                    {progressData.phaseProgress.map((phase: any, index: number) => (
                      <Box key={index}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2">{phase.name}</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {phase.completed} / {phase.total} tasks
                          </Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={phase.percentage} 
                          sx={{ height: 6, borderRadius: 3 }}
                          color={phase.percentage === 100 ? 'success' : 'primary'}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          {phase.percentage}% Complete
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>

                {/* Achievements */}
                {analysis && (
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Your Achievements</Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="success.main" sx={{ mb: 1 }}>
                          Strong Areas
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {analysis.strengthAreas.map((strength: any, index: number) => (
                            <Chip 
                              key={index}
                              label={`${strength.subject} (${strength.score}%)`}
                              color="success"
                              size="small"
                            />
                          ))}
                        </Stack>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" color="warning.main" sx={{ mb: 1 }}>
                          Focus Areas
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {analysis.weaknessAreas.map((weakness: any, index: number) => (
                            <Chip 
                              key={index}
                              label={`${weakness.subject} (${weakness.score}%)`}
                              color="warning"
                              size="small"
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </Card>
                )}
              </Stack>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProgressDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={handleExportPlan}
            startIcon={<Iconify icon="solar:download-bold" />}
          >
            Export Progress
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
