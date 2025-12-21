import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { exposeDevHelpers } from './app/utils/dev-helpers';

// Exposer les helpers en développement
exposeDevHelpers();
bootstrapApplication(App, appConfig).catch(console.error.bind(this));
