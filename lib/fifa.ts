export const FIFA_SOURCE_URL =
  "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures";

const FIFA_API_BASE = "https://api.fifa.com/api/v3";
const ID_COMPETITION = "17";
const ID_SEASON = "285023";
const ID_FIRST_STAGE = "289273";

type Localized = Array<{ Locale: string; Description: string }>;

export type FifaTeam = {
  IdTeam?: string;
  IdCountry?: string;
  Abbreviation?: string;
  ShortClubName?: string;
  PictureUrl?: string;
  TeamName?: Localized;
  Score?: number | null;
};

export type FifaMatch = {
  IdCompetition: string;
  IdSeason: string;
  IdStage: string;
  IdGroup: string | null;
  IdMatch: string;
  MatchNumber: number;
  Date: string;
  LocalDate?: string;
  StageName?: Localized;
  GroupName?: Localized;
  CompetitionName?: Localized;
  SeasonName?: Localized;
  Home?: FifaTeam;
  Away?: FifaTeam;
  HomeTeamScore?: number | null;
  AwayTeamScore?: number | null;
  HomeTeamPenaltyScore?: number | null;
  AwayTeamPenaltyScore?: number | null;
  Stadium?: {
    IdStadium?: string;
    Name?: Localized;
    CityName?: Localized;
    IdCountry?: string;
    Roof?: boolean | null;
    Capacity?: number | null;
  };
  Officials?: Array<{
    OfficialId: string;
    IdCountry?: string;
    NameShort?: Localized;
    Name?: Localized;
    TypeLocalized?: Localized;
  }>;
  MatchStatus?: number;
  ResultType?: number;
  Attendance?: number | null;
  Weather?: unknown;
  Winner?: string | null;
  MatchReportUrl?: string | null;
  PlaceHolderA?: string | null;
  PlaceHolderB?: string | null;
  TimeDefined?: boolean;
  BallPossession?: unknown;
};

export type FifaStanding = {
  IdGroup: string;
  IdTeam: string;
  Group?: Localized;
  TeamName?: Localized;
  Team?: FifaTeam;
  Position: number;
  Played: number;
  Won: number;
  Drawn: number;
  Lost: number;
  For: number;
  Against: number;
  Points: number;
  GoalDifference: number;
};

export type FifaBracketStage = {
  IdStage: string;
  SequenceOrder: number;
  Name?: Localized;
  Matches?: FifaMatch[];
};

type ResultsResponse<T> = {
  Results?: T[];
  ContinuationHash?: string | null;
  ContinuationToken?: string | null;
};

export function text(value?: Localized | null, fallback = "TBD") {
  return value?.find((item) => item.Locale.toLowerCase().startsWith("en"))?.Description ?? value?.[0]?.Description ?? fallback;
}

async function fifaFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${FIFA_API_BASE}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    },
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`FIFA API request failed: ${response.status} ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function getOfficialMatches() {
  const data = await fifaFetch<ResultsResponse<FifaMatch>>(
    `/calendar/matches?language=en&count=200&idSeason=${ID_SEASON}`
  );

  return (data.Results ?? []).sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
}

export async function getOfficialMatch(idMatch: string) {
  return fifaFetch<FifaMatch>(`/calendar/${idMatch}?language=en`);
}

export async function getOfficialStandings() {
  const data = await fifaFetch<ResultsResponse<FifaStanding>>(
    `/calendar/${ID_COMPETITION}/${ID_SEASON}/${ID_FIRST_STAGE}/standing?language=en&count=200`
  );

  return data.Results ?? [];
}

export async function getOfficialBracket() {
  const data = await fifaFetch<{ KnockoutStages?: FifaBracketStage[] }>(
    `/seasonbracket/season/${ID_SEASON}?language=en`
  );

  return (data.KnockoutStages ?? []).sort((a, b) => a.SequenceOrder - b.SequenceOrder);
}

export async function getOfficialTeams() {
  const standings = await getOfficialStandings();
  const teams = new Map<string, FifaStanding>();

  for (const row of standings) {
    teams.set(row.IdTeam, row);
  }

  return [...teams.values()].sort((a, b) => text(a.TeamName ?? a.Team?.TeamName).localeCompare(text(b.TeamName ?? b.Team?.TeamName)));
}

export function teamName(team?: FifaTeam | null) {
  return text(team?.TeamName, team?.ShortClubName ?? team?.Abbreviation ?? "TBD");
}

export function flagUrl(team?: FifaTeam | null, size = 4) {
  return team?.PictureUrl?.replace("{format}", "sq").replace("{size}", String(size)) ?? null;
}

export function matchStatusLabel(match: Pick<FifaMatch, "MatchStatus" | "Date" | "HomeTeamScore" | "AwayTeamScore">) {
  if (match.MatchStatus === 1) return "Scheduled";
  if (match.MatchStatus === 2) return "Pre-match";
  if ([3, 4, 5, 6, 7, 8, 9, 11].includes(match.MatchStatus ?? 0)) return "Live";
  if ([10, 12].includes(match.MatchStatus ?? 0)) return "Final";
  if (match.HomeTeamScore != null || match.AwayTeamScore != null) return "Result";
  return new Date(match.Date).getTime() <= Date.now() ? "Pending update" : "Scheduled";
}

export function formatDateTime(date: string, timeZone = "Asia/Kolkata") {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone
  }).format(new Date(date));
}

export function groupMatchesByDate(matches: FifaMatch[]) {
  return matches.reduce<Record<string, FifaMatch[]>>((groups, match) => {
    const key = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Kolkata"
    }).format(new Date(match.Date));
    groups[key] = [...(groups[key] ?? []), match];
    return groups;
  }, {});
}

export function groupStandings(standings: FifaStanding[]) {
  return standings.reduce<Record<string, FifaStanding[]>>((groups, row) => {
    const group = text(row.Group, "Group");
    groups[group] = [...(groups[group] ?? []), row].sort((a, b) => a.Position - b.Position);
    return groups;
  }, {});
}
