"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Box,
  IconButton,
  Typography,
  Container,
  Skeleton,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Grid,
  Fade,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material"
import {
  PictureAsPdf as PictureAsPdfIcon,
  Code as CodeIcon,
  Search as SearchIcon,
  OpenInNew as OpenInNewIcon,
  ContentCopy as ContentCopyIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ErrorOutline as ErrorOutlineIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
} from "@mui/icons-material"
import type { SearchResult, SearchResultItem } from "../types/SearchResult"
import * as ApiPath from "../utils/api.url"
import type { FetchState } from "../types/FetchState"
import { axiosWithLogin } from "../utils/api.client"

const SearchResultComponent = () => {
  const [params] = useSearchParams()
  const [result, setResult] = useState<FetchState<SearchResult>>({
    state: "uninitialized",
  })
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([])
  const theme = useTheme()

  // Fetch results from the backend
  const fetchResults = async (searchTerm: string) => {
    if (!params.has("q")) {
      return
    }
    try {
      setResult({ state: "loading" })

      const response = await axiosWithLogin.get(ApiPath.SEARCH_URL, {
        headers: { "Content-Type": "application/json" },
        params: { q: searchTerm },
      })
      console.log({ data: response.data })

      const docs = response.data
      const vm: SearchResult = {
        pagination: {
          page: 0,
          size: 0,
          total: 0,
          hasNext: true,
          hasPrevious: true,
        },
        results: docs.map(
          (d: any) =>
            ({
              _metadata: {
                docId: d.doc.metadata["doc:docNumber"],
                sectionId: d.doc.metadata["section:id"],
              },
              data: {
                html: d.htm,
                pdf: d.pdf,
                section: d.doc.page_content,
                title: d.doc.metadata["doc:title"],
              },
            }) satisfies SearchResultItem,
        ),
      }

      setResult({
        state: "loaded",
        data: vm,
      })
    } catch (error) {
      console.error("Error fetching search results:", error)
      setResult({
        state: "error",
        error,
      })
    }
  }

  useEffect(() => {
    const q = params.get("q")
    q && fetchResults(q)
  }, [params])

  const toggleBookmark = (docId: string) => {
    setBookmarkedItems((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  // Render loading skeletons
  const renderSkeletons = () => (
    <Box sx={{ mt: 2 }}>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}>
          <LinearProgress sx={{ height: 4 }} />
          <CardContent>
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} />
            <Skeleton variant="text" width="85%" height={20} />
            <Skeleton variant="text" width="40%" height={20} />
            <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
              <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )

  // Render empty state
  const renderEmptyState = () => (
    <Fade in={true}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          textAlign: "center",
        }}
      >
        <SearchIcon sx={{ fontSize: 60, color: "primary.main", opacity: 0.7, mb: 2 }} />
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Start Your Legal Research
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mb: 4 }}>
          Enter keywords or phrases in the search box above to find relevant legal documents and sections.
        </Typography>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          onClick={() => {
            // Focus on search input - you might need to add an ID to your search input
            document.getElementById("search-input")?.focus()
          }}
        >
          Try Searching Now
        </Button>
      </Box>
    </Fade>
  )

  // Render error state
  const renderErrorState = (error: any) => (
    <Fade in={true}>
      <Alert
        severity="error"
        icon={<ErrorOutlineIcon fontSize="large" />}
        sx={{
          mt: 4,
          borderRadius: 2,
          py: 2,
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexDirection: { xs: "column", sm: "row" } }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Error Retrieving Results
            </Typography>
            <Typography variant="body2">
              {error?.message || "An unexpected error occurred. Please try again."}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: { xs: 2, sm: 0 }, borderRadius: 2, textTransform: "none" }}
            onClick={() => {
              const q = params.get("q")
              q && fetchResults(q)
            }}
          >
            Try Again
          </Button>
        </Box>
      </Alert>
    </Fade>
  )

  // Render search results
  const renderResults = (data: SearchResult) => (
    <Fade in={true}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6">
            Found {data.results.length} result{data.results.length !== 1 ? "s" : ""} for "
            <Typography component="span" fontWeight="bold" color="primary.main">
              {params.get("q")}
            </Typography>
            "
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Filter results">
              <IconButton size="small" sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <FilterListIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sort results">
              <IconButton size="small" sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <SortIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {data.results.map((item, index) => {
          const isBookmarked = bookmarkedItems.includes(item._metadata.docId)
          const truncatedSection =
            item.data.section.length > 200 ? `${item.data.section.substring(0, 200)}...` : item.data.section

          return (
            <Card
              key={index}
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
                overflow: "visible",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 3,
                  pt: 2,
                  pb: 1,
                }}
              >
                <Chip
                  label={`Doc #${item._metadata.docId}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
                <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark this result"}>
                  <IconButton
                    size="small"
                    onClick={() => toggleBookmark(item._metadata.docId)}
                    color={isBookmarked ? "primary" : "default"}
                  >
                    {isBookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Box>

              <CardContent sx={{ pt: 0 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "medium",
                    color: theme.palette.primary.dark,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.data.title}
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 1,
                    position: "relative",
                  }}
                >
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {truncatedSection}
                  </Typography>
                  <Tooltip title="Copy text">
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                      }}
                      onClick={() => copyToClipboard(item.data.section)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<CodeIcon />}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        justifyContent: "flex-start",
                      }}
                      onClick={() => window.open(`${ApiPath.API_URL}${item.data.html}`, "_blank")}
                    >
                      View HTML Document
                      <OpenInNewIcon fontSize="small" sx={{ ml: "auto" }} />
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      startIcon={<PictureAsPdfIcon />}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        justifyContent: "flex-start",
                      }}
                      onClick={() => window.open(`${ApiPath.API_URL}${item.data.pdf}`, "_blank")}
                    >
                      View PDF Document
                      <OpenInNewIcon fontSize="small" sx={{ ml: "auto" }} />
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </Fade>
  )

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {result.state === "error" && renderErrorState(result.error)}
        {result.state === "uninitialized" && renderEmptyState()}
        {result.state === "loading" && renderSkeletons()}
        {result.state === "loaded" && result.data && renderResults(result.data)}
      </Box>
    </Container>
  )
}

export default SearchResultComponent
