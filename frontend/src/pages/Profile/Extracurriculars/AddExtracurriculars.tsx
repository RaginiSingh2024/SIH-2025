import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';

import { Field, Form } from 'src/components/hook-form';

import { extracurricularSchema } from '../ProfileSchemas';

export type ExtracurricularFormData = zod.infer<typeof extracurricularSchema>;

interface AddExtracurricularsDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ExtracurricularFormData) => void;
}

const AddExtracurricularsDialog: React.FC<AddExtracurricularsDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const defaultValues: ExtracurricularFormData = {
    title: '',
    text: '',
  };

  const methods = useForm<ExtracurricularFormData>({
    resolver: zodResolver(extracurricularSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const handleFormSubmit = handleSubmit(async (data: ExtracurricularFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Typography variant="h6" sx={{ p: 3 }}>
        Add New Activity
      </Typography>
      <Form methods={methods} onSubmit={handleFormSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Title*
              </Typography>
              <Field.Text name="title" placeholder="Title" size="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Description*
              </Typography>
              <Field.Text name="text" placeholder="Description" size="small" />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" size="medium" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" size="medium" type="submit" disabled={isSubmitting}>
            Add Activity
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default AddExtracurricularsDialog;
