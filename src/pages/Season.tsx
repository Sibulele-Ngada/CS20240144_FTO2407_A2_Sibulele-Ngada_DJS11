import { useState } from "react";
import { getShow } from "../api";

export default function Season() {
  const [currentShow, setCurrentShow] = useState<Show>();

  return <h1>Season Stuff</h1>;
}
