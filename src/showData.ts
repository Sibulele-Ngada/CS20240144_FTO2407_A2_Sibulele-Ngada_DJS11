import { getShow } from "./api";
import { Show } from "./types";

const individualID = [
  10716, 5675, 5279, 10539, 9177, 6807, 8514, 10276, 8860, 5629, 5012, 9054,
  7654, 8364, 6631, 9664, 8256, 8291, 5718, 5276, 8188, 9687, 5964, 9702, 9665,
  9041, 6465, 6756, 5702, 9620, 5320, 6717, 10182, 9695, 6451, 5968, 5692, 9994,
  10758, 9705, 10934, 9694, 9263, 8760, 9693, 9704, 10660, 6430, 9739, 9666,
  9691,
];

export const showData: Show[] = [];

async function getNewShow(id: string) {
  try {
    const newShow = await getShow(id);
    showData.push(newShow);
    return newShow;
  } catch (err) {
    console.log(err);
  }
}

for (const id of individualID) {
  getNewShow(id.toString());
}
