import React, { useState } from 'react';

import { Link, Stack, Button, Typography } from '@mui/material';

import ProfileSection from '../components/ProfileSection';
import ProfileSectionItem from '../components/ProfileSectionItem';
import AddCertificatesDialog, { type CertificateFormData } from './AddCertificates';

interface Certificate {
  id: number;
  title: string;
  text: string;
  url: string;
  isDeleted: boolean;
}

const initialCertificates: Certificate[] = [
  {
    id: 1,
    title: 'Certificate 1',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    url: 'https://www.google.com',
    isDeleted: false,
  },
  {
    id: 2,
    title: 'Certificate 2',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    url: 'https://www.google.com',
    isDeleted: false,
  },
];

const Certificates = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [certificates, setCertificates] = useState(initialCertificates);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = (data: CertificateFormData) => {
    const newCertificate = {
      id: Date.now(),
      ...data,
      isDeleted: false,
    };
    setCertificates([...certificates, newCertificate as Certificate]);
  };

  const handleDeleteCertificate = (certificateId: number) => {
    setCertificates(prevList =>
      prevList.map(certificate =>
        certificate.id === certificateId ? { ...certificate, isDeleted: true } : certificate
      )
    );
  };

  const activeCertificates = certificates.filter(certificate => !certificate.isDeleted);

  return (
    <>
      <ProfileSection
        title="Certificates"
        icon="🏆"
        buttonText="+ Add Certificate"
        onAddClick={() => setOpen(true)}
        isEmpty={activeCertificates.length === 0}
        emptyTitle="No certificates added yet"
        emptyDescription='Click "Add Certificate" to showcase your achievements'
      >
        <Stack spacing={3}>
          {activeCertificates.map((certificate: Certificate) => (
            <ProfileSectionItem key={certificate.id}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary'
                    }}
                  >
                    {certificate.title}
                  </Typography>
                  <Button
                    color="error"
                    variant="text"
                    size="small"
                    onClick={() => handleDeleteCertificate(certificate.id)}
                    sx={{
                      padding: 1,
                      minWidth: '40px',
                      minHeight: '40px',
                      borderRadius: '8px',
                      '&:hover': {
                        bgcolor: 'error.light',
                        color: 'white',
                      }
                    }}
                  >
                    <i className="ri-delete-bin-fill" style={{ fontSize: '1.3rem' }} />
                  </Button>
                </Stack>
                
                <Link
                  href={certificate.url}
                  color="primary"
                  underline="hover"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.dark',
                    }
                  }}
                >
                  🔗 View Certificate
                </Link>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.6
                  }}
                >
                  {isExpanded ? (
                    certificate.text || ''
                  ) : (
                    certificate.text.length > 90
                      ? certificate.text.slice(0, 90) + '...'
                      : certificate.text
                  )}
                </Typography>
                
                {certificate.text.length > 90 && (
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => handleToggle()}
                    sx={{
                      alignSelf: 'flex-start',
                      textTransform: 'none',
                      fontWeight: 500,
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </Button>
                )}
              </Stack>
            </ProfileSectionItem>
          ))}
        </Stack>
      </ProfileSection>
      
      <AddCertificatesDialog open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
    </>
  );
};

export default Certificates;
