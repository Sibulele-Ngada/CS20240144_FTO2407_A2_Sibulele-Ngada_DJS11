export async function getShow(id: string) {
  return fetch(`https://podcast-api.netlify.app/id/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error(`Error fetching show`);
      return res.json();
    })
    .then((data) => data);
}

export async function getPreviews() {
  return fetch("https://podcast-api.netlify.app")
    .then((res) => {
      if (!res.ok) throw new Error(`Error fetching previews`);
      return res.json();
    })
    .then((data) => data);
}
// fetch("https://podcast-api.netlify.app/genre/1")
//   .then((res) => {
//     if (!res.ok) throw new Error();
//     return res.json();
//   })
//   .then((data) => console.log(data))
//   .catch(() => console.log(`Error fetching genre`));
