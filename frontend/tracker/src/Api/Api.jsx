import process from "process";
import axios from "axios";

let API_ROOT = ""

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    API_ROOT = "http://localhost:8000"
} else {
    API_ROOT = "/api"
}

const instance = axios.create({
    baseURL: API_ROOT,
    timeout: 5000,
  });

const PORTFOLIO_ENDPOINT = "/portfolio"
const STOCK_ENDPOINT = "/stock"

const getAllPortfolios = async () => {
    return await instance.get(PORTFOLIO_ENDPOINT)
}

const getPortfolio = async (portfolioId) => {
    return await instance.get(`${PORTFOLIO_ENDPOINT}/${portfolioId}`)
}

const newPortfolio = async (portfolioData) => {
    return await instance.post(PORTFOLIO_ENDPOINT, portfolioData)
}

const deactivatePortfolio = async (portfolioId) => {
    return await instance.delete(`${PORTFOLIO_ENDPOINT}/${portfolioId}`)
}

const createPortfolioPick = async (portfolioId, portfolioPickPayload) => {
    const PICK_ENDPOINT = "/pick"
    return await instance.post(`${PORTFOLIO_ENDPOINT}/${portfolioId}${PICK_ENDPOINT}`, portfolioPickPayload)
}

const deletePortfolioPick = async (portfolioId, pickId) => {
    const PICK_ENDPOINT = "/pick"
    return await instance.delete(`${PORTFOLIO_ENDPOINT}/${portfolioId}${PICK_ENDPOINT}/${pickId}`)
}

const getSymbolInfo = async (symbol) => {
    return await instance.get(`${STOCK_ENDPOINT}/${symbol}`)
}

export {
    getAllPortfolios,
    getPortfolio,
    newPortfolio,
    deactivatePortfolio,
    getSymbolInfo,
    createPortfolioPick,
    deletePortfolioPick,
}
