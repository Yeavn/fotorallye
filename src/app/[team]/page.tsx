import TeamClient from "./TeamClient";

export default function Page({ params }: { params: { team: string } }) {
  return <TeamClient team={params.team} />;
}
