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

import { certificateSchema } from '../ProfileSchemas';

export type CertificateFormData = zod.infer<typeof certificateSchema>;

interface AddCertificatesDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CertificateFormData) => void;
}

const AddCertificatesDialog: React.FC<AddCertificatesDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const defaultValues: CertificateFormData = {
    title: '',
    text: '',
    url: '',
  };

  const methods = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const handleFormSubmit = handleSubmit(async (data: CertificateFormData) => {
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
        Add New Certificate
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
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Certificate URL*
              </Typography>
              <Field.Text name="url" placeholder="Certificate URL" size="small" />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" size="medium" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" size="medium" type="submit" disabled={isSubmitting}>
            Add
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default AddCertificatesDialog;
