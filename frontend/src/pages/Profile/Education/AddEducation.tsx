import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Stack,
  Button,
  Dialog,
  Typography,
  ToggleButton,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
} from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { educationSchema } from '../ProfileSchemas';
// import 'remixicon/fonts/remixicon.css';

export type EducationFormData = zod.infer<typeof educationSchema>;

interface AddEducationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EducationFormData) => void;
}

const AddEducationDialog: React.FC<AddEducationDialogProps> = ({ open, onClose, onSubmit }) => {
  const defaultValues: EducationFormData = {
    degree: '',
    institution: '',
    sYear: '',
    eYear: '',
    ongoing: false,
    subjects: [
      {
        name: '',
        obtainedMarks: '',
        totalMarks: '',
      },
    ],
    grade: '',
    scale: 'percentage',
  };

  const methods = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
    setValue,
  } = methods;

  const isCurrent = watch('ongoing');
  const scale = watch('scale');
  const subjects = watch('subjects');

  // Watch individual subject fields for real-time updates
  const watchedSubjects = subjects.map((_, index) => ({
    name: watch(`subjects.${index}.name`),
    obtainedMarks: watch(`subjects.${index}.obtainedMarks`),
    totalMarks: watch(`subjects.${index}.totalMarks`),
  }));

  const calculateGrade = () => {
    if (!watchedSubjects || watchedSubjects.length === 0) return '';

    const validSubjects = watchedSubjects.filter(
      subject =>
        subject.obtainedMarks &&
        subject.totalMarks &&
        parseFloat(subject.obtainedMarks) > 0 &&
        parseFloat(subject.totalMarks) > 0
    );

    if (validSubjects.length === 0) return '';

    if (scale === 'percentage') {
      const totalObtained = validSubjects.reduce(
        (sum, subject) => sum + parseFloat(subject.obtainedMarks),
        0
      );
      const totalMarks = validSubjects.reduce(
        (sum, subject) => sum + parseFloat(subject.totalMarks),
        0
      );
      const percentage = (totalObtained / totalMarks) * 100;
      return percentage.toFixed(2);
    }

    // Always return a string value
    return '';
  };

  // Update grade when subjects or scale changes
  React.useEffect(() => {
    const calculatedGrade = calculateGrade();
    if (calculatedGrade) {
      setValue('grade', calculatedGrade);
    }
  }, [watchedSubjects, scale, setValue]);

  const handleFormSubmit = handleSubmit(async data => {
    try {
      console.warn('Submitting education:', data);
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleScaleChange = (
    event: React.MouseEvent<HTMLElement>,
    newScale: 'percentage' | 'CGPA' | null
  ) => {
    if (newScale !== null) {
      setValue('scale', newScale);
      // Clear grade when switching scales
      setValue('grade', '');
    }
  };

  const handleAddSubject = () => {
    const currentSubjects = methods.getValues('subjects');
    methods.setValue('subjects', [
      ...currentSubjects,
      { name: '', obtainedMarks: '', totalMarks: '' },
    ]);
  };

  const handleRemoveSubject = (index: number) => {
    const currentSubjects = methods.getValues('subjects');
    if (currentSubjects.length > 1) {
      methods.setValue(
        'subjects',
        currentSubjects.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Typography variant="h6" sx={{ p: 3 }}>
        Add New Education
      </Typography>
      <Form methods={methods} onSubmit={handleFormSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Degree*
              </Typography>
              <Field.Text
                name="degree"
                placeholder="e.g. Bachelor of Science in Computer Science"
                size="small"
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Institution*
              </Typography>
              <Field.Text name="institution" placeholder="University/College Name" size="small" />
            </Box>

            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" mb={0.5}>
                  Start Year*
                </Typography>
                <Field.DatePicker
                  name="sYear"
                  views={['year']}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      placeholder: 'e.g. 2020',
                    },
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  mb={0.5}
                  color={isCurrent ? 'text.disabled' : 'text.primary'}
                >
                  End Year*
                </Typography>
                <Field.DatePicker
                  name="eYear"
                  views={['year']}
                  disabled={isCurrent}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      placeholder: isCurrent ? 'Currently studying' : 'e.g. 2024',
                    },
                  }}
                />
              </Box>
            </Stack>

            <Field.Checkbox name="ongoing" label="I am currently studying here" />
            {/* Scale Section */}
            <Stack direction="row" spacing={8} alignItems="center">
              <Typography variant="subtitle2">Scale</Typography>
              <ToggleButtonGroup value={scale} exclusive onChange={handleScaleChange} size="small">
                <ToggleButton value="percentage" color="primary">
                  Percentage
                </ToggleButton>
                <ToggleButton value="CGPA" color="primary">
                  CGPA
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            {/* Subjects Section */}
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Subjects*
              </Typography>
              {methods.watch('subjects').map((_, index) => (
                <Stack key={index} direction="row" spacing={1} mb={2}>
                  <Field.Text
                    name={`subjects.${index}.name`}
                    placeholder="Subject Name"
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <Field.Text
                    name={`subjects.${index}.totalMarks`}
                    placeholder="Total"
                    size="small"
                    type="number"
                    sx={{ width: '100px' }}
                  />
                  <Field.Text
                    name={`subjects.${index}.obtainedMarks`}
                    placeholder="Obtained"
                    size="small"
                    type="number"
                    sx={{ width: '100px' }}
                  />
                  {methods.watch('subjects').length > 1 && (
                    <Button
                      color="error"
                      variant="text"
                      size="small"
                      onClick={() => handleRemoveSubject(index)}
                      sx={{
                        padding: 1,
                        minWidth: '40px',
                        minHeight: '40px',
                        borderRadius: '8px',
                      }}
                    >
                      <i className="ri-delete-bin-fill" style={{ fontSize: '1.3rem' }} />
                    </Button>
                  )}
                </Stack>
              ))}
              <Button variant="outlined" size="medium" color="primary" onClick={handleAddSubject}>
                + Add Subject
              </Button>
            </Box>

            {/* Grade Section */}
            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" mb={0.5}>
                  Grade*
                </Typography>
                <Field.Text
                  name="grade"
                  placeholder={scale === 'percentage' ? 'e.g. 85' : 'e.g. 3.8'}
                  size="small"
                  type="number"
                  slotProps={{
                    input: {
                      inputProps: {
                        min: 0,
                        max: scale === 'percentage' ? 100 : 10,
                        step: scale === 'percentage' ? 1 : 0.1,
                      },
                    },
                  }}
                />
              </Box>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} size="medium" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting} size="medium">
            Add Education
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default AddEducationDialog;
