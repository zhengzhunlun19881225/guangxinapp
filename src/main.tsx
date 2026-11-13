import {createRoot} from 'react-dom/client';
import App from './App';
import './styles.css';
import './mobile-spec.css';
import './section-titles.css';
import './main-page-backgrounds.css';
import './components/CloseButton.css';
import './components/PillTabs.css';
import './desktop-workspace.css';
import './page-spacing.css';

createRoot(document.getElementById('root')!).render(<App/>);
