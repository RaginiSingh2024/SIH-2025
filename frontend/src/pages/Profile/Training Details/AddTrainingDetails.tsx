import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Box,
} from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { trainingDetailsSchema } from '../ProfileSchemas';
// import 'remixicon/fonts/remixicon.css';

export type TrainingDetailsFormData = zod.infer<typeof trainingDetailsSchema>;

interface AddTrainingDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TrainingDetailsFormData) => void;
}

const AddTrainingDetailsDialog: React.FC<AddTrainingDetailsDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const defaultValues: TrainingDetailsFormData = {
    program: '',
    organization: '',
    sDate: '',
    eDate: '',
    isOnline: false,
    location: '',
    urls: [''],
    description: '',
  };

  const methods = useForm<TrainingDetailsFormData>({
    resolver: zodResolver(trainingDetailsSchema),
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

  const isOnline = watch('isOnline');

  React.useEffect(() => {
    if (isOnline) {
      setValue('location', 'Online');
    } else {
      setValue('location', '');
    }
  }, [isOnline, setValue]);

  const handleFormSubmit = handleSubmit(async data => {
    try {
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

  const handleAddUrl = () => {
    const currentUrls = methods.getValues('urls');
    methods.setValue('urls', [...(currentUrls ?? []), '']);
  };

  const handleRemoveUrl = (index: number) => {
    const currentUrls = methods.getValues('urls');
    if (currentUrls && currentUrls.length > 1) {
      methods.setValue(
        'urls',
        currentUrls.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Typography variant="h6" sx={{ p: 3 }}>
        Add New Training Details
      </Typography>
      <Form methods={methods} onSubmit={handleFormSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Program/Course Name*
              </Typography>
              <Field.Text name="program" placeholder="Program/Course Name" size="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Organization*
              </Typography>
              <Field.Text name="organization" placeholder="Organization" size="small" />
            </Box>
            <Field.Checkbox name="isOnline" label="Is this program online?" />
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Location*
              </Typography>
              <Field.Text name="location" placeholder="Location" size="small" disabled={isOnline} />
            </Box>

            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="subtitle2" mb={0.5}>
                  Start Date*
                </Typography>
                <Field.DatePicker
                  name="sDate"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" mb={0.5}>
                  End Date*
                </Typography>
                <Field.DatePicker
                  name="eDate"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Box>
            </Stack>

            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Certificate URLs*
              </Typography>
              {methods.watch('urls').map((url: string, index: number) => (
                <Stack key={index} direction="row" spacing={1} mb={2}>
                  <Field.Text
                    name={`urls.${index}`}
                    placeholder={`Training Certificate Link ${index + 1}`}
                    size="small"
                    fullWidth
                  />
                  {url.length > 1 && (
                    <Button
                      color="error"
                      variant="text"
                      size="small"
                      onClick={() => handleRemoveUrl(index)}
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
              <Button variant="outlined" size="medium" color="primary" onClick={handleAddUrl}>
                + Add Training Certificate URL
              </Button>
            </Box>
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Description*
              </Typography>
              <Field.Text
                name="description"
                placeholder="Description"
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
            Add Training Details
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default AddTrainingDetailsDialog;
