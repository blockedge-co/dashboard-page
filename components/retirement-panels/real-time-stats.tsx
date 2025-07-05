
"use client"

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, DollarSign, Cpu, Circle } from 'lucide-react';

// Mock data for retirement stats
const retirementData = [
  { name: 'Jan', ais: 4000, fiat: 2400, crypto: 1800 },
  { name: 'Feb', ais: 3000, fiat: 1398, crypto: 2210 },
  { name: 'Mar', ais: 2000, fiat: 9800, crypto: 2290 },
  { name: 'Apr', ais: 2780, fiat: 3908, crypto: 2000 },
  { name: 'May', ais: 1890, fiat: 4800, crypto: 2181 },
  { name: 'Jun', ais: 2390, fiat: 3800, crypto: 2500 },
];

const totalTokenized = 1500000;

export function RealTimeRetirementStats() {
  const totalRetired = useMemo(() =>
    retirementData.reduce((acc, month) => acc + month.ais + month.fiat + month.crypto, 0),
    []
  );

  const retirementByType = useMemo(() => {
    const totals = retirementData.reduce(
      (acc, month) => {
        acc.ais += month.ais;
        acc.fiat += month.fiat;
        acc.crypto += month.crypto;
        return acc;
      },
      { ais: 0, fiat: 0, crypto: 0 }
    );
    return [
      { name: 'AIS', value: totals.ais, fill: '#8884d8' },
      { name: 'Fiat', value: totals.fiat, fill: '#82ca9d' },
      { name: 'Crypto', value: totals.crypto, fill: '#ffc658' },
    ];
  }, []);

  return (
    <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          Retirement Tracking
        </CardTitle>
        <CardDescription className="text-gray-400">
          Credits retired by source over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={retirementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4b5563',
                color: '#d1d5db',
              }}
            />
            <Legend wrapperStyle={{ color: '#d1d5db' }} />
            <Bar dataKey="ais" stackId="a" fill="#8884d8" name="AIS" />
            <Bar dataKey="fiat" stackId="a" fill="#82ca9d" name="Fiat" />
            <Bar dataKey="crypto" stackId="a" fill="#ffc658" name="Crypto" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center p-2 bg-gray-700/50 rounded-lg">
            <Cpu className="h-5 w-5 mr-2 text-purple-400" />
            <div>
              <p className="text-gray-400">Total Tokenized</p>
              <p className="font-bold text-lg text-white">{totalTokenized.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center p-2 bg-gray-700/50 rounded-lg">
            <DollarSign className="h-5 w-5 mr-2 text-green-400" />
            <div>
              <p className="text-gray-400">Total Retired</p>
              <p className="font-bold text-lg text-white">{totalRetired.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
