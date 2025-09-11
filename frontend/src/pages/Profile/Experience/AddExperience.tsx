import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  MenuItem,
} from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { experienceSchema } from '../ProfileSchemas';
// import 'remixicon/fonts/remixicon.css';

export type ExperienceFormData = zod.infer<typeof experienceSchema>;

interface AddExperienceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ExperienceFormData) => void;
}

const AddExperienceDialog: React.FC<AddExperienceDialogProps> = ({ open, onClose, onSubmit }) => {
  const defaultValues: ExperienceFormData = {
    title: '',
    company: '',
    location: '',
    isWFH: false,
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
    type: '',
  };

  const methods = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
  } = methods;

  const isCurrent = watch('currentlyWorking');

  const handleFormSubmit = handleSubmit(async data => {
    try {
      console.warn('Submitting experience:', data);
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Typography variant="h6" sx={{ p: 3 }}>
        Add New Experience
      </Typography>
      <Form methods={methods} onSubmit={handleFormSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Job Title*
              </Typography>
              <Field.Text name="title" placeholder="e.g. Senior Software Engineer" size="small" />
            </Box>

            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Company*
              </Typography>
              <Field.Text name="company" placeholder="Company Name" size="small" />
            </Box>

            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Job Type*
              </Typography>
              <Field.Select name="type" size="small" placeholder="Select Job Type">
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
                <MenuItem value="Freelance">Freelance</MenuItem>
              </Field.Select>
            </Box>

            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Location*
              </Typography>
              <Field.Text name="location" placeholder="e.g. San Francisco, CA" size="small" />
            </Box>

            <Field.Checkbox name="isWFH" label="Work from home" />

            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" mb={0.5}>
                  Start Date*
                </Typography>
                <Field.DatePicker
                  name="startDate"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      placeholder: 'Start Date',
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
                  End Date*
                </Typography>
                <Field.DatePicker
                  name="endDate"
                  disabled={isCurrent}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      placeholder: isCurrent ? 'Currently working here' : 'End Date',
                    },
                  }}
                />
              </Box>
            </Stack>

            <Field.Checkbox name="currentlyWorking" label="I currently work here" />

            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Description*
              </Typography>
              <Field.Text
                name="description"
                placeholder="Describe your role, responsibilities, and achievements..."
                multiline
                rows={4}
                size="small"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} size="medium" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting} size="medium">
            Add Experience
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default AddExperienceDialog;
