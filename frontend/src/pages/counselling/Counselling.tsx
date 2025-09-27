import { useState, useEffect } from 'react';

import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Rating,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// Session storage keys
const USER_INTERESTS_STORAGE_KEY = 'lms_user_interests';
const COUNSELLING_SESSIONS_STORAGE_KEY = 'lms_counselling_sessions';

// Mock data for interests
const availableInterests = [
  'Computer Science', 'Data Science', 'Machine Learning', 'Web Development',
  'Mobile App Development', 'Cybersecurity', 'Cloud Computing', 'DevOps',
  'Artificial Intelligence', 'Blockchain', 'Game Development', 'UI/UX Design',
  'Digital Marketing', 'Business Analytics', 'Project Management', 'Entrepreneurship',
  'Finance', 'Psychology', 'Medicine', 'Engineering', 'Research', 'Teaching'
];

// Mock counselors data
const mockCounselors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Senior Career Counselor',
    specializations: ['Computer Science', 'Data Science', 'Machine Learning'],
    experience: '8 years',
    rating: 4.9,
    totalSessions: 156,
    availability: 'Available',
    bio: 'Specializes in tech career guidance with extensive industry experience.',
    avatar: '/assets/images/avatar/avatar_1.jpg',
    nextSlot: '2025-09-13 10:00 AM',
    languages: ['English', 'Spanish'],
    education: 'PhD in Computer Science, Stanford University'
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    title: 'Academic Advisor',
    specializations: ['Engineering', 'Research', 'AI'],
    experience: '12 years',
    rating: 4.8,
    totalSessions: 243,
    availability: 'Busy',
    bio: 'Academic counselor with focus on research and engineering careers.',
    avatar: '/assets/images/avatar/avatar_2.jpg',
    nextSlot: '2025-09-14 2:00 PM',
    languages: ['English', 'Mandarin'],
    education: 'PhD in Engineering, MIT'
  },
  {
    id: 3,
    name: 'Ms. Emily Rodriguez',
    title: 'Career Development Specialist',
    specializations: ['Business Analytics', 'Digital Marketing', 'Entrepreneurship'],
    experience: '6 years',
    rating: 4.7,
    totalSessions: 89,
    availability: 'Available',
    bio: 'Helps students transition from academia to business careers.',
    avatar: '/assets/images/avatar/avatar_3.jpg',
    nextSlot: '2025-09-13 3:00 PM',
    languages: ['English', 'Portuguese'],
    education: 'MBA, Harvard Business School'
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    title: 'Psychology & Wellness Counselor',
    specializations: ['Psychology', 'Medicine', 'Teaching'],
    experience: '10 years',
    rating: 4.9,
    totalSessions: 198,
    availability: 'Available',
    bio: 'Focuses on mental health and career wellness in academic settings.',
    avatar: '/assets/images/avatar/avatar_4.jpg',
    nextSlot: '2025-09-13 11:00 AM',
    languages: ['English', 'French'],
    education: 'PhD in Psychology, Yale University'
  }
];

// Mock session types
const sessionTypes = [
  { id: 1, name: 'Career Guidance', duration: '45 min', price: 'Free' },
  { id: 2, name: 'Academic Planning', duration: '30 min', price: 'Free' },
  { id: 3, name: 'Industry Insights', duration: '60 min', price: 'Free' },
  { id: 4, name: 'Personal Development', duration: '45 min', price: 'Free' }
];

export default function Counselling() {
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [recommendedCounselors, setRecommendedCounselors] = useState<any[]>([]);
  const [allCounselors] = useState<any[]>(mockCounselors);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [interestDialogOpen, setInterestDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null);
  const [sessionHistoryOpen, setSessionHistoryOpen] = useState(false);
  
  // Form states
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [bookingForm, setBookingForm] = useState({
    sessionType: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  // Load data from session storage
  useEffect(() => {
    const loadCounsellingData = () => {
      setLoading(true);
      
      setTimeout(() => {
        const savedInterests = JSON.parse(sessionStorage.getItem(USER_INTERESTS_STORAGE_KEY) || '[]');
        const savedSessions = JSON.parse(sessionStorage.getItem(COUNSELLING_SESSIONS_STORAGE_KEY) || '[]');
        
        setUserInterests(savedInterests);
        setSessions(savedSessions);
        
        if (savedInterests.length > 0) {
          const recommended = getRecommendedCounselors(savedInterests);
          setRecommendedCounselors(recommended);
        }
        
        setLoading(false);
      }, 1000);
    };

    loadCounsellingData();
  }, []);

  // Get recommended counselors based on interests
  const getRecommendedCounselors = (interests: string[]) => 
    mockCounselors
      .map(counselor => ({
        ...counselor,
        matchScore: calculateMatchScore(counselor.specializations, interests)
      }))
      .filter(counselor => counselor.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

  // Calculate match score between counselor and user interests
  const calculateMatchScore = (specializations: string[], interests: string[]) => {
    const matches = specializations.filter(spec => 
      interests.some(interest => 
        interest.toLowerCase().includes(spec.toLowerCase()) || 
        spec.toLowerCase().includes(interest.toLowerCase())
      )
    );
    return (matches.length / specializations.length) * 100;
  };

  // Save interests and update recommendations
  const handleSaveInterests = () => {
    setUserInterests(selectedInterests);
    sessionStorage.setItem(USER_INTERESTS_STORAGE_KEY, JSON.stringify(selectedInterests));
    
    const recommended = getRecommendedCounselors(selectedInterests);
    setRecommendedCounselors(recommended);
    
    setInterestDialogOpen(false);
    alert('Interests saved successfully! Check your recommended counselors.');
  };

  // Handle counselor booking
  const handleBookCounselor = (counselor: any) => {
    setSelectedCounselor(counselor);
    setBookingDialogOpen(true);
  };

  // Submit booking
  const handleSubmitBooking = () => {
    if (!bookingForm.sessionType || !bookingForm.preferredDate || !bookingForm.preferredTime) {
      alert('Please fill in all required fields');
      return;
    }

    const newSession = {
      id: Date.now(),
      counselorId: selectedCounselor.id,
      counselorName: selectedCounselor.name,
      sessionType: bookingForm.sessionType,
      scheduledDate: bookingForm.preferredDate,
      scheduledTime: bookingForm.preferredTime,
      message: bookingForm.message,
      status: 'Scheduled',
      bookedAt: new Date().toISOString()
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    sessionStorage.setItem(COUNSELLING_SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));

    setBookingDialogOpen(false);
    setBookingForm({ sessionType: '', preferredDate: '', preferredTime: '', message: '' });
    alert('Session booked successfully! Check your session history.');
  };

  // Cancel session
  const handleCancelSession = (sessionId: number) => {
    const updatedSessions = sessions.map(session =>
      session.id === sessionId ? { ...session, status: 'Cancelled' } : session
    );
    setSessions(updatedSessions);
    sessionStorage.setItem(COUNSELLING_SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));
    alert('Session cancelled successfully.');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Loading counselling services...
          </Typography>
          <LinearProgress sx={{ maxWidth: 300, mx: 'auto' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
          <Iconify icon="solar:users-group-rounded-bold" sx={{ mr: 2 }} />
          Academic Counselling
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Get personalized guidance from expert counselors based on your interests and career goals
        </Typography>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:heart-bold" />}
            onClick={() => {
              setSelectedInterests(userInterests);
              setInterestDialogOpen(true);
            }}
          >
            Set Interests
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:calendar-date-bold" />}
            onClick={() => setSessionHistoryOpen(true)}
          >
            <Badge badgeContent={sessions.filter(s => s.status === 'Scheduled').length} color="primary">
              My Sessions
            </Badge>
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:phone-bold" />}
            onClick={() => alert('Emergency counselling hotline: 1-800-HELP-NOW')}
          >
            Emergency Support
          </Button>
        </Stack>
      </Box>

      {/* User Interests Display */}
      {userInterests.length > 0 && (
        <Card sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <Iconify icon="solar:flag-bold" sx={{ mr: 1 }} />
            Your Interests
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {userInterests.map((interest, index) => (
              <Chip
                key={index}
                label={interest}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Card>
      )}

      {/* Recommended Counselors */}
      {recommendedCounselors.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            <Iconify icon="solar:flag-bold" sx={{ mr: 1 }} />
            Recommended for You
          </Typography>
          <Grid container spacing={3}>
            {recommendedCounselors.map((counselor) => (
              <Grid size={{ xs: 12, md: 4 }} key={counselor.id}>
                <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Avatar
                      src={counselor.avatar}
                      sx={{ width: 60, height: 60 }}
                    >
                      {counselor.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{counselor.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {counselor.title}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                        <Rating value={counselor.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="caption">
                          ({counselor.totalSessions} sessions)
                        </Typography>
                      </Stack>
                    </Box>
                    <Chip
                      label={`${Math.round(counselor.matchScore)}% match`}
                      color="success"
                      size="small"
                    />
                  </Stack>

                  <Typography variant="body2" sx={{ mb: 2, flex: 1 }}>
                    {counselor.bio}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Specializations:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {counselor.specializations.slice(0, 3).map((spec: string, index: number) => (
                        <Chip key={index} label={spec} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Iconify icon="solar:clock-circle-bold" width={16} />
                    <Typography variant="caption">
                      Next: {counselor.nextSlot}
                    </Typography>
                  </Stack>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleBookCounselor(counselor)}
                    disabled={counselor.availability === 'Busy'}
                  >
                    {counselor.availability === 'Available' ? 'Book Session' : 'Currently Busy'}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Counselors */}
      <Box id="counselors-section">
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          <Iconify icon="solar:users-group-rounded-bold" sx={{ mr: 1 }} />
          All Counselors
        </Typography>
        <Grid container spacing={3}>
          {allCounselors.map((counselor) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={counselor.id}>
              <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Avatar
                    src={counselor.avatar}
                    sx={{ width: 50, height: 50 }}
                  >
                    {counselor.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">{counselor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {counselor.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                      <Rating value={counselor.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="caption">({counselor.rating})</Typography>
                    </Stack>
                  </Box>
                  <Chip
                    label={counselor.availability}
                    color={counselor.availability === 'Available' ? 'success' : 'warning'}
                    size="small"
                  />
                </Stack>

                <Typography variant="body2" sx={{ mb: 2, flex: 1 }}>
                  {counselor.bio}
                </Typography>

                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Experience: {counselor.experience}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {counselor.specializations.slice(0, 2).map((spec: string, index: number) => (
                      <Chip key={index} label={spec} size="small" variant="outlined" />
                    ))}
                    {counselor.specializations.length > 2 && (
                      <Chip label={`+${counselor.specializations.length - 2}`} size="small" variant="outlined" />
                    )}
                  </Stack>
                </Stack>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleBookCounselor(counselor)}
                  disabled={counselor.availability === 'Busy'}
                >
                  {counselor.availability === 'Available' ? 'Book Session' : 'Currently Busy'}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Interest Selection Dialog */}
      <Dialog open={interestDialogOpen} onClose={() => setInterestDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Select Your Interests</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose areas you&apos;re interested in to get personalized counselor recommendations
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {availableInterests.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                clickable
                color={selectedInterests.includes(interest) ? 'primary' : 'default'}
                onClick={() => {
                  if (selectedInterests.includes(interest)) {
                    setSelectedInterests(selectedInterests.filter(i => i !== interest));
                  } else {
                    setSelectedInterests([...selectedInterests, interest]);
                  }
                }}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInterestDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveInterests}>
            Save Interests ({selectedInterests.length})
          </Button>
        </DialogActions>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog 
        open={bookingDialogOpen} 
        onClose={() => setBookingDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar 
              src={selectedCounselor?.avatar} 
              sx={{ width: 50, height: 50 }}
            >
              {selectedCounselor?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Book Session with {selectedCounselor?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedCounselor?.specialization} • {selectedCounselor?.experience} experience
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Card sx={{ p: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.100' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                  <Iconify icon="solar:flag-bold" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Expert Counselor
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating: {selectedCounselor?.rating}/5 • {selectedCounselor?.sessionsCompleted} sessions completed
                  </Typography>
                </Box>
              </Stack>
            </Card>

            <FormControl fullWidth>
              <InputLabel>Session Type</InputLabel>
              <Select
                value={bookingForm.sessionType}
                onChange={(e) => setBookingForm({...bookingForm, sessionType: e.target.value})}
                label="Session Type"
              >
                {sessionTypes.map((type) => (
                  <MenuItem key={type.id} value={type.name}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {type.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Duration: {type.duration}
                        </Typography>
                      </Box>
                      <Chip label={type.price} color="primary" variant="outlined" size="small" />
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Preferred Date"
                type="date"
                value={bookingForm.preferredDate}
                onChange={(e) => setBookingForm({...bookingForm, preferredDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <Iconify icon="solar:calendar-date-bold" sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <TextField
                fullWidth
                label="Preferred Time"
                type="time"
                value={bookingForm.preferredTime}
                onChange={(e) => setBookingForm({...bookingForm, preferredTime: e.target.value})}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <Iconify icon="solar:clock-circle-bold" sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Stack>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Session Notes (Optional)"
              placeholder="Describe what you'd like to discuss in this session..."
              value={bookingForm.message}
              onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
              InputProps={{
                startAdornment: <Iconify icon="solar:document-bold" sx={{ mr: 1, mt: 2, color: 'text.secondary', alignSelf: 'flex-start' }} />
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={() => setBookingDialogOpen(false)}
            variant="outlined"
            size="large"
            sx={{ minWidth: 120 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitBooking}
            size="large"
            startIcon={<Iconify icon="solar:calendar-date-bold" />}
            sx={{ minWidth: 160 }}
          >
            Book Session
          </Button>
        </DialogActions>
      </Dialog>

      {/* Session History Dialog */}
      <Dialog 
        open={sessionHistoryOpen} 
        onClose={() => setSessionHistoryOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '80vh',
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              <Iconify icon="solar:calendar-date-bold" />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                My Counselling Sessions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your scheduled and completed sessions
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 2 }}>
          {sessions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Avatar sx={{ 
                bgcolor: 'grey.100', 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 3,
                color: 'grey.400' 
              }}>
                <Iconify icon="solar:calendar-date-bold" width={40} />
              </Avatar>
              <Typography variant="h6" gutterBottom color="text.secondary">
                No sessions booked yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start your counselling journey by booking your first session with one of our expert counselors
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => {
                  setSessionHistoryOpen(false);
                  document.getElementById('counselors-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                startIcon={<Iconify icon="solar:user-plus-bold" />}
              >
                Book Your First Session
              </Button>
            </Box>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              {sessions.map((session, index) => (
                <Card 
                  key={session.id} 
                  sx={{ 
                    p: 3, 
                    border: '1px solid',
                    borderColor: 'grey.200',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: session.status === 'Scheduled' ? 'success.main' : 'warning.main',
                      boxShadow: (theme) => `0 4px 20px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Stack direction="row" spacing={3} alignItems="flex-start">
                    <Avatar sx={{ 
                      bgcolor: session.status === 'Scheduled' ? 'success.main' : 'warning.main',
                      width: 50,
                      height: 50
                    }}>
                      <Iconify 
                        icon={session.status === 'Scheduled' ? 'solar:calendar-date-bold' : 'solar:clock-circle-bold'} 
                        width={24}
                      />
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {session.sessionType}
                        </Typography>
                        <Chip
                          label={session.status}
                          size="small"
                          color={session.status === 'Scheduled' ? 'success' : 'warning'}
                          variant="filled"
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>
                      
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        with <strong>{session.counselorName}</strong>
                      </Typography>
                      
                      <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify icon="solar:calendar-date-bold" width={16} color="text.secondary" />
                          <Typography variant="body2" color="text.secondary">
                            {session.scheduledDate}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify icon="solar:clock-circle-bold" width={16} color="text.secondary" />
                          <Typography variant="body2" color="text.secondary">
                            {session.scheduledTime}
                          </Typography>
                        </Stack>
                      </Stack>
                      
                      {session.message && (
                        <Alert severity="info" sx={{ mt: 2, py: 1 }}>
                          <Typography variant="body2">
                            <strong>Session Notes:</strong> {session.message}
                          </Typography>
                        </Alert>
                      )}
                    </Box>
                    
                    {session.status === 'Scheduled' && (
                      <Stack spacing={1}>
                        <IconButton
                          color="primary"
                          sx={{ 
                            bgcolor: 'primary.50',
                            '&:hover': { bgcolor: 'primary.100' }
                          }}
                          size="small"
                        >
                          <Iconify icon="solar:pen-bold" width={16} />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleCancelSession(session.id)}
                          sx={{ 
                            bgcolor: 'error.50',
                            '&:hover': { bgcolor: 'error.100' }
                          }}
                          size="small"
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                        </IconButton>
                      </Stack>
                    )}
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={() => setSessionHistoryOpen(false)}
            variant="outlined"
            size="large"
            sx={{ minWidth: 120 }}
          >
            Close
          </Button>
          {sessions.length > 0 && (
            <Button 
              variant="contained" 
              size="large"
              startIcon={<Iconify icon="solar:user-plus-bold" />}
              onClick={() => {
                setSessionHistoryOpen(false);
                document.getElementById('counselors-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              sx={{ minWidth: 160 }}
            >
              Book Another Session
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}
