import { Welcome } from "../welcome/welcome";

export function meta() {
  return [
    { title: "Chime" },
    { name: "description", content: "Welcome to Chime" },
  ];
}

export default function Home() {
  return <Welcome />;
}
