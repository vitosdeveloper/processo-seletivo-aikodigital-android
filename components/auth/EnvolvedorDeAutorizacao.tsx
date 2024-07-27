import useRodeEmIntervalo from '@/custom-hooks/useRodeEmIntervalo';
import { autenticarNaApi } from '@/helpers/autenticarNaApi';
import React, { PropsWithChildren, useCallback } from 'react';

const EnvolvedorDeAutorizacao = ({ children }: PropsWithChildren) => {
  useRodeEmIntervalo(useCallback(autenticarNaApi, []), 600000);
  return <>{children}</>;
};

export default EnvolvedorDeAutorizacao;
