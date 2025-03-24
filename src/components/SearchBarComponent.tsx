import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";
import { FormEvent, useState } from "react";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.10),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.2),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const SearchBarComponent = () => {
  const [params] = useSearchParams();
  const [query, setQuery] = useState<string>(params.get("q") ?? "");
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return; // it will empty search submissions
    navigate(
      {
        pathname: "/search",
        search: createSearchParams({
          q: query,
        }).toString(),
      },
      {
        replace: true,
      }
    );
  };

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon fontSize="small" sx={{ color: "#003366" }} />
        </SearchIconWrapper>

        <StyledInputBase
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Search..."
          inputProps={{ "aria-label": "Search" }}
        />
      </Search>
    </Box>
  );
};

export default SearchBarComponent;
