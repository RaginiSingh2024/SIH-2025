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
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { Field, Form } from 'src/components/hook-form';

import { skillsOptions } from '../Skillsdata';
import { skillSchema } from '../ProfileSchemas';



export type SkillsFormData = zod.infer<typeof skillSchema>;

interface AddSkillsDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SkillsFormData) => void;
}

const AddSkillsDialog: React.FC<AddSkillsDialogProps> = ({ open, onClose, onSubmit }) => {
  const defaultValues: SkillsFormData = {
    skillTitle: '',
    level: 'Beginner' as const,
  };

  const methods = useForm<SkillsFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const handleFormSubmit = handleSubmit(async (data: SkillsFormData) => {
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Typography variant="h6" sx={{ p: 3 }}>
        Add New Skill
      </Typography>
      <Form methods={methods} onSubmit={handleFormSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Skill Name*
              </Typography>
              <Field.Autocomplete
                name="skillTitle"
                options={skillsOptions}
                placeholder="Select or type a skill (e.g., React, Node.js)"
                size="small"
                fullWidth
                slotProps={{
                  listbox: {
                    sx: { maxHeight: 220 },
                  },
                }}
                filterSelectedOptions
                freeSolo
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Skill Level*
              </Typography>
              <Field.Select name="level" size="small" placeholder="Select skill level">
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Field.Select>
            </Box>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting} size="medium">
                Add Skill
              </Button>
            </DialogActions>
          </Stack>
        </DialogContent>
      </Form>
    </Dialog>
  );
};

export default AddSkillsDialog;
