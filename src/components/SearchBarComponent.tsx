import SearchIcon from "@mui/icons-material/Search";
import { Box, BoxProps, InputAdornment, TextField } from "@mui/material";
import { FormEvent, useState } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";

const SearchBarComponent = () => {
  const [params] = useSearchParams();
  const [query, setQuery] = useState<string>(params.get('q') ?? '');

  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
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
      <TextField
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
};

export default SearchBarComponent;
