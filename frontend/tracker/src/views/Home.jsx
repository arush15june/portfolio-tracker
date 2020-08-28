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
    const [portfolioList, setPortfolioList] = useState([])
    const [portfolioListError, setPortfolioListError] = useState(<></>)

    useEffect(() => {
        const fetchSetPortfolioList = async () => {
            try {
                const portfolioListResponse = await getAllPortfolios()
                const portfolios = portfolioListResponse.data.map((item) => {
                    return <PortfolioCard portfolio={item} />
                })
                setPortfolioList(portfolios)
            } catch(err) {
                setPortfolioListError(<p>Error fetching data...</p>)
            }
        }

        fetchSetPortfolioList()
    }, [])
    
    return (
        <>
        <section style={portfolioFormStyle}>
            <NewPortfolioForm />
        </section>
        <section style={portfolioListStyle}>
            {portfolioListError}
            {portfolioList}
        </section>
        </>
    );
}

export default Home
