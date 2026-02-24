
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true },
  balance: { type: Number, default: 0 },
  totalLimit: { type: Number, default: 0 },
  rank: { type: String, default: 'standard' },
  rankProgress: { type: Number, default: 0 },
  isLoggedIn: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  pendingUpgradeRank: { type: String, default: null },
  rankUpgradeBill: { type: String },
  address: { type: String },
  joinDate: { type: String },
  idFront: { type: String },
  idBack: { type: String },
  refZalo: { type: String },
  relationship: { type: String },
  lastLoanSeq: { type: Number },
  bankName: { type: String },
  bankAccountNumber: { type: String },
  bankAccountHolder: { type: String },
  updatedAt: { type: Number, default: Date.now }
}, { timestamps: true });

const LoanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  createdAt: { type: String, required: true },
  status: { type: String, required: true },
  fine: { type: Number, default: 0 },
  billImage: { type: String },
  signature: { type: String },
  rejectionReason: { type: String },
  updatedAt: { type: Number, default: Date.now }
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, required: true }
}, { timestamps: true });

const SystemSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  budget: { type: Number, default: 30000000 },
  rankProfit: { type: Number, default: 0 }
});

export const User = mongoose.model('User', UserSchema);
export const Loan = mongoose.model('Loan', LoanSchema);
export const Notification = mongoose.model('Notification', NotificationSchema);
export const System = mongoose.model('System', SystemSchema);
