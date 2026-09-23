import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WorldPage from './pages/WorldPage';
import PeoplePage from './pages/PeoplePage';
import EventsPage from './pages/EventsPage';
import RelationshipsPage from './pages/RelationshipsPage';
import TimelinePage from './pages/TimelinePage';
import GodConsolePage from './pages/GodConsolePage';
import SettingsPage from './pages/SettingsPage';
import AppShell from './components/layout/AppShell';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/world/:worldId" element={<AppShell />}>
        <Route index element={<WorldPage />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="relationships" element={<RelationshipsPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="console" element={<GodConsolePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
