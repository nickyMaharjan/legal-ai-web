export type SearchResultItem = {
  _metadata: { docId: string; sectionId: string };
  data: {
    title: string;
    section: string;
    html: string;
    pdf: string;
  };
};

export type SearchResult = {
  pagination: {
    page: number;
    size: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  results: SearchResultItem[];
};
