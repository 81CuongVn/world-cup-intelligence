import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './lib/i18n/I18nContext';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { MatchPage } from './pages/MatchPage';
import { TeamPage } from './pages/TeamPage';
import { PlayerPage } from './pages/PlayerPage';
import { LineupPage } from './pages/LineupPage';
import { NewsIntelligencePage } from './pages/NewsIntelligencePage';
import { NewsArticlePage } from './pages/NewsArticlePage';
import { GuidePage } from './pages/GuidePage';
import { MatchAnalysisPage } from './pages/MatchAnalysisPage';
import { MatchesPage } from './pages/MatchesPage';
import { TournamentsHubPage } from './pages/TournamentsHubPage';

export default function App() {
  return (
    <I18nProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/tournaments" element={<Navigate to="/" replace />} />
          <Route path="/matches/:matchId/analysis" element={<MatchAnalysisPage />} />
          <Route path="/matches/:matchId" element={<MatchPage />} />
          <Route path="/tournaments" element={<TournamentsHubPage />} />
          <Route path="/teams/:teamId" element={<TeamPage />} />
          <Route path="/players/:playerId" element={<PlayerPage />} />
          <Route path="/lineups/:matchId" element={<LineupPage />} />
          <Route path="/news-intelligence" element={<NewsIntelligencePage />} />
          <Route path="/news-intelligence/:articleId" element={<NewsArticlePage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/analyst/simulator" element={<Navigate to="/" replace />} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </I18nProvider>
  );
}
