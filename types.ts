
export type Operator = 'GP' | 'Robi' | 'Airtel' | 'Banglalink' | 'Teletalk';

export type TransactionType = 'Recharge' | 'Internet' | 'Minute' | 'Offer' | 'Add Money' | 'Bank Withdraw';

export type Status = 'Pending' | 'Success' | 'Failed';

export interface User {
  id: string;
  mobile: string;
  email: string;
  name?: string;
  pin: string;
  balance: number;
  type: 'Normal' | 'Agent';
  referCode?: string;
  deviceId: string;
  isBlocked: boolean;
  kycStatus: 'None' | 'Pending' | 'Verified';
}

export interface AppSettings {
  latestVersion: string;
  currentVersion: string;
  updateUrl: string;
  maintenanceMode: boolean;
  notice: string;
}

// Added missing properties: userMobile, method, senderMobile, transactionId
// Made number and description optional to match usage in AddMoneyPage and ServicePage
export interface Transaction {
  id: string;
  userId: string;
  userMobile?: string;
  type: TransactionType;
  operator?: Operator;
  method?: string;
  senderMobile?: string;
  transactionId?: string;
  number?: string;
  amount: number;
  status: Status;
  date: string;
  description?: string;
}

export interface Package {
  id: string;
  operator: Operator;
  name: string;
  price: number;
  validity: string;
  type: 'Internet' | 'Minute' | 'Bundle' | 'Offer';
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}
