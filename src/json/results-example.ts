{
  /* Example done by Sanjeev dai */
}

/*
import { SearchResult } from "../types/SearchResult";

const titles = ["1", "2", "3"];
const docs = ["1", "2", "3"];
const section = ["1:1", "1:2", "2:1", "2:2", "3:1", "3:2"];

const repo: { t: string; d: string; s: string }[] = [];
docs.forEach((d) =>
  titles.forEach((t) =>
    section.forEach((s) => {
      repo.push({ d, t, s });
    })
  )
);

const page = 0;
const size = 4;
const total = repo.length;

const results: SearchResult = {
  pagination: {
    page: page,
    size: size,
    total: total,
    get hasNext() {
      // or page * size <= total
      return (page + 1) * size <= total;
    },
    get hasPrevious() {
      return page > 0; // assuming 0 is the first page
    },
  },
  results: repo.slice(0, 20).map(({ d, t, s }) => ({
    _metadata: { docId: d, sectionId: s },
    data: {
      title: `Title ${t}`,
      html: "https://www.example.com",
      pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      section: `Section ${s} in Document ${d}`,
    },
  })),
};

export default results;

*/

import { SearchResult } from "../types/SearchResult";

const titles = [
  "Descriptive Legal Research",
  "Quantitative Legal Research",
  "Qualitative Legal Research",
  "Analytical Legal Research",
];

const docs = ["1", "2", "3", "4"];
const sectionNames = [
  { id: "1", name: "Introduction" },
  { id: "2", name: "Background" },
  { id: "3", name: "Methodology" },
  { id: "4", name: "Analysis" },
  { id: "5", name: "Conclusion" },
  { id: "6", name: "Recommendations" },
];

const repo: { t: string; d: string; s: { id: string; name: string } }[] = [];
docs.forEach((d) =>
  titles.forEach((t) =>
    sectionNames.forEach((s) => {
      repo.push({ d, t, s });
    })
  )
);

const page = 0;
const size = 4;
const total = repo.length;

const results: SearchResult = {
  pagination: {
    page: page,
    size: size,
    total: total,
    get hasNext() {
      return (page + 1) * size <= total;
    },
    get hasPrevious() {
      return page > 0;
    },
  },
  results: repo.slice(0, 20).map(({ d, t, s }) => ({
    _metadata: { docId: d, sectionId: s.id },
    data: {
      title: t,
      html: "https://www.w3schools.com",
      pdf: "https://pdfobject.com/pdf/sample.pdf",
      section: `${s.name}  of ${t}`,
    },
  })),
};

export default results;
