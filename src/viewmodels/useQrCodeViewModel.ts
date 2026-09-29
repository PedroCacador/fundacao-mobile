import { useState, useEffect } from 'react';
import { User } from '../models/User';

export function useQrCodeViewModel() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [qrCodeData, setQrCodeData] = useState('FUND-1234-5678');

  const user: User = {
    name: 'Ana Carolina Silva',
    role: 'Colaboradora da FCV',
    matricula: '4587',
    email: 'ana.carolina@email.com',
    phone: '(31) 98765-4321',
    cpf: '123.456.789-00',
    cargo: 'Analista Administrativo',
    setor: 'Administrativo',
    emailCorporativo: 'ana.silva@fcv.org.br',
  };

  return {
    user,
    qrCodeData,
    timeLeft,
  };
}