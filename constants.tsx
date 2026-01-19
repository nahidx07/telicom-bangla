
import React from 'react';
import { 
  Globe, 
  Package, 
  Phone, 
  Tag, 
  Library, 
  Send, 
  Smartphone, 
  PlusCircle, 
  Home, 
  History, 
  ArrowUpCircle, 
  User as UserIcon,
  Bell
} from 'lucide-react';
import { Operator, Package as PackageType } from './types.ts';

export const OPERATORS: { name: Operator; color: string; textColor: string; logo: string }[] = [
  { name: 'GP', color: 'bg-blue-500', textColor: 'text-blue-500', logo: 'https://img.icons8.com/color/96/grameenphone.png' },
  { name: 'Robi', color: 'bg-red-600', textColor: 'text-red-600', logo: 'https://img.icons8.com/color/96/robi.png' },
  { name: 'Airtel', color: 'bg-red-500', textColor: 'text-red-500', logo: 'https://img.icons8.com/color/96/airtel.png' },
  { name: 'Banglalink', color: 'bg-orange-500', textColor: 'text-orange-500', logo: 'https://img.icons8.com/color/96/banglalink.png' },
  { name: 'Teletalk', color: 'bg-green-600', textColor: 'text-green-600', logo: 'https://img.icons8.com/color/96/teletalk.png' },
];

export const MOCK_PACKAGES: PackageType[] = [
  { id: '1', operator: 'GP', name: '10GB Internet', price: 299, validity: '30 Days', type: 'Internet', description: 'Enjoy 4G speed' },
  { id: '2', operator: 'Robi', name: '500 Minutes', price: 250, validity: '30 Days', type: 'Minute', description: 'Talk freely' },
  { id: '3', operator: 'Airtel', name: 'Combo Pack 5GB + 200 Min', price: 199, validity: '15 Days', type: 'Bundle', description: 'Best value' },
  { id: '4', operator: 'Banglalink', name: 'Unlimited Social', price: 99, validity: '7 Days', type: 'Offer', description: 'FB & WhatsApp' },
];

export const NAV_ITEMS = [
  { id: 'home', label: 'হোম', icon: <Home size={24} />, path: '/' },
  { id: 'transactions', label: 'লেনদেন', icon: <History size={24} />, path: '/transactions' },
  { id: 'update', label: 'আপডেট', icon: <ArrowUpCircle size={24} />, path: '/update' },
  { id: 'profile', label: 'প্রোফাইল', icon: <UserIcon size={24} />, path: '/profile' },
];

export const SERVICE_GRID = [
  { id: 'internet', label: 'ইন্টারনেট', icon: <Globe className="text-gray-600" />, color: 'text-blue-500', path: '/service/internet' },
  { id: 'bundle', label: 'বান্ডেল', icon: <Package className="text-gray-600" />, color: 'text-purple-500', path: '/service/bundle' },
  { id: 'minute', label: 'মিনিট', icon: <Phone className="text-gray-600" />, color: 'text-green-500', path: '/service/minute' },
  { id: 'my-offer', label: 'মাই অফার', icon: <Tag className="text-gray-600" />, color: 'text-red-500', path: '/service/offers' },
  { id: 'bank', label: 'ব্যাংক', icon: <Library className="text-gray-600" />, color: 'text-blue-700', path: '/service/bank' },
  { id: 'rocket', label: 'রকেট', icon: <Send className="text-gray-600" />, color: 'text-pink-500', path: '/service/rocket' },
  { id: 'recharge', label: 'রিচার্জ', icon: <Smartphone className="text-gray-600" />, color: 'text-indigo-500', path: '/service/recharge' },
  { id: 'add-money', label: 'অ্যাড মানি', icon: <PlusCircle className="text-gray-600" />, color: 'text-emerald-500', path: '/add-money' },
];
