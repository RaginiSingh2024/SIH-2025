import { useState } from 'react';

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
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// Session storage utilities
const SYLLABUS_STORAGE_KEY = 'lms_syllabus_data';
const PROGRESS_STORAGE_KEY = 'lms_syllabus_progress';

// Enhanced mock syllabus data with more subjects and comprehensive content
const generateSyllabusData = () => ({
  course: 'Computer Science & Engineering',
  batch: 'CSE Batch 2024-2028',
  semester: 'Semester 7 - Autumn 2025',
  academicYear: '2025-26',
  coordinator: 'Dr. Rajesh Sharma',
  totalCredits: 22,
  subjects: [
    {
      id: 1,
      name: 'Machine Learning & Artificial Intelligence',
      code: 'CS701',
      credits: 4,
      instructor: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      officeHours: 'Mon, Wed 2:00-4:00 PM',
      description: 'Comprehensive study of machine learning algorithms, deep learning, and AI applications.',
      prerequisites: ['Data Structures', 'Statistics', 'Linear Algebra'],
      topics: [
        'Introduction to Machine Learning & AI History',
        'Supervised Learning Algorithms (Linear/Logistic Regression)',
        'Decision Trees and Random Forest',
        'Support Vector Machines (SVM)',
        'Unsupervised Learning (K-Means, Hierarchical Clustering)',
        'Neural Networks and Backpropagation',
        'Deep Learning and Convolutional Neural Networks',
        'Recurrent Neural Networks (RNN, LSTM)',
        'Natural Language Processing Fundamentals',
        'Computer Vision and Image Recognition',
        'Reinforcement Learning Basics',
        'Model Evaluation, Validation & Hyperparameter Tuning',
      ],
      materials: [
        { name: 'ML Fundamentals - Complete Lecture Notes.pdf', type: 'pdf', size: '4.8 MB', uploadDate: '2025-09-10', downloaded: false },
        { name: 'Python ML Libraries - Comprehensive Guide.pdf', type: 'pdf', size: '3.2 MB', uploadDate: '2025-09-10', downloaded: false },
        { name: 'ML Algorithms Implementation - Code Examples.zip', type: 'zip', size: '25.7 MB', uploadDate: '2025-09-08', downloaded: false },
        { name: 'Assignment 1 - Linear & Logistic Regression.pdf', type: 'pdf', size: '1.2 MB', uploadDate: '2025-09-05', downloaded: false },
        { name: 'Assignment 2 - Neural Networks from Scratch.pdf', type: 'pdf', size: '1.8 MB', uploadDate: '2025-09-03', downloaded: false },
        { name: 'Deep Learning Video Lecture Series.mp4', type: 'video', size: '456 MB', uploadDate: '2025-09-03', downloaded: false },
        { name: 'CNN Architecture Visualization.pptx', type: 'ppt', size: '8.4 MB', uploadDate: '2025-09-01', downloaded: false },
        { name: 'Kaggle Competition Dataset - House Prices.csv', type: 'file', size: '2.1 MB', uploadDate: '2025-08-28', downloaded: false },
      ],
      assignments: [
        { name: 'Assignment 1: Linear Regression', dueDate: '2025-09-25', marks: 20 },
        { name: 'Assignment 2: Neural Networks', dueDate: '2025-10-15', marks: 25 },
        { name: 'Final Project: ML Application', dueDate: '2025-11-20', marks: 35 },
      ],
      examSchedule: [
        { type: 'Mid-Term', date: '2025-10-10', duration: '2 hours', marks: 30 },
        { type: 'Final Exam', date: '2025-12-05', duration: '3 hours', marks: 50 },
      ],
    },
    {
      id: 2,
      name: 'Distributed Systems & Cloud Computing',
      code: 'CS702',
      credits: 3,
      instructor: 'Prof. Michael Chen',
      email: 'michael.chen@university.edu',
      officeHours: 'Tue, Thu 10:00-12:00 PM',
      description: 'Study of distributed computing principles, cloud architectures, and scalable systems.',
      prerequisites: ['Computer Networks', 'Operating Systems'],
      topics: [
        'Introduction to Distributed Systems',
        'System Models and Distributed Architectures',
        'Communication Paradigms (RPC, Message Passing)',
        'Synchronization and Logical Clocks',
        'Distributed Mutual Exclusion Algorithms',
        'Consistency Models and CAP Theorem',
        'Replication and Consensus Protocols',
        'Fault Tolerance and Byzantine Fault Tolerance',
        'Load Balancing and Scalability',
        'Microservices Architecture',
        'Container Orchestration (Docker, Kubernetes)',
        'Cloud Computing Models (IaaS, PaaS, SaaS)',
        'MapReduce and Big Data Processing',
        'Blockchain and Distributed Ledgers',
      ],
      materials: [
        { name: 'Distributed Systems - Theory and Practice.pdf', type: 'pdf', size: '6.4 MB', uploadDate: '2025-09-09', downloaded: false },
        { name: 'Cloud Computing Architecture Guide.pdf', type: 'pdf', size: '4.1 MB', uploadDate: '2025-09-09', downloaded: false },
        { name: 'Docker & Kubernetes Lab Exercises.zip', type: 'zip', size: '18.3 MB', uploadDate: '2025-09-07', downloaded: false },
        { name: 'Consensus Algorithms Research Papers.pdf', type: 'pdf', size: '3.8 MB', uploadDate: '2025-09-04', downloaded: false },
        { name: 'Microservices Design Patterns.pptx', type: 'ppt', size: '5.7 MB', uploadDate: '2025-09-02', downloaded: false },
        { name: 'AWS Cloud Architecture Diagrams.pdf', type: 'pdf', size: '2.9 MB', uploadDate: '2025-08-30', downloaded: false },
        { name: 'MapReduce Implementation Tutorial.mp4', type: 'video', size: '324 MB', uploadDate: '2025-08-28', downloaded: false },
      ],
      assignments: [
        { name: 'Lab 1: Socket Programming', dueDate: '2025-09-30', marks: 15 },
        { name: 'Lab 2: Distributed Chat System', dueDate: '2025-10-20', marks: 20 },
        { name: 'Project: Cloud-based Web Application', dueDate: '2025-11-25', marks: 30 },
      ],
      examSchedule: [
        { type: 'Mid-Term', date: '2025-10-12', duration: '2 hours', marks: 35 },
        { type: 'Final Exam', date: '2025-12-07', duration: '3 hours', marks: 50 },
      ],
    },
    {
      id: 3,
      name: 'Advanced Software Engineering',
      code: 'CS703',
      credits: 3,
      instructor: 'Dr. Alex Kumar',
      email: 'alex.kumar@university.edu',
      officeHours: 'Mon, Fri 1:00-3:00 PM',
      description: 'Advanced concepts in software development, architecture patterns, and project management.',
      prerequisites: ['Software Engineering Fundamentals', 'Object-Oriented Programming'],
      topics: [
        'Advanced Software Development Life Cycle Models',
        'Requirements Engineering and Analysis',
        'Software Architecture and Design Patterns',
        'Microservices vs Monolithic Architecture',
        'Test-Driven Development (TDD)',
        'Behavior-Driven Development (BDD)',
        'Continuous Integration/Continuous Deployment (CI/CD)',
        'Code Quality and Static Analysis',
        'Software Metrics and Performance Analysis',
        'Agile and Scrum Methodologies',
        'DevOps Culture and Practices',
        'Software Security and Secure Coding',
        'Legacy Code Refactoring',
        'Software Maintenance and Evolution',
      ],
      materials: [
        { name: 'Advanced Software Engineering Textbook.pdf', type: 'pdf', size: '12.7 MB', uploadDate: '2025-09-11', downloaded: false },
        { name: 'Design Patterns Implementation Guide.pdf', type: 'pdf', size: '5.3 MB', uploadDate: '2025-09-10', downloaded: false },
        { name: 'Clean Code Examples and Best Practices.zip', type: 'zip', size: '15.8 MB', uploadDate: '2025-09-06', downloaded: false },
        { name: 'Agile vs DevOps Methodology Comparison.pptx', type: 'ppt', size: '6.2 MB', uploadDate: '2025-09-02', downloaded: false },
        { name: 'CI/CD Pipeline Setup Tutorial.mp4', type: 'video', size: '287 MB', uploadDate: '2025-08-31', downloaded: false },
        { name: 'Software Testing Strategies Handbook.pdf', type: 'pdf', size: '3.9 MB', uploadDate: '2025-08-29', downloaded: false },
        { name: 'Refactoring Legacy Code - Case Studies.pdf', type: 'pdf', size: '4.1 MB', uploadDate: '2025-08-26', downloaded: false },
      ],
      assignments: [
        { name: 'Assignment 1: Design Pattern Implementation', dueDate: '2025-10-05', marks: 20 },
        { name: 'Assignment 2: TDD Practice Project', dueDate: '2025-10-25', marks: 25 },
        { name: 'Group Project: Software Architecture Design', dueDate: '2025-11-30', marks: 35 },
      ],
      examSchedule: [
        { type: 'Mid-Term', date: '2025-10-14', duration: '2 hours', marks: 30 },
        { type: 'Final Exam', date: '2025-12-09', duration: '3 hours', marks: 45 },
      ],
    },
    {
      id: 4,
      name: 'Advanced Database Management Systems',
      code: 'CS704',
      credits: 4,
      instructor: 'Dr. Emily Wilson',
      email: 'emily.wilson@university.edu',
      officeHours: 'Wed, Fri 11:00 AM-1:00 PM',
      description: 'Advanced database concepts including NoSQL, distributed databases, and big data technologies.',
      prerequisites: ['Database Management Systems', 'Data Structures'],
      topics: [
        'Advanced Relational Database Design',
        'Query Optimization and Indexing Strategies',
        'Transaction Management and ACID Properties',
        'Concurrency Control and Locking Mechanisms',
        'Database Recovery and Backup Strategies',
        'NoSQL Database Types (Document, Key-Value, Graph)',
        'MongoDB and Document-based Databases',
        'Cassandra and Column-family Databases',
        'Neo4j and Graph Databases',
        'Data Warehousing and OLAP Systems',
        'ETL Processes and Data Pipeline Design',
        'Big Data Technologies (Hadoop, Spark)',
        'Database Security and Privacy',
        'Database Performance Tuning',
      ],
      materials: [
        { name: 'Advanced Database Systems - Complete Guide.pdf', type: 'pdf', size: '8.9 MB', uploadDate: '2025-09-10', downloaded: false },
        { name: 'NoSQL Database Comparison Study.pdf', type: 'pdf', size: '4.6 MB', uploadDate: '2025-09-08', downloaded: false },
        { name: 'MongoDB and Neo4j Lab Exercises.zip', type: 'zip', size: '22.4 MB', uploadDate: '2025-09-05', downloaded: false },
        { name: 'SQL Performance Optimization Techniques.pdf', type: 'pdf', size: '3.7 MB', uploadDate: '2025-09-03', downloaded: false },
        { name: 'Big Data Processing with Spark.mp4', type: 'video', size: '412 MB', uploadDate: '2025-09-01', downloaded: false },
        { name: 'Data Warehousing Architecture.pptx', type: 'ppt', size: '7.8 MB', uploadDate: '2025-08-30', downloaded: false },
        { name: 'Database Security Best Practices.pdf', type: 'pdf', size: '2.8 MB', uploadDate: '2025-08-27', downloaded: false },
        { name: 'Sample Database Scripts.sql', type: 'file', size: '456 KB', uploadDate: '2025-08-25', downloaded: false },
      ],
      assignments: [
        { name: 'Lab 1: Advanced SQL Queries', dueDate: '2025-09-28', marks: 15 },
        { name: 'Lab 2: NoSQL Database Design', dueDate: '2025-10-18', marks: 20 },
        { name: 'Project: Data Warehouse Implementation', dueDate: '2025-11-22', marks: 30 },
      ],
      examSchedule: [
        { type: 'Mid-Term', date: '2025-10-16', duration: '2.5 hours', marks: 35 },
        { type: 'Final Exam', date: '2025-12-11', duration: '3 hours', marks: 50 },
      ],
    },
    {
      id: 5,
      name: 'Cybersecurity & Ethical Hacking',
      code: 'CS705',
      credits: 3,
      instructor: 'Prof. David Rodriguez',
      email: 'david.rodriguez@university.edu',
      officeHours: 'Tue, Thu 3:00-5:00 PM',
      description: 'Comprehensive study of cybersecurity principles, threat analysis, and ethical hacking techniques.',
      prerequisites: ['Computer Networks', 'Operating Systems'],
      topics: [
        'Introduction to Cybersecurity Landscape',
        'Threat Modeling and Risk Assessment',
        'Cryptography Fundamentals (Symmetric/Asymmetric)',
        'Network Security and Firewalls',
        'Web Application Security (OWASP Top 10)',
        'Penetration Testing Methodologies',
        'Social Engineering and Human Factors',
        'Malware Analysis and Reverse Engineering',
        'Incident Response and Digital Forensics',
        'Security in Cloud Computing',
        'IoT Security Challenges',
        'Legal and Ethical Aspects of Cybersecurity',
      ],
      materials: [
        { name: 'Cybersecurity Fundamentals Handbook.pdf', type: 'pdf', size: '9.2 MB', uploadDate: '2025-09-09', downloaded: false },
        { name: 'Ethical Hacking Tools and Techniques.pdf', type: 'pdf', size: '6.8 MB', uploadDate: '2025-09-07', downloaded: false },
        { name: 'Penetration Testing Lab Setup.zip', type: 'zip', size: '34.7 MB', uploadDate: '2025-09-04', downloaded: false },
        { name: 'Cryptography Algorithms Implementation.pdf', type: 'pdf', size: '4.3 MB', uploadDate: '2025-09-02', downloaded: false },
        { name: 'Web Security Testing Video Tutorial.mp4', type: 'video', size: '523 MB', uploadDate: '2025-08-31', downloaded: false },
        { name: 'Incident Response Playbook.pdf', type: 'pdf', size: '3.1 MB', uploadDate: '2025-08-28', downloaded: false },
        { name: 'Security Audit Checklist.pdf', type: 'pdf', size: '1.9 MB', uploadDate: '2025-08-26', downloaded: false },
      ],
      assignments: [
        { name: 'Lab 1: Network Security Scanning', dueDate: '2025-10-01', marks: 20 },
        { name: 'Lab 2: Web Application Penetration Testing', dueDate: '2025-10-22', marks: 25 },
        { name: 'Project: Security Audit Report', dueDate: '2025-11-28', marks: 30 },
      ],
      examSchedule: [
        { type: 'Mid-Term', date: '2025-10-18', duration: '2 hours', marks: 30 },
        { type: 'Final Exam', date: '2025-12-13', duration: '3 hours', marks: 45 },
      ],
    },
    {
      id: 6,
      name: 'Mobile Application Development',
      code: 'CS706',
      credits: 3,
      instructor: 'Dr. Lisa Thompson',
      email: 'lisa.thompson@university.edu',
      officeHours: 'Mon, Wed 4:00-6:00 PM',
      description: 'Cross-platform mobile app development using modern frameworks and native technologies.',
      prerequisites: ['Programming Fundamentals', 'Web Development'],
      topics: [
        'Mobile Development Landscape Overview',
        'Native vs Cross-platform Development',
        'React Native Fundamentals',
        'Flutter and Dart Programming',
        'iOS Development with Swift',
        'Android Development with Kotlin',
        'Mobile UI/UX Design Principles',
        'State Management in Mobile Apps',
        'Mobile Database Integration',
        'Push Notifications and Background Services',
        'Mobile App Testing Strategies',
        'App Store Deployment and Publishing',
      ],
      materials: [
        { name: 'Mobile Development Complete Guide.pdf', type: 'pdf', size: '11.3 MB', uploadDate: '2025-09-08', downloaded: false },
        { name: 'React Native Project Templates.zip', type: 'zip', size: '28.9 MB', uploadDate: '2025-09-06', downloaded: false },
        { name: 'Flutter Widget Catalog.pdf', type: 'pdf', size: '5.7 MB', uploadDate: '2025-09-03', downloaded: false },
        { name: 'Mobile UI Design Patterns.pptx', type: 'ppt', size: '9.1 MB', uploadDate: '2025-09-01', downloaded: false },
        { name: 'App Development Workflow Tutorial.mp4', type: 'video', size: '367 MB', uploadDate: '2025-08-29', downloaded: false },
        { name: 'Mobile Testing Framework Setup.pdf', type: 'pdf', size: '3.4 MB', uploadDate: '2025-08-27', downloaded: false },
      ],
      assignments: [
        { name: 'Assignment 1: Basic Mobile App UI', dueDate: '2025-10-03', marks: 20 },
        { name: 'Assignment 2: State Management Implementation', dueDate: '2025-10-24', marks: 25 },
        { name: 'Final Project: Complete Mobile Application', dueDate: '2025-11-30', marks: 35 },
      ],
      examSchedule: [
        { type: 'Mid-Term', date: '2025-10-20', duration: '2 hours', marks: 30 },
        { type: 'Final Exam', date: '2025-12-15', duration: '3 hours', marks: 40 },
      ],
    },
  ],
});

// Initialize or get syllabus data from session storage
const getSyllabusFromStorage = () => {
  const stored = sessionStorage.getItem(SYLLABUS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const newData = generateSyllabusData();
  sessionStorage.setItem(SYLLABUS_STORAGE_KEY, JSON.stringify(newData));
  return newData;
};

// Get download progress from session storage
const getProgressFromStorage = () => {
  const stored = sessionStorage.getItem(PROGRESS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

// Save download progress to session storage
const saveProgressToStorage = (progress: any) => {
  sessionStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'solar:document-bold';
    case 'zip':
      return 'solar:code-bold';
    case 'video':
      return 'solar:eye-bold';
    case 'ppt':
      return 'solar:pen-bold';
    default:
      return 'solar:pen-bold';
  }
};

const getFileColor = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'error';
    case 'zip':
      return 'warning';
    case 'video':
      return 'info';
    case 'ppt':
      return 'success';
    default:
      return 'default';
  }
};

// ----------------------------------------------------------------------

export default function Syllabus() {
  const [syllabusData, setSyllabusData] = useState(() => getSyllabusFromStorage());
  const [downloadProgress, setDownloadProgress] = useState(() => getProgressFromStorage());
  const [expandedSubject, setExpandedSubject] = useState<number | false>(false);

  const handleSubjectChange = (subjectId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSubject(isExpanded ? subjectId : false);
  };

  const handleDownload = (fileName: string, subjectId: number) => {
    // Mock download functionality with session storage
    console.log(`Downloading: ${fileName}`);
    
    // Update download status
    const newProgress = { ...downloadProgress };
    if (!newProgress[subjectId]) {
      newProgress[subjectId] = {};
    }
    newProgress[subjectId][fileName] = true;
    
    setDownloadProgress(newProgress);
    saveProgressToStorage(newProgress);
    
    // Update syllabus data to mark as downloaded
    const updatedSyllabus = { ...syllabusData };
    const subject = updatedSyllabus.subjects.find((s: any) => s.id === subjectId);
    if (subject) {
      const material = subject.materials.find((m: any) => m.name === fileName);
      if (material) {
        material.downloaded = true;
      }
    }
    
    setSyllabusData(updatedSyllabus);
    sessionStorage.setItem(SYLLABUS_STORAGE_KEY, JSON.stringify(updatedSyllabus));
    
    // Simulate download delay
    setTimeout(() => {
      alert(`${fileName} has been downloaded successfully!`);
    }, 1000);
  };

  const handleContactInstructor = (email: string) => {
    window.open(`mailto:${email}?subject=Course Inquiry&body=Hello, I have a question about the course.`);
  };

  const getDownloadedCount = (subjectId: number) => {
    const subject = syllabusData.subjects.find((s: any) => s.id === subjectId);
    if (!subject) return 0;
    return subject.materials.filter((m: any) => m.downloaded).length;
  };

  const getTotalMaterials = (subjectId: number) => {
    const subject = syllabusData.subjects.find((s: any) => s.id === subjectId);
    return subject ? subject.materials.length : 0;
  };

  const getProgressPercentage = (subjectId: number) => {
    const downloaded = getDownloadedCount(subjectId);
    const total = getTotalMaterials(subjectId);
    return total > 0 ? Math.round((downloaded / total) * 100) : 0;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Course Syllabus & Study Materials
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip
            label={syllabusData.course}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={syllabusData.batch}
            color="secondary"
            variant="outlined"
          />
          <Chip
            label={syllabusData.semester}
            color="info"
            variant="outlined"
          />
        </Stack>
      </Box>

      {/* Overview Card */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Semester Overview
        </Typography>
        <Stack direction="row" spacing={4} flexWrap="wrap">
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Subjects
            </Typography>
            <Typography variant="h4" color="primary.main">
              {syllabusData.subjects.length}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Credits
            </Typography>
            <Typography variant="h4" color="secondary.main">
              {syllabusData.subjects.reduce((sum: number, subject: any) => sum + subject.credits, 0)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Study Materials
            </Typography>
            <Typography variant="h4" color="success.main">
              {syllabusData.subjects.reduce((sum: number, subject: any) => sum + subject.materials.length, 0)}
            </Typography>
          </Box>
        </Stack>
      </Card>

      {/* Subjects */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Subjects & Materials
      </Typography>

      {syllabusData.subjects.map((subject: any) => (
        <Accordion
          key={subject.id}
          expanded={expandedSubject === subject.id}
          onChange={handleSubjectChange(subject.id)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            sx={{ '& .MuiAccordionSummary-content': { my: 2 } }}
          >
            <Box sx={{ width: '100%' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">{subject.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {subject.code} • {subject.credits} Credits • {subject.instructor}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={`${subject.materials.length} Files`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip 
                    label={`${getDownloadedCount(subject.id)}/${getTotalMaterials(subject.id)} Downloaded`} 
                    size="small" 
                    color={getProgressPercentage(subject.id) === 100 ? 'success' : 'default'}
                    variant="outlined"
                  />
                  <Chip 
                    label={`${getProgressPercentage(subject.id)}% Complete`} 
                    size="small" 
                    color={getProgressPercentage(subject.id) > 75 ? 'success' : getProgressPercentage(subject.id) > 50 ? 'warning' : 'error'}
                    variant="outlined"
                  />
                </Stack>
              </Stack>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={3}>
              {/* Course Topics */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Course Topics
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {subject.topics.map((topic: string, index: number) => (
                    <Chip
                      key={index}
                      label={topic}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider />

              {/* Study Materials */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Study Materials
                </Typography>
                <Card variant="outlined">
                  <List sx={{ py: 0 }}>
                    {subject.materials.map((material: any, index: number) => (
                      <ListItem
                        key={index}
                        divider={index < subject.materials.length - 1}
                        sx={{ py: 1.5 }}
                      >
                        <ListItemButton
                          onClick={() => handleDownload(material.name, subject.id)}
                          sx={{ borderRadius: 1 }}
                        >
                          <ListItemIcon>
                            <Iconify
                              icon={getFileIcon(material.type)}
                              width={24}
                              sx={{ color: `${getFileColor(material.type)}.main` }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body2">{material.name}</Typography>
                                {material.downloaded && (
                                  <Chip label="Downloaded" size="small" color="success" />
                                )}
                              </Stack>
                            }
                            secondary={`${material.size} • Uploaded on ${new Date(material.uploadDate).toLocaleDateString()}`}
                          />
                          <IconButton 
                            size="small" 
                            color={material.downloaded ? "success" : "primary"}
                            disabled={material.downloaded}
                          >
                            <Iconify 
                              icon={material.downloaded ? "solar:check-circle-bold" : "solar:download-bold"} 
                              width={20} 
                            />
                          </IconButton>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Action Buttons */}
      <Card sx={{ p: 3, mt: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Need Help?
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:letter-bold" />}
            color="primary"
            onClick={() => handleContactInstructor(syllabusData.coordinator?.email || 'coordinator@university.edu')}
          >
            Contact Coordinator
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:download-bold" />}
            color="secondary"
          >
            Download Complete Syllabus
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:calendar-date-bold" />}
            color="info"
          >
            View Academic Calendar
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}
