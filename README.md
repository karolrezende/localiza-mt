# Localiza MT

Aplicação **Next.js** para consulta de pessoas desaparecidas.
Disponível em: https://localiza-mt.vercel.app
---

## 👤 Autor
**KAROLINE NOVAIS REZENDE**  
Desenvolvedora Full Stack  
- Linkedin: https://www.linkedin.com/in/karolrezende/
- Experiência em sistemas **financeiros, consignados, geográficos e previdênciarios**

---

## 🚀 Tecnologias utilizadas
- [Next.js 15](https://nextjs.org/)
- [React 18](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [ShadcnUi](https://ui.shadcn.com/)
---

## 📦 Pré-requisitos
- **Node.js** 20+
- **npm** ou **yarn**
- **Docker** 20+

---

## ▶️ Rodar localmente

### 1. Instalar dependências
```bash
npm install
```
### 2. Instalar dependências
```bash
npm run dev
```
Acesse: http://localhost:3000

## ▶️ Rodar com Docker

### 1. Build da imagem
```bash
docker build -t localiza-mt .
```

### 2. Rodar container (HTTP)
```bash
docker run -it --rm -p 3000:3000 localiza-mt
```
Acesse: http://localhost:3000


## 📝 Observações importantes

- **Não está sendo consumida a API oficial do teste**, pois a mesma estava **offline durante o desenvolvimento**.  
- Conforme orientação do e-mail, foram utilizados **dados mockados disponibilizados por Marcos André**.  
