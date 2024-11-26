export async function getShow(id: string) {
  return fetch(`https://podcast-api.netlify.app/id/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then((data) => data);
}
