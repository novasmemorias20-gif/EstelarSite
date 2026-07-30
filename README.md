# Estelar Climatização Inteligente — Site Institucional

Site institucional premium, mobile-first, em **HTML5 + CSS3 + JavaScript puro** (sem frameworks e sem dependências pesadas), pronto para publicação.

## Estrutura do projeto

```
estelar/
├── index.html          → Página única com todas as seções
├── style.css            → Design system completo (tokens, componentes, responsivo, modo escuro)
├── script.js             → Interações: menu, tema, modal de orçamento, slider, FAQ, partículas, PWA
├── manifest.json         → Configuração do app instalável (PWA)
├── sw.js                 → Service Worker (cache do app shell / uso offline básico)
├── robots.txt            → Diretivas para buscadores
├── sitemap.xml            → Mapa do site para SEO
├── favicon.ico            → Ícone do navegador
├── README.md
└── assets/
    ├── logo.png            → Logotipo oficial (fornecido)
    ├── hero.webp           → Imagem de destaque do topo (placeholder gerado — troque por foto real)
    ├── icons/               → Ícones do PWA em vários tamanhos (16px a 512px)
    ├── gallery/              → Pasta reservada para fotos de serviços (galeria)
    ├── backgrounds/           → Pasta reservada para imagens de fundo adicionais
    └── fonts/                  → Pasta reservada caso queira hospedar as fontes localmente
```

## Como visualizar localmente

Basta abrir um servidor estático na pasta (o Service Worker exige `http://` ou `https://`, não funciona com `file://`):

```bash
cd estelar
python3 -m http.server 8080
# depois acesse http://localhost:8080
```

## Como publicar

O projeto é 100% estático e funciona em qualquer hospedagem de arquivos:

- **Netlify / Cloudflare Pages**: arraste a pasta `estelar/` no painel, ou conecte um repositório Git.
- **GitHub Pages**: suba o conteúdo da pasta `estelar/` para a raiz do repositório (ou para `/docs`) e ative o GitHub Pages nas configurações.

Depois de publicar, ajuste em `index.html`, `manifest.json`, `sitemap.xml` e `robots.txt` a URL definitiva do domínio (atualmente usando `https://www.estelarclimatizacao.com.br/` como placeholder).

## O que já está pronto

- **Identidade visual**: paleta azul (predominante) + laranja (apenas para CTAs) + branco, tipografia Poppins (títulos) e Inter (texto), seguindo o logotipo fornecido.
- **SEO on-page**: title, description, Open Graph, Twitter Card, canonical, JSON-LD (Schema.org `HVACBusiness`), sitemap.xml e robots.txt.
- **PWA**: manifest.json, Service Worker com cache do app shell, ícones em todos os tamanhos, instalável em Android/iOS/Desktop.
- **Responsivo mobile-first**: testado nos breakpoints de celular, tablet, notebook e telas ultra wide.
- **Modo escuro**: alternável pelo usuário, com preferência salva localmente.
- **Formulário de orçamento**: modal com validação, que monta a mensagem e abre o WhatsApp automaticamente com todos os dados preenchidos.
- **Seções**: Header fixo animado, Hero, Diferenciais, Serviços (com orçamento pré-preenchido por serviço), Galeria (com placeholders elegantes, pronta para receber fotos), Depoimentos (slider), Área de atuação (mapa estilizado + lista de cidades), FAQ (accordion), CTA final, Rodapé, botão flutuante de WhatsApp e botão "voltar ao topo".
- **Acessibilidade**: skip link, foco visível, atributos ARIA em menu, modal, accordion e slider, respeita `prefers-reduced-motion`.

## Próximos passos recomendados (conteúdo real)

1. Substituir `assets/hero.webp` por uma fotografia real da equipe/instalação em alta resolução (formato WebP, ~1200px de largura).
2. Adicionar fotos reais em `assets/gallery/` e trocar os placeholders da seção **Galeria** no `index.html` por `<img>` reais.
3. Trocar os depoimentos de exemplo por avaliações reais (idealmente puxando do Google Reviews).
4. Registrar o domínio definitivo e atualizar todas as URLs marcadas como placeholder.
5. Gerar um favicon.ico com múltiplas resoluções internas usando uma ferramenta como [RealFaviconGenerator](https://realfavicongenerator.net/) para máxima compatibilidade.

## Contato usado no site

- WhatsApp: **(18) 99169-0009**
- Instagram: **@estelar.arcondicionado**
- Atendimento: Guararapes, Araçatuba, Birigui, Valparaíso e região.
