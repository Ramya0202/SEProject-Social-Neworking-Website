const API_URI = "http://localhost:8080";
const BUCKET_URI = `${API_URI}/images/`;
const METHOD = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
};

const YEAR_OF_STUDY = [
  {
    id: 1,
    year: "2018",
  },
  {
    id: 2,
    year: "2019",
  },
  {
    id: 3,
    year: "2020",
  },
  {
    id: 4,
    year: "2021",
  },
  {
    id: 5,
    year: "2022",
  },
  {
    id: 6,
    year: "2023",
  },
];

const DEPARTMENT = [
  {
    id: 1,
    name: "Computer Science",
  },
  {
    id: 2,
    name: "Data Science",
  },
  {
    id: 3,
    name: "Cyber Security",
  },
  {
    id: 4,
    name: "Information Science",
  },
  {
    id: 5,
    name: "Electrical and Computer Engineering",
  },
];

export { API_URI, BUCKET_URI, YEAR_OF_STUDY, DEPARTMENT, METHOD };
