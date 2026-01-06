
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import BradyPlayoffs from './components/BradyPlayoffs';
import RegistrationPage from './components/RegistrationPage';
import CommissionerArea from './components/CommissionerArea';
import BradyBowlPage from './components/BradyBowlPage';
import DivisionalLeaguePage from './components/DivisionalLeaguePage';
import GlobalRanking2025 from './components/GlobalRanking2025';
import { fetchLeagueData, fetchLeagueInfo } from './services/sleeper';
import { League } from './types';

// IDs OFICIAIS DA BRADY BOWL
export const FWL_BRADY_IDS = [
  '1232712391108612096', // Atlanta
  '1312531415799205888'  // Baltimore
];

// ID DA LIGA ALABAMA (Divisional)
export const ALABAMA_ID = '1204159865153388544';

// LISTA OFICIAL DE IDS
export const FWL_OFFICIAL_IDS = [
  ...FWL_BRADY_IDS,
  '1204160977872883712',
  ALABAMA_ID,
  '1227148843859062784',
  '1208790166441840640',
  '1208794512017600512',
  '1232712789961752576',
  '1208795936831045632',
  '1232708700569870337',
  '1208789004187598848',
  '1208795656680906752',
  '1232709253005836288',
  '1232708223719460864',
  '1227147929278484480',
  '1208783620852948992',
  '1208793711744405504',
  '1208794950024581120',
  '1232707452298870784',
  '1232711908889473024',
  '1208789644955615232',
  '1208795273556398080'
];

export const FWL_LEAGUES: { id: string, name: string, type: 'brady' | 'divisional' }[] = FWL_OFFICIAL_IDS.map((id, index) => {
  const isBrady = FWL_BRADY_IDS.includes(id);
  return {
    id,
    name: isBrady 
      ? `FWL 2025 - Brady Bowl (${id === FWL_BRADY_IDS[0] ? 'Atlanta' : 'Baltimore'})` 
      : `FWL 2025 - Divisional D${index - FWL_BRADY_IDS.length + 1}`,
    type: isBrady ? 'brady' : 'divisional' as const
  };
});

const FWL_IDENTITY_LEAGUE_ID = FWL_BRADY_IDS[0];
const FWL_LOGO_SOURCE_ID = '1308130620014096384';
const PLAYOFFS_CHALLENGE_LOGO_ID = '1314010987120066560';
const DIVISIONAL_LOGO_SOURCE_ID = '1312539231599472640';
const RANKING_SOURCE_LEAGUE_ID = '1314010987120066560';
const FINALS_LEAGUE_ID = FWL_BRADY_IDS[0];

type ViewState = 'landing' | 'dashboard' | 'playoffs' | 'registration' | 'admin' | 'brady-list' | 'divisional-list' | 'ranking-global';

const App: React.FC = () => {
  const [history, setHistory] = useState<ViewState[]>(['landing']);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [regulationIconAvatar, setRegulationIconAvatar] = useState<string | null>(null);
  const [rankingIconAvatar, setRankingIconAvatar] = useState<string | null>(null);
  const [fwlLogoAvatar, setFwlLogoAvatar] = useState<string | null>(null);
  const [atlantaLeagueAvatar, setAtlantaLeagueAvatar] = useState<string | null>(null);
  const [playoffsChallengeAvatar, setPlayoffsChallengeAvatar] = useState<string | null>(null);
  const [divisionalLeagueAvatar, setDivisionalLeagueAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const currentView = history[history.length - 1];

  const pushView = (view: ViewState) => setHistory(prev => [...prev, view]);
  const popView = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const leaguesData: League[] = FWL_LEAGUES.map(l => ({
    league_id: l.id,
    name: l.name,
    season: '2025',
    status: 'active',
    total_rosters: 12,
    settings: { max_keepers: 0, type: 2, leg: 17, playoff_week_start: 15 },
    avatar: null,
    previous_league_id: null
  }));

  useEffect(() => {
    const loadIdentity = async () => {
      setLoading(true);
      try {
        const [logoLeagueData, atlantaInfo, playoffsInfo, divisionalInfo, regulationData, rankingData] = await Promise.all([
          fetchLeagueInfo(FWL_LOGO_SOURCE_ID).catch(() => null),
          fetchLeagueInfo(FWL_BRADY_IDS[0]).catch(() => null),
          fetchLeagueInfo(PLAYOFFS_CHALLENGE_LOGO_ID).catch(() => null),
          fetchLeagueInfo(DIVISIONAL_LOGO_SOURCE_ID).catch(() => null),
          fetchLeagueData(FWL_IDENTITY_LEAGUE_ID).catch(() => null),
          fetchLeagueData(RANKING_SOURCE_LEAGUE_ID).catch(() => null)
        ]);

        if (logoLeagueData) setFwlLogoAvatar(logoLeagueData.avatar);
        if (atlantaInfo) setAtlantaLeagueAvatar(atlantaInfo.avatar);
        if (playoffsInfo) setPlayoffsChallengeAvatar(playoffsInfo.avatar);
        if (divisionalInfo) setDivisionalLeagueAvatar(divisionalInfo.avatar);

        if (regulationData) {
          const roster1 = regulationData.rosters.find(r => r.roster_id === 1) || regulationData.rosters[0];
          if (roster1) {
            const user1 = regulationData.users.find(u => u.user_id === roster1.owner_id);
            setRegulationIconAvatar(user1?.metadata?.avatar || user1?.avatar || null);
          }
        }

        if (rankingData) {
          const team1 = rankingData.rosters.find(r => r.roster_id === 1);
          if (team1) {
            const user1 = rankingData.users.find(u => u.user_id === team1.owner_id);
            setRankingIconAvatar(user1?.metadata?.avatar || user1?.avatar || null);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadIdentity();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1d] space-y-6 text-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <div>
          <h2 className="text-white font-black text-xl uppercase tracking-[0.3em] italic">FWL 2025</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Carregando Configurações Oficiais</p>
        </div>
      </div>
    );
  }

  const handleSelectLeague = (id: string) => {
    setSelectedLeagueId(id);
    pushView('dashboard');
  };

  if (currentView === 'playoffs') return <BradyPlayoffs leagues={leaguesData} onBack={popView} />;
  if (currentView === 'dashboard' && selectedLeagueId) return <Dashboard leagueId={selectedLeagueId} onBack={popView} />;
  if (currentView === 'registration') return <RegistrationPage onBack={popView} onAdmin={() => pushView('admin')} />;
  if (currentView === 'admin') return <CommissionerArea onBack={popView} />;
  if (currentView === 'brady-list') return <BradyBowlPage onBack={popView} onSelectLeague={handleSelectLeague} />;
  if (currentView === 'divisional-list') return <DivisionalLeaguePage onBack={popView} onSelectLeague={handleSelectLeague} />;
  if (currentView === 'ranking-global') return <GlobalRanking2025 onBack={popView} />;

  return (
    <LandingPage 
      leagues={leaguesData.map(l => ({ id: l.league_id, name: l.name, avatar: l.avatar }))} 
      onSelect={handleSelectLeague}
      onOpenPlayoffs={() => pushView('playoffs')}
      onOpenRegistration={() => pushView('registration')}
      onOpenBradyBowl={() => pushView('brady-list')}
      onOpenDivisionalLeague={() => pushView('divisional-list')}
      onOpenRanking={() => pushView('ranking-global')}
      fwlLogoAvatar={fwlLogoAvatar}
      atlantaLeagueAvatar={atlantaLeagueAvatar}
      playoffsChallengeAvatar={playoffsChallengeAvatar}
      divisionalLeagueAvatar={divisionalLeagueAvatar}
      rankingIconAvatar={rankingIconAvatar}
      finalsLogoAvatar={null}
      finalsLeagueId={FINALS_LEAGUE_ID}
      regulationIconAvatar={regulationIconAvatar}
    />
  );
};

export default App;
