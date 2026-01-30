
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import BradyPlayoffs from './components/BradyPlayoffs';
import RegistrationPage from './components/RegistrationPage';
import CommissionerArea from './components/CommissionerArea';
import BradyBowlPage from './components/BradyBowlPage';
import DivisionalLeaguePage from './components/DivisionalLeaguePage';
import GlobalRanking2025 from './components/GlobalRanking2025';
import BradyGeneralPlayoffs from './components/BradyGeneralPlayoffs';
import SleeperLeaguePage from './components/SleeperLeaguePage';
import RegulationPage from './components/RegulationPage';
import HallOfFame from './components/HallOfFame';
import { fetchLeagueData, fetchLeagueInfo } from './services/sleeper';
import { League } from './types';

// IDs OFICIAIS DA BRADY BOWL (21 Ligas Consolidadas)
export const FWL_BRADY_IDS = [
  '1232712391108612096', // Atlanta
  '1227148843859062784', // Baltimore (ID CORRIGIDO)
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
  '1208795273556398080',
  '1232706687903727616',
  '1232711487856844800'
];

// ID DA LIGA ALABAMA (Divisional)
export const ALABAMA_ID = '1204159865153388544';

// LISTA TOTAL CONSOLIDADA PARA O DASHBOARD/RANKING + LIGA ID 12
export const FWL_OFFICIAL_IDS = [
  ...FWL_BRADY_IDS,
  '1204160977872883712',
  '12',
  ALABAMA_ID
];

export const FWL_LEAGUES: { id: string, name: string, type: 'brady' | 'divisional' }[] = FWL_OFFICIAL_IDS.map((id, index) => {
  const isBrady = FWL_BRADY_IDS.includes(id);
  let name = '';
  
  if (id === '12') {
    name = 'Liga de Teste (ID 12)';
    return { id, name, type: 'divisional' };
  }

  if (isBrady) {
    if (id === FWL_BRADY_IDS[0]) name = 'FWL 2025 - Brady Bowl (Atlanta)';
    else if (id === FWL_BRADY_IDS[1]) name = 'FWL 2025 - Brady Bowl (Baltimore)';
    else name = `FWL 2025 - Brady Bowl (Division ${index + 1})`;
  } else {
    name = `FWL 2025 - Divisional D${index - FWL_BRADY_IDS.length + 1}`;
  }

  return {
    id,
    name,
    type: isBrady ? 'brady' : 'divisional' as const
  };
});

const FWL_IDENTITY_LEAGUE_ID = FWL_BRADY_IDS[0];
const FWL_LOGO_SOURCE_ID = '1308130620014096384';
const PLAYOFFS_CHALLENGE_LOGO_ID = '1314010987120066560';
const DIVISIONAL_LOGO_SOURCE_ID = '1312539231599472640';
const RANKING_SOURCE_LEAGUE_ID = '1314010987120066560';
const FINALS_LEAGUE_ID = FWL_BRADY_IDS[0];

type ViewState = 'landing' | 'dashboard' | 'playoffs' | 'registration' | 'admin' | 'brady-list' | 'divisional-list' | 'ranking-global' | 'brady-playoffs-geral' | 'league-lookup' | 'regulation' | 'hall-of-fame';

const App: React.FC = () => {
  const [history, setHistory] = useState<ViewState[]>(['landing']);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [regulationIconAvatar, setRegulationIconAvatar] = useState<string | null>(null);
  const [rankingIconAvatar, setRankingIconAvatar] = useState<string | null>(null);
  const [fwlLogoAvatar, setFwlLogoAvatar] = useState<string | null>(null);
  const [atlantaLeagueAvatar, setAtlantaLeagueAvatar] = useState<string | null>(null);
  const [playoffsChallengeAvatar, setPlayoffsChallengeAvatar] = useState<string | null>(null);
  const [divisionalLeagueAvatar, setDivisionalLeagueAvatar] = useState<string | null>(null);
  // O App não bloqueia mais a renderização inicial para carregar logos
  const [isAssetsLoading, setIsAssetsLoading] = useState(true);

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
        setIsAssetsLoading(false);
      }
    };
    loadIdentity();
  }, []);

  const handleSelectLeague = (id: string) => {
    setSelectedLeagueId(id);
    pushView('dashboard');
  };

  const handleLookupLeague = (id: string) => {
    setSelectedLeagueId(id);
    pushView('league-lookup');
  };

  return (
    <>
      {currentView === 'playoffs' && <BradyPlayoffs leagues={leaguesData.filter(l => FWL_BRADY_IDS.includes(l.league_id))} onBack={popView} />}
      {currentView === 'dashboard' && selectedLeagueId && <Dashboard leagueId={selectedLeagueId} onBack={popView} />}
      {currentView === 'registration' && <RegistrationPage onBack={popView} onAdmin={() => pushView('admin')} />}
      {currentView === 'admin' && <CommissionerArea onBack={popView} />}
      {currentView === 'brady-list' && <BradyBowlPage onBack={popView} onSelectLeague={handleSelectLeague} onOpenGeneralPlayoffs={() => pushView('brady-playoffs-geral')} />}
      {currentView === 'divisional-list' && <DivisionalLeaguePage onBack={popView} onSelectLeague={handleSelectLeague} />}
      {currentView === 'ranking-global' && <GlobalRanking2025 onBack={popView} />}
      {currentView === 'brady-playoffs-geral' && <BradyGeneralPlayoffs onBack={popView} />}
      {currentView === 'league-lookup' && selectedLeagueId && <SleeperLeaguePage leagueId={selectedLeagueId} onBack={popView} />}
      {currentView === 'regulation' && <RegulationPage onBack={popView} />}
      {currentView === 'hall-of-fame' && <HallOfFame onBack={popView} />}

      {currentView === 'landing' && (
        <LandingPage 
          leagues={leaguesData.map(l => ({ id: l.league_id, name: l.name, avatar: l.avatar }))} 
          onSelect={handleSelectLeague}
          onOpenPlayoffs={() => pushView('playoffs')}
          onOpenRegistration={() => pushView('registration')}
          onOpenBradyBowl={() => pushView('brady-list')}
          onOpenDivisionalLeague={() => pushView('divisional-list')}
          onOpenRanking={() => pushView('ranking-global')}
          onOpenRegulation={() => pushView('regulation')}
          onOpenHallOfFame={() => pushView('hall-of-fame')}
          onLookupLeague={handleLookupLeague}
          fwlLogoAvatar={fwlLogoAvatar}
          atlantaLeagueAvatar={atlantaLeagueAvatar}
          playoffsChallengeAvatar={playoffsChallengeAvatar}
          divisionalLeagueAvatar={divisionalLeagueAvatar}
          rankingIconAvatar={rankingIconAvatar}
          finalsLogoAvatar={null}
          finalsLeagueId={FINALS_LEAGUE_ID}
          regulationIconAvatar={regulationIconAvatar}
        />
      )}
    </>
  );
};

export default App;
