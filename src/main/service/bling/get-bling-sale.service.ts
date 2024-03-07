import { blingConfig } from '@main/config';

interface Input {
  accessToken: string;
  page: number;
  limit: number;
  initialDate: string;
}

type Output = Promise<Pick<FetchResponse, 'data'>>;

interface FetchResponse {
  data: Array<{
    id: number;
    numero: number;
    numeroLoja: string;
    data: string;
    dataSaida: string;
    dataPrevista: string;
    totalProdutos: number;
    total: number;
    contato: {
      id: number;
      nome: string;
      tipoPessoa: string;
      numeroDocumento: string;
    };
    situacao: {
      id: number;
      valor: number;
    };
    loja: {
      id: number;
    };
  }>;
  error?: { type: string; message: string; description: string };
}

export const getBlingSaleList = async ({
  accessToken,
  page,
  limit,
  initialDate
}: Input): Output => {
  const data = await fetch(
    `${blingConfig.URL}/pedidos/vendas?pagina=${page}&limite=${limit}&dataInicial=${initialDate}`,
    {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      method: 'GET'
    }
  );

  const response = (await data.json()) as FetchResponse;

  if (typeof response.error !== 'undefined') throw new Error(response.error.description);

  return response;
};
