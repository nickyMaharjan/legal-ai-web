import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // To access passed data
import { SearchResult, SearchResultItem } from "../types/SearchResult";
import * as ApiPath from "../utils/api.url";
import { FetchState } from "../types/FetchState";

const SearchResultComponent = () => {
  const [params] = useSearchParams();
  const [result, setResult] = useState<FetchState<SearchResult>>({
    state: "uninitialized",
  });

  // Fetch results from the backend
  const fetchResults = async (searchTerm: string) => {
    if (!params.has("q")) {
      return;
    }
    try {
      setResult({ state: "loading" });

      const response = await axios.get(ApiPath.SEARCH_URL, {
        headers: { "Content-Type": "application/json" },
        params: { q: searchTerm }, // Assuming search query is passed as a parameter
      });
      console.log({ data: response.data });

      const docs = response.data;
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
            } satisfies SearchResultItem)
        ),
      };

      setResult({
        state: "loaded",
        data: vm,
      }); // Update filtered data with response
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResult({
        state: "error",
        error,
      }); // Handle error by clearing the filtered data
    }
  };

  useEffect(() => {
    const q = params.get("q");
    q && fetchResults(q);
  }, [params]);

  return (
    <Box sx={{ p: 4 }}>
      {result.state === "error" && (
        <Box>{result.error?.message || "Error Occurred."}</Box>
      )}
      {result.state === "uninitialized" && <Box>Try searching something.</Box>}
      {result.state === "loading" && <Box>Loading...</Box>}
      {result.state === "loaded" &&
        result.data?.results.map((item, index) => (
          <Paper sx={{ p: 3, mb: 2, textAlign: "left" }} key={index}>
            <Typography variant="h6">{item.data.title}</Typography>
            <Typography variant="body1" sx={{ color: "#666" }}>
              <strong>Section: </strong>
              {item.data.section}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>HTML Link: </strong>
              <a
                href={`${ApiPath.API_URL}${item.data.html}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.data.html}
              </a>
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, display: "flex", alignItems: "center" }}
            >
              <strong>PDF Link: </strong>&nbsp;
              <a
                href={item.data.pdf}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {item.data.pdf}
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={() => window.open(item.data.pdf, "_blank")}
                  aria-label="open pdf"
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </a>
            </Typography>
          </Paper>
        ))}
    </Box>
  );
};

export default SearchResultComponent;
