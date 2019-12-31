import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';

// import './index.scss';
import registerServiceWorker from './registerServiceWorker';
import Routers from './router';
// import Upload from './pages/upload'
// import Picture from './pages/picture/index';

ReactDOM.render(
  <Routers />,
  // <Upload />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
