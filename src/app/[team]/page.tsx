import TeamClient from "./teamClient";

export default function Page({ params }: { params: { team: string } }) {
  return <TeamClient team={params.team} />;
}
//
