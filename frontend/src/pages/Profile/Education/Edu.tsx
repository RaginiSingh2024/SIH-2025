import { Stack, Typography, Button } from '@mui/material';

// import 'remixicon/fonts/remixicon.css';

interface EduProps {
  edu: any;
  onDelete: (eduId: number) => void;
}

const Edu = ({ edu, onDelete }: EduProps) => {
  const handleDelete = () => {
    onDelete(edu.id);
  };

  return (
    <Stack fontWeight={600} spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="subtitle1">{edu.institution}</Typography>
        <Button
          color="error"
          variant="text"
          size="small"
          onClick={handleDelete}
          sx={{
            padding: 1,
            minWidth: '40px',
            minHeight: '40px',
            borderRadius: '8px',
          }}
        >
          <i className="ri-delete-bin-fill" style={{ fontSize: '1.3rem' }} />
        </Button>
      </Stack>
      <Typography variant="body2">{edu.degree}</Typography>
      <Typography variant="body2" color="primary">
        {edu.sYear} - {edu.ongoing ? 'Present' : edu.eYear}
      </Typography>
    </Stack>
  );
};

export default Edu;
