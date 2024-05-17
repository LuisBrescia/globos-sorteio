import java.util.Scanner;

class Website{
	private String nome;
    private String endereco;
    private int vezesProcurado;

    public Website(String nome, String endereco) {
        this.nome = nome;
        this.endereco = endereco;
        this.vezesProcurado = 0;
    }

    public String getNome() {
        return nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public int getVezesProcurado() {
        return vezesProcurado;
    }

    public void incrementarVezesProcurado() {
        vezesProcurado++;
    }

    @Override
    public String toString() {
        return "Nome:["+ nome +"]\nEndereco:["+ endereco +"]\nNumero de acessos: "+ vezesProcurado;
    }
}

class ListaLinearDeWebsites {
    private Website[] websites;
    private int tamanho;

    public ListaLinearDeWebsites(int capacidade) {
        websites = new Website[capacidade];
        tamanho = 0;
    }

    public void adicionarWebsite(Website website) {
        if (tamanho < websites.length) {
            websites[tamanho] = website;
            tamanho++;
        } else {
            System.out.println("Lista cheia. Não é possível adicionar mais websites.");
        }
    }

    public Website buscarWebsite(String nome) {
        for (int i = 0; i < tamanho; i++) {
            if (websites[i].getNome().equalsIgnoreCase(nome)) {
                Website websiteEncontrado = websites[i];
                moverParaInicio(i);
                return websiteEncontrado;
            }
        }
        return null;
    }

    private void moverParaInicio(int index) {
        Website temp = websites[index];
        for (int i = index; i > 0; i--) {
            websites[i] = websites[i - 1];
        }
        websites[0] = temp;
    }

    public void processarConsultas(String[] consultas) {
        for (String nome : consultas) {
            if (nome.equalsIgnoreCase("FIM")) {
                break;
            }
            Website website = buscarWebsite(nome);
            if (website != null) {
                website.incrementarVezesProcurado();
                System.out.println(website.getEndereco());
            } else {
                System.out.println("O item procurado nao foi encontrado!");
            }
        }
    }

    public void imprimirLista() {
        for (int i = 0; i < tamanho; i++) {
            System.out.println(websites[i]);
        }
    }
}

public class SitesDaWeb {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Leitura do número de sites
        int numSites = scanner.nextInt();
        scanner.nextLine(); // Consumir a quebra de linha

        // Criar lista de websites
        ListaLinearDeWebsites listaDeWebsites = new ListaLinearDeWebsites(numSites);

        // Ler e armazenar os websites
        for (int i = 0; i < numSites; i++) {
            String[] input = scanner.nextLine().split(" - ");
            String nome = input[0];
            String endereco = input[1];
            Website website = new Website(nome, endereco);
            listaDeWebsites.adicionarWebsite(website);
        }

        // Ler e processar consultas
        while (true) {
            String consulta = scanner.nextLine();
            if (consulta.equalsIgnoreCase("FIM")) {
                break;
            }
            listaDeWebsites.processarConsultas(new String[]{consulta});
        }

        // Imprimir lista de websites
        listaDeWebsites.imprimirLista();

        scanner.close();
    }
}
