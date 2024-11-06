import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';

import Container from './components/Container';
import { WindowProvider } from './contexts/WindowContext';
import AnimatorView from './views/Animator';
import ExportView from './views/Export';
import HomeView from './views/Home';
import KeypadView from './views/Keypad';
import PermissionsView from './views/Permissions';
import RemoteView from './views/Remote';
import SettingsView from './views/Settings';
import ShortcutsView from './views/Shortcuts';

const App = () => (
  <Container>
    <Router>
      <WindowProvider>
        <Routes>
          <Route exact path="/" element={<HomeView />} />
          <Route exact path="/settings" element={<SettingsView />} />
          <Route exact path="/shortcuts" element={<ShortcutsView />} />
          <Route exact path="/permissions" element={<PermissionsView />} />
          <Route exact path="/remote" element={<RemoteView />} />
          <Route exact path="/keypad" element={<KeypadView />} />
          <Route exact path="/animator/:id/:track" element={<AnimatorView />} />
          <Route exact path="/export/:id/:track" element={<ExportView />} />
          <Route path="*" element={<>404</>} />
        </Routes>
      </WindowProvider>
    </Router>
  </Container>
);

export default App;
