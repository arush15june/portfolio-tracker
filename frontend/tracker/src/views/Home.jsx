import React, { useState, useEffect } from 'react';
import NewPortfolioForm from '../Components/PortfolioForm/NewPortfolioForm.jsx';
import PortfolioCard from "../Components/Portfolio/Portfolio.jsx"
import { getAllPortfolios } from "../Api/Api.jsx"

const portfolioFormStyle = {
    display: "flex",
    margin: "auto",
    flex: "1 100%"
}

const portfolioListStyle = {
    display: "flex",
    justifyContent:"center",
    flexFlow:"column nowrap"
}

function Home() {
    const transformPortfolioObject = (portfolio) => {
        return <PortfolioCard portfolioDeactivateCallback={portfolioDeactivateCallback} portfolio={portfolio} />
    }
    
    const [portfolioList, setPortfolioList] = useState([])
    const [portfolioListError, setPortfolioListError] = useState(<></>)

    const fetchSetPortfolioList = async () => {
        try {
            const portfolioListResponse = await getAllPortfolios()
            const portfolios = portfolioListResponse.data.map((item) => {
                return transformPortfolioObject(item)
            })
            setPortfolioList(portfolios)
        } catch(err) {
            setPortfolioListError(<p>Error fetching data...</p>)
        }
    }

    useEffect(() => {
        fetchSetPortfolioList()
    }, [])
    
    const newPortfolioCallback = async (portfolioResponse) => {
        setPortfolioList([transformPortfolioObject(portfolioResponse.data)].concat(portfolioList))
    }
    
    const portfolioDeactivateCallback = async (portfolioDeactivated) => {
        fetchSetPortfolioList()
    }
    
    return (
        <>
        <section style={portfolioFormStyle}>
            <NewPortfolioForm newPortfolioCallback={newPortfolioCallback}/>
        </section>
        <section style={portfolioListStyle}>
            {portfolioListError}
            {portfolioList}
        </section>
        </>
    );
}

export default Home
