interface Input {
  accessToken: string;
  page: number;
  limit: number;
}

type Output = Promise<Pick<FetchResponse, 'data'>>;

interface FetchResponse {
  data: Array<{
    id: string;
    nome: string;
    codigo: string;
    preco: number;
    tipo: string;
    formato: string;
    descricaoCurta: string;
  }>;
  error?: { type: string; message: string; description: string };
}

export const getBlingProductList = async ({ accessToken, page, limit }: Input): Output => {
  const data = await fetch(
    `https://www.bling.com.br/Api/v3/produtos?pagina=${page}&limite=${limit}`,
    {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      method: 'GET'
    }
  );

  const response = (await data.json()) as FetchResponse;

  if (typeof response.error !== 'undefined') throw new Error(response.error.description);

  return response;
};
