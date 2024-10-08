import { useState } from 'react';
import useMudarAoTimeout from './useMudarAoTimeout';

const useFetchHook = ({
  iniciarSemLoading = false,
  pesquisarSemTimeout = false,
}: {
  iniciarSemLoading?: boolean;
  pesquisarSemTimeout?: boolean;
}) => {
  const [formState, setFormState] = useState({ loading: false, error: '' });
  const { runTimeout } = useMudarAoTimeout();

  const pesquisarNaApi = async <T,>({
    conclusao,
    url,
    options,
  }: {
    conclusao: (json: T) => Promise<any>;
    url: string;
    options?: RequestInit;
  }) => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error('Houve um erro ao pesquisar.');
      const json = (await res.json()) as T;
      if (!json) throw new Error(`Houve um erro ao pesquisar.`);
      if (Array.isArray(json) && !json.length)
        throw new Error('Nenhum resultado encontrado.');
      await conclusao(json);
    } catch (error) {
      if (error instanceof Error) {
        setFormState((prev) => ({ ...prev, error: error.message }));
      }
    } finally {
      setFormState((prev) => ({ ...prev, loading: false }));
    }
  };

  const pesquisar = async <T,>(
    conclusao: (json: T) => Promise<any>,
    url: string,
    options?: RequestInit
  ) => {
    if (!iniciarSemLoading) setFormState({ error: '', loading: true });
    if (pesquisarSemTimeout) {
      pesquisarNaApi<T>({ conclusao, url, options });
    } else {
      runTimeout(() => pesquisarNaApi<T>({ conclusao, url, options }));
    }
  };

  return { formState, setFormState, pesquisar };
};

export default useFetchHook;
