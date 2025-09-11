import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { skillsOptions } from '../Skillsdata';
import { projectSchema } from '../ProfileSchemas';

// import 'remixicon/fonts/remixicon.css';

export type ProjectFormData = zod.infer<typeof projectSchema>;

interface AddProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
}

const AddProjectDialog: React.FC<AddProjectDialogProps> = ({ open, onClose, onSubmit }) => {
  const defaultValues: ProjectFormData = {
    title: '',
    role: '',
    skills: [],
    codeLinks: [''],
    hostedLinks: [''],
    description: '',
  };

  const methods = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

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

  const handleAddCodeLink = () => {
    const currentLinks = methods.getValues('codeLinks');
    methods.setValue('codeLinks', [...currentLinks, '']);
  };

  const handleRemoveCodeLink = (index: number) => {
    const currentLinks = methods.getValues('codeLinks');
    if (currentLinks.length > 1) {
      methods.setValue(
        'codeLinks',
        currentLinks.filter((_, i) => i !== index)
      );
    }
  };

  const handleAddHostedLink = () => {
    const currentLinks = methods.getValues('hostedLinks');
    methods.setValue('hostedLinks', [...currentLinks, '']);
  };

  const handleRemoveHostedLink = (index: number) => {
    const currentLinks = methods.getValues('hostedLinks');
    if (currentLinks.length > 1) {
      methods.setValue(
        'hostedLinks',
        currentLinks.filter((_, i) => i !== index)
      );
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = methods.getValues('skills');
    methods.setValue(
      'skills',
      currentSkills.filter(skill => skill.toLowerCase() !== skillToRemove.toLowerCase())
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Typography variant="h6" sx={{ p: 3 }}>
        Add New Project
      </Typography>
      <Form methods={methods} onSubmit={handleFormSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Project Title*
              </Typography>
              <Field.Text name="title" placeholder="Project Title" size="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Your Role*
              </Typography>
              <Field.Text name="role" placeholder="Your Role" size="small" />
            </Box>

            {/* Skills Section */}
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Skills*
              </Typography>

              {/* Skills Multiselect */}
              <Field.Autocomplete
                name="skills"
                multiple
                options={skillsOptions}
                getOptionLabel={option => option}
                isOptionEqualToValue={(option, value) =>
                  option.toLowerCase() === value.toLowerCase()
                }
                size="small"
                fullWidth
                placeholder={methods.watch('skills')?.length ? '' : 'Eg. React, Node.js, MongoDB'}
                slotProps={{
                  listbox: {
                    sx: { maxHeight: 220 },
                  },
                }}
                renderValue={selected => (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {selected.map((skill: string) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        variant="outlined"
                        color="primary"
                        onDelete={() => handleRemoveSkill(skill)}
                        sx={{ margin: '2px' }}
                      />
                    ))}
                  </Stack>
                )}
                filterSelectedOptions
                freeSolo
                disableCloseOnSelect
              />
            </Box>

            {/* Code Links Section */}
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Code Links*
              </Typography>
              {methods.watch('codeLinks').map((_, index) => (
                <Stack key={index} direction="row" spacing={1} mb={2}>
                  <Field.Text
                    name={`codeLinks.${index}`}
                    placeholder={`Code Link ${index + 1}`}
                    size="small"
                    fullWidth
                  />
                  {methods.watch('codeLinks').length > 1 && (
                    <Button
                      color="error"
                      variant="text"
                      size="small"
                      onClick={() => handleRemoveCodeLink(index)}
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
              <Button variant="outlined" size="medium" color="primary" onClick={handleAddCodeLink}>
                + Add Code Link
              </Button>
            </Box>

            {/* Hosted Links Section */}
            <Box>
              <Typography variant="subtitle2" mb={0.5}>
                Hosted Links*
              </Typography>
              {methods.watch('hostedLinks').map((_, index) => (
                <Stack key={index} direction="row" spacing={1} mb={2}>
                  <Field.Text
                    name={`hostedLinks.${index}`}
                    placeholder={`Hosted Link ${index + 1}`}
                    size="small"
                    fullWidth
                  />
                  {methods.watch('hostedLinks').length > 1 && (
                    <Button
                      color="error"
                      variant="text"
                      size="small"
                      onClick={() => handleRemoveHostedLink(index)}
                      sx={{
                        padding: 1,
                        minWidth: '40px',
                        minHeight: '40px',
                        borderRadius: '8px',
                      }}
                    >
                      <i className="ri-delete-bin-fill" style={{ fontSize: '1.5rem' }} />
                    </Button>
                  )}
                </Stack>
              ))}
              <Button
                variant="outlined"
                size="medium"
                color="primary"
                onClick={handleAddHostedLink}
              >
                + Add Hosted Link
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
                rows={3}
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
            Add Project
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default AddProjectDialog;
