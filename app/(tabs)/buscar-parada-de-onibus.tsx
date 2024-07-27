import { StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Parada } from '@/types/types';
import { autenticarNaApi } from '@/helpers/autenticarNaApi';
import Loading from '@/components/form/loading/Loading';
import ErrorComponent from '@/components/form/error/Error';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Title from '@/components/text/Title';
import MapView, { MapMarker } from 'react-native-maps';
import PageContainer from '@/components/containers/PageContainer';
import useFormState from '@/custom-hooks/useFormState';
import useOnChangeTimeout from '@/custom-hooks/useOnChangeTimeout';

export default function BuscarParadaDeOnibus() {
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [inputDePesquisa, setInputDePesquisa] = useState('');
  const { formState, setFormState } = useFormState();
  const { runTimeout } = useOnChangeTimeout();

  const cordernadasSpValorInicial = {
    latitude: -23.550522,
    longitude: -46.633328,
    latitudeDelta: 1,
    longitudeDelta: 0.012,
  };
  const [cordenadasSp, setCordenadasSp] = useState(cordernadasSpValorInicial);

  const fetchData = async () => {
    try {
      const res = await fetch(
        process.env.API_URL + '/Parada/Buscar?termosBusca=' + inputDePesquisa
      );
      if (!res.ok) throw new Error('Houve um erro ao pesquisar.');
      const json = (await res.json()) as Parada[];
      if (!json.length) throw new Error(`Nenhuma parada encontrada.`);
      setParadas(json);
      setCordenadasSp(cordernadasSpValorInicial);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        setFormState((prev) => ({ ...prev, error: error.message }));
      }
    } finally {
      setFormState((prev) => ({ ...prev, loading: false }));
    }
  };

  const lidarComPesquisa = () => {
    setFormState({ error: '', loading: true });
    setParadas([]);
    runTimeout(fetchData);
  };

  return (
    <PageContainer>
      <Title>Buscar Paradas de Ônibus</Title>
      <View style={styles.container}>
        <EvilIcons style={styles.icon} name='search' size={24} color='black' />
        <TextInput
          style={styles.input}
          placeholder='Ex: 340015329'
          value={inputDePesquisa}
          onChangeText={setInputDePesquisa}
          onChange={lidarComPesquisa}
        />
      </View>
      {formState.error && <ErrorComponent messagem={formState.error} />}
      {formState.loading && !formState.error ? (
        <Loading />
      ) : (
        inputDePesquisa.length > 0 &&
        paradas.length > 0 && (
          <MapView
            region={cordenadasSp}
            initialRegion={cordenadasSp}
            style={styles.map}
          >
            {paradas?.map(({ px, py, np }, i) => (
              <MapMarker
                key={i}
                tracksViewChanges={false}
                coordinate={{ latitude: py, longitude: px }}
                style={{ opacity: 0.5 }}
                title={np}
              />
            ))}
          </MapView>
        )
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginBottom: 4,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  item: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 16,
    fontSize: 18,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  map: {
    // flex: 1,
    width: '100%',
    height: '100%',
    // position: 'relative',
  },
});
