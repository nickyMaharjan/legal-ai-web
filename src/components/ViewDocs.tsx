import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  
  Typography,
  Chip,
  Box,
  Container,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Divider,
  Card,
  CardContent,
  Button,
  Menu,
  MenuItem,
  Skeleton,
  Alert,

  TablePagination,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Search,
  
  Visibility,
  Download,
  MoreVert,
  SortByAlpha,
  Refresh,
  GavelRounded,
  Description,
  FolderOpen,
  Person,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { VIEW_DOCUMENT_URL } from "../utils/api.url";

interface Document {
  indexid: string;
  username: string;
  filepath: string;
  isIndexed: boolean;
}

const ViewDocs: React.FC = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<Document[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [filterStatus, setFilterStatus] = useState<"all" | "indexed" | "not-indexed">("all");
  
 
 

  // Fetch documents
  const fetchDocuments = () => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get(VIEW_DOCUMENT_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDocs(response.data);
        setFilteredDocs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch documents. Please try again later.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDocuments();
  }, [navigate]);

  // Filter documents based on search term and filter status
  useEffect(() => {
    let filtered = [...docs];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.indexid.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.filepath.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus === "indexed") {
      filtered = filtered.filter((doc) => doc.isIndexed);
    } else if (filterStatus === "not-indexed") {
      filtered = filtered.filter((doc) => !doc.isIndexed);
    }
    
    setFilteredDocs(filtered);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, docs, filterStatus]);

  // Handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doc: Document) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoc(doc);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoc(null);
  };

  // Handle document view
  const handleViewDocument = (doc: Document) => {
    // Implement document viewing logic
    console.log("Viewing document:", doc);
    handleMenuClose();
  };

  // Handle document download
  const handleDownloadDocument = (doc: Document) => {
    // Implement document download logic
    console.log("Downloading document:", doc);
    handleMenuClose();
  };

  // Handle page change
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle filter status change
  const handleFilterStatusChange = (_: React.SyntheticEvent, newValue: "all" | "indexed" | "not-indexed") => {
    setFilterStatus(newValue);
  };

  // Render loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <GavelRounded sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Legal Document Repository
          </Typography>
        </Box>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Skeleton variant="rectangular" width={240} height={40} />
            <Skeleton variant="rectangular" width={120} height={40} />
          </Box>
          <Skeleton variant="rectangular" height={52} sx={{ mb: 1 }} />
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={53} sx={{ my: 1 }} />
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Skeleton variant="rectangular" width={240} height={40} />
          </Box>
        </Paper>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <GavelRounded sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Legal Document Repository
          </Typography>
        </Box>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: 28 }
          }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<Refresh />}
              onClick={fetchDocuments}
            >
              Retry
            </Button>
          }
        >
          <Typography variant="subtitle1" fontWeight="medium">{error}</Typography>
          <Typography variant="body2">There was a problem retrieving your documents. Please check your connection and try again.</Typography>
        </Alert>
      </Container>
    );
  }

  // Render empty state
  if (filteredDocs.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <GavelRounded sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Legal Document Repository
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <TextField
            placeholder="Search documents..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <Cancel fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ width: { xs: '100%', sm: 300 } }}
          />
          
          <Box sx={{ display: 'flex' }}>
            <Tabs value={filterStatus} onChange={handleFilterStatusChange} sx={{ minHeight: 40 }}>
              <Tab 
                label="All" 
                value="all" 
                sx={{ 
                  minHeight: 40, 
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }} 
              />
              <Tab 
                label="Indexed" 
                value="indexed" 
                sx={{ 
                  minHeight: 40, 
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }} 
              />
              <Tab 
                label="Not Indexed" 
                value="not-indexed" 
                sx={{ 
                  minHeight: 40, 
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }} 
              />
            </Tabs>
          </Box>
        </Box>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            textAlign: 'center',
            backgroundColor: 'background.paper',
            border: '1px dashed',
            borderColor: 'divider'
          }}
        >
          <Description sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
          <Typography variant="h6" gutterBottom>No Documents Found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
            {searchTerm || filterStatus !== "all" 
              ? "No documents match your current search criteria. Try adjusting your filters or search terms."
              : "There are no documents in your repository yet. Upload documents to get started."}
          </Typography>
          {searchTerm || filterStatus !== "all" ? (
            <Button 
              variant="outlined" 
              startIcon={<Refresh />}
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
            >
              Clear Filters
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate("/upload")} // Assuming there's an upload page
            >
              Upload Documents
            </Button>
          )}
        </Paper>
      </Container>
    );
  }

  // Calculate pagination
  const paginatedDocs = filteredDocs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Render table view
  const renderTableView = () => (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.dark' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Description fontSize="small" sx={{ mr: 1 }} />
                Index ID
              </Box>
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person fontSize="small" sx={{ mr: 1 }} />
                Username
              </Box>
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FolderOpen fontSize="small" sx={{ mr: 1 }} />
                File Path
              </Box>
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                Status
              </Box>
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedDocs.map((doc) => (
            <TableRow 
              key={doc.indexid}
              sx={{ 
                '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                '&:hover': { backgroundColor: 'action.selected' },
                transition: 'background-color 0.2s'
              }}
            >
              <TableCell 
                sx={{ 
                  fontFamily: 'monospace', 
                  fontWeight: 'medium',
                  color: 'primary.main'
                }}
              >
                {doc.indexid}
              </TableCell>
              <TableCell>{doc.username}</TableCell>
              <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <Tooltip title={doc.filepath.replace(/\\/g, "/")}>
                  <Typography variant="body2" noWrap>
                    {doc.filepath.replace(/\\/g, "/")}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                {doc.isIndexed ? (
                  <Chip 
                    label="Indexed" 
                    color="success" 
                    size="small" 
                    icon={<CheckCircle fontSize="small" />}
                    sx={{ fontWeight: 'medium' }}
                  />
                ) : (
                  <Chip 
                    label="Not Indexed" 
                    color="error" 
                    size="small" 
                    icon={<Cancel fontSize="small" />}
                    sx={{ fontWeight: 'medium' }}
                  />
                )}
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title="View Document">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download Document">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleDownloadDocument(doc)}
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                 
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredDocs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );

  // Render card view
  const renderCardView = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
      {paginatedDocs.map((doc) => (
        <Card 
          key={doc.indexid} 
          elevation={2}
          sx={{ 
            borderRadius: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" component="div" noWrap sx={{ maxWidth: '80%' }}>
                {doc.filepath.split('/').pop() || doc.filepath.split('\\').pop()}
              </Typography>
              <IconButton 
                size="small"
                onClick={(e) => handleMenuOpen(e, doc)}
                sx={{ mt: -1, mr: -1 }}
              >
                <MoreVert />
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <Box component="span" sx={{ fontWeight: 'bold', display: 'inline-block', width: 80 }}>ID:</Box>
              <Box component="span" sx={{ fontFamily: 'monospace' }}>{doc.indexid}</Box>
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <Box component="span" sx={{ fontWeight: 'bold', display: 'inline-block', width: 80 }}>User:</Box>
              {doc.username}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <Box component="span" sx={{ fontWeight: 'bold', display: 'inline-block', width: 80 }}>Path:</Box>
              <Tooltip title={doc.filepath.replace(/\\/g, "/")}>
                <Box component="span" sx={{ display: 'inline-block', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'bottom' }}>
                  {doc.filepath.replace(/\\/g, "/")}
                </Box>
              </Tooltip>
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {doc.isIndexed ? (
                <Chip 
                  label="Indexed" 
                  color="success" 
                  size="small" 
                  icon={<CheckCircle fontSize="small" />}
                  sx={{ fontWeight: 'medium' }}
                />
              ) : (
                <Chip 
                  label="Not Indexed" 
                  color="error" 
                  size="small" 
                  icon={<Cancel fontSize="small" />}
                  sx={{ fontWeight: 'medium' }}
                />
              )}
              
              <Box>
                <Tooltip title="View Document">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewDocument(doc)}
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download Document">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleDownloadDocument(doc)}
                  >
                    <Download />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
      
      <Box sx={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={filteredDocs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <GavelRounded sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Legal Document Repository
        </Typography>
      </Box>
      
      {/* Search and filters */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        <TextField
          placeholder="Search documents..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <Cancel fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ width: { xs: '100%', sm: 300 } }}
        />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          gap: 1
        }}>
          <Tabs 
            value={filterStatus} 
            onChange={handleFilterStatusChange} 
            sx={{ 
              minHeight: 40,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              '& .MuiTabs-indicator': {
                height: 3
              }
            }}
          >
            <Tab 
              label="All" 
              value="all" 
              sx={{ 
                minHeight: 40, 
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }} 
            />
            <Tab 
              label="Indexed" 
              value="indexed" 
              sx={{ 
                minHeight: 40, 
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }} 
            />
            <Tab 
              label="Not Indexed" 
              value="not-indexed" 
              sx={{ 
                minHeight: 40, 
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }} 
            />
          </Tabs>
          
          <Tooltip title={viewMode === "table" ? "Switch to Card View" : "Switch to Table View"}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
              sx={{ minWidth: 40, px: 1 }}
            >
              {viewMode === "table" ? "Cards" : "Table"}
            </Button>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Results summary */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredDocs.length} {filteredDocs.length === 1 ? 'document' : 'documents'}
          {searchTerm && ` matching "${searchTerm}"`}
          {filterStatus !== "all" && ` (${filterStatus === "indexed" ? "Indexed" : "Not Indexed"})`}
        </Typography>
        
        <Button
          size="small"
          startIcon={<Refresh />}
          onClick={fetchDocuments}
        >
          Refresh
        </Button>
      </Box>
      
      {/* Document list */}
      {viewMode === "table" ? renderTableView() : renderCardView()}
      
      {/* Document actions menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedDoc && handleViewDocument(selectedDoc)}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Document
        </MenuItem>
        <MenuItem onClick={() => selectedDoc && handleDownloadDocument(selectedDoc)}>
          <Download fontSize="small" sx={{ mr: 1 }} />
          Download
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <SortByAlpha fontSize="small" sx={{ mr: 1 }} />
          Reindex Document
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default ViewDocs;
