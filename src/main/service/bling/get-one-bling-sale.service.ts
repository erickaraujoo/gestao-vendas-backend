import { blingConfig } from '@main/config';

interface Input {
  accessToken: string;
  id: number;
}

type Output = Promise<Pick<FetchResponse, 'data'>>;

interface FetchResponse {
  data: {
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
    numeroPedidoCompra: string;
    outrasDespesas: number;
    observacoes: string;
    observacoesInternas: string;
    desconto: {
      valor: number;
      unidade: string;
    };
    categoria: {
      id: number;
    };
    notaFiscal: {
      id: number;
    };
    tributacao: {
      totalICMS: number;
      totalIPI: number;
    };
    itens: [
      {
        id: number;
        codigo: string;
        unidade: string;
        quantidade: number;
        desconto: number;
        valor: number;
        aliquotaIPI: number;
        descricao: string;
        descricaoDetalhada: string;
        produto: {
          id: number;
        };
        comissao: {
          base: number;
          aliquota: number;
          valor: number;
        };
      }
    ];
    parcelas: [
      {
        id: number;
        dataVencimento: string;
        valor: number;
        observacoes: string;
        formaPagamento: {
          id: number;
        };
      }
    ];
    transporte: {
      fretePorConta: number;
      frete: number;
      quantidadeVolumes: number;
      pesoBruto: number;
      prazoEntrega: number;
      contato: {
        id: number;
        nome: string;
      };
      etiqueta: {
        nome: string;
        endereco: string;
        numero: string;
        complemento: string;
        municipio: string;
        uf: string;
        cep: string;
        bairro: string;
        nomePais: string;
      };
      volumes: [
        {
          id: number;
          servico: string;
          codigoRastreamento: string;
        }
      ];
    };
    vendedor: {
      id: number;
    };
    intermediador: {
      cnpj: string;
      nomeUsuario: string;
    };
    taxas: {
      taxaComissao: number;
      custoFrete: number;
      valorBase: number;
    };
  };
  error?: { type: string; message: string; description: string };
}

export const getOneBlingSale = async ({ accessToken, id }: Input): Output => {
  const data = await fetch(`${blingConfig.URL}/pedidos/vendas/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    method: 'GET'
  });

  const response = (await data.json()) as FetchResponse;

  if (typeof response.error !== 'undefined') throw new Error(response.error.description);

  return response;
};
