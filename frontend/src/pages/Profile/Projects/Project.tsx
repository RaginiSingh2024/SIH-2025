import React, { useState } from 'react';

import { Delete as DeleteIcon } from '@mui/icons-material';
import {Box, Link, Chip, Stack, Button, Typography, IconButton } from '@mui/material';


interface ProjectProps {
  project: any;
  onDelete: (projectId: number) => void;
}

const Project = ({ project, onDelete }: ProjectProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = () => {
    onDelete(project.id);
  };

  const desc = project.description;
  const shortDesc = desc.length > 90 ? desc.slice(0, 90) + '...' : desc;

  return (
    <Stack spacing={2}>
      {/* Header with title and delete button */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={0.5} flex={1}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              lineHeight: 1.3
            }}
          >
            {project.title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 500,
              textTransform: 'capitalize'
            }}
          >
            {project.role}
          </Typography>
        </Stack>
        
        <IconButton
          color="error"
          size="small"
          onClick={handleDelete}
          sx={{
            '&:hover': {
              bgcolor: 'error.light',
              color: 'white',
            },
            transition: 'all 0.2s ease'
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Skills */}
      <Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {project.skills.map((skill: string, index: number) => (
            <Chip
              key={index}
              label={skill}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                },
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Links */}
      <Stack direction="row" spacing={3} alignItems="center">
        <Link
          href={project.codeLinks[0]}
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
          🔗 Code URLs
        </Link>
        <Link
          href={project.hostedLinks[0]}
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
          🌐 Live Demo
        </Link>
      </Stack>

      {/* Description */}
      <Box>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            lineHeight: 1.6,
            fontStyle: 'italic'
          }}
        >
          {isExpanded ? desc : shortDesc}
        </Typography>
        
        {desc.length > 90 && (
          <Button 
            size="small" 
            color="primary" 
            onClick={handleToggle}
            sx={{
              mt: 1,
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
      </Box>
    </Stack>
  );
};

export default Project;
