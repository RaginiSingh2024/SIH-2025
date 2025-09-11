import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import { RHFAutocomplete, RHFDatePicker, RHFTextField } from 'src/components/hook-form';

import { editProfileSchema, type EditProfileFormValues } from './Schema';



const gender = ['Male', 'Female', 'Other'];
const cities = ['Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Kolkata'];
const states = ['Rajasthan', 'Maharashtra', 'karnataka', 'WestBengal', 'Haryana'];

export default function EditProfileDialog({
  open,
  onClose,
  defaultValues,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  defaultValues: EditProfileFormValues;
  onSubmit: (data: EditProfileFormValues) => void;
}) {
  const methods = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleFormSubmit = async (data: EditProfileFormValues) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogTitle>Edit Profile</DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={1.5}>
              {/* First & Last Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">
                    First Name
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>

                  <RHFTextField name="firstName" placeholder="ex: John" size="small" />
                </Stack>
              </Grid>
              {/* last name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">Last Name </Typography>

                  <RHFTextField name="lastName" placeholder="ex: Doe" size="small" />
                </Stack>
              </Grid>

              {/* Username (read-only with @) */}

              <Grid size={{ xs: 12 }}>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">
                    {' '}
                    User Name
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>

                  <RHFTextField
                    name="username"
                    placeholder="john_doe"
                    size="small"
                    disabled
                    helperText="This is your unique platform handle"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Stack
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              borderColor: 'divider',
                              color: 'text.secondary',
                            }}
                          >
                            @
                          </Stack>
                        ),
                      },
                    }}
                  />
                </Stack>
              </Grid>

              {/* description */}

              <Grid size={{ xs: 12 }}>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">
                    Description
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>
                  <RHFTextField
                    className="scroll-textarea"
                    name="description"
                    placeholder="Tell us about yourself..."
                    size="small"
                    multiline
                    minRows={4}
                    helperText=""
                  />
                </Stack>
              </Grid>

              {/* gender */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">
                    Gender
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>
                  <RHFAutocomplete
                    name="gender"
                    size="small"
                    options={gender}
                    placeholder="Select gender"
                  />
                </Stack>
              </Grid>

              {/* email */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">
                    Email
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>
                  <RHFTextField name="email" size="small" placeholder="Enter your email" />
                </Stack>
              </Grid>

              {/* Phone number */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">
                    {' '}
                    Phone Number{' '}
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>
                  <RHFTextField name="phone" size="small" placeholder="Enter your Phone Number" />
                </Stack>
              </Grid>

              {/* dob */}

              <Grid size={{ xs: 12 }}>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">
                    {' '}
                    Date Of Birth
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>
                  <RHFDatePicker
                    name="dob"
                    slotProps={{
                      textField: {
                        size: 'small',
                        placeholder: 'Select your date of birth',
                      },
                    }}
                  />
                </Stack>
              </Grid>

              {/* Address */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">
                    Address Line 1
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>
                  <RHFTextField
                    name="addressline1"
                    placeholder="Enter your address"
                    multiline
                    rows={2}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">Address Line 2</Typography>
                  <RHFTextField
                    name="addressline2"
                    placeholder="Enter your address"
                    multiline
                    rows={2}
                  />
                </Stack>
              </Grid>

              {/* city */}

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">
                    City
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>

                  <RHFAutocomplete
                    name="city"
                    size="small"
                    placeholder="Select City"
                    options={cities}
                  />
                </Stack>
              </Grid>

              {/* state */}

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">
                    State
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>

                  <RHFAutocomplete
                    name="state"
                    size="small"
                    placeholder="Select State"
                    options={states}
                  />
                </Stack>
              </Grid>

              {/* country */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">
                    Country
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>

                  <RHFTextField name="country" size="small" placeholder="Select Country" />
                </Stack>
              </Grid>

              {/* pincode */}

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">
                    Pincode
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>

                  <RHFTextField
                    name="pincode"
                    size="small"
                    placeholder="Enter your area PIN code"
                  />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Stack direction="row" spacing={2} sx={{ px: 3, py: 2 }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                Save Changes
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
