const mockDocuments = [
  { name: "Machine Learning Notes.pdf", type: "pdf", size: "2.1 MB", uploadDate: "2025-09-01" },
  { name: "Python Programming Exercises.py", type: "code", size: "45 KB", uploadDate: "2025-09-03" },
  { name: "Database Design Project.sql", type: "sql", size: "12 KB", uploadDate: "2025-09-05" },
  { name: "Software Engineering Presentation.pptx", type: "presentation", size: "5.8 MB", uploadDate: "2025-09-07" },
  { name: "Data Structures Implementation.java", type: "code", size: "78 KB", uploadDate: "2025-09-08" },
]; sessionStorage.setItem("lms_documents_data", JSON.stringify(mockDocuments));
