import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import outputs from '../amplify_outputs.json';
import App from './App.tsx'
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Authenticator.Provider>
        <App />
      </Authenticator.Provider>
    </StrictMode>,
  )
}
