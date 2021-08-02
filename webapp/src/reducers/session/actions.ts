import { Socket } from 'socket.io-client';
import { PartialAction } from '../types';

export type Actions =
  | 'SET_SOCKET'
  | 'SET_AZURE_USER'
  | 'SET_API_TOKEN'
  | 'SET_GRAPH_TOKEN'
  | 'SET_ROLE';

export interface AzureUser {
  '@odata.context': string;
  '@odata.id': string;
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
  id: string;
}

export interface SessionState {
  socket: Socket;
  apiToken: string;
  graphToken: string;
  azureUser: AzureUser;
  role: string;
}

export const setSocket = (socket: Socket): PartialAction<Actions, SessionState> => ({
  type: 'SET_SOCKET',
  payload: { socket },
});

export const setAzureUser = (azureUser: AzureUser): PartialAction<Actions, SessionState> => ({
  type: 'SET_AZURE_USER',
  payload: { azureUser },
});

export const setAPIToken = (apiToken: string): PartialAction<Actions, SessionState> => ({
  type: 'SET_API_TOKEN',
  payload: { apiToken },
});

export const setGraphToken = (graphToken: string): PartialAction<Actions, SessionState> => ({
  type: 'SET_GRAPH_TOKEN',
  payload: { graphToken },
});

export const setRole = (role: string): PartialAction<Actions, SessionState> => ({
  type: 'SET_ROLE',
  payload: { role },
});
