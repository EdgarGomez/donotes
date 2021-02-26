const userId = 2;
const fetcher = (...args) => fetch(...args).then((res) => res.json());
const { data, error } = useSWR(
  //"http://localhost:3004/lists?_embed=todos",
  "http://localhost:3004/notes",
  fetcher
);
if (error) return <div>failed to load</div>;
if (!data) return <div>loading...</div>;
