import React, { useState, useEffect } from 'react';
import { Card, Colors } from "@blueprintjs/core";
import {
    useRouteMatch
} from 'react-router-dom';
import NewPickForm from "../Components/NewPickForm/NewPickForm.jsx"
import PickCard from "../Components/Portfolio/Pick.jsx"
import { getPortfolio, deletePortfolioPick } from  '../Api/Api.jsx';

const newPickFormStyle = {
    display: "flex",
    // flexWrap: "wrap",
    flex: "1 100%"
}

const portfolioPickListStyle = {
    display: "flex",
    justifyContent:"center",
    flexFlow:"column nowrap"
}

const portfolioInfoStyle = {
    display: "flex",
    flex: "1 100%",
    justifyContent:"center",
    flexFlow:"column nowrap"
}

function Portfolio() {
    const match = useRouteMatch()
    
    const portfolioId = match.params.id

    const [portfolioPickList, setPortfolioPickList] = useState(<></>)
    const [portfolioResponse, setPortfolioResponse] = useState({})
    
    const generatePickList = async (response) => {
        if (Object.keys(response).length === 0) {
            return <></>
        }
        return response.data.picks.map((pick) => {
            return <PickCard deletePick={deletePick} pick={pick}/>
        })
    }
    
    const initPortfolioResponse = async () => {
        try {
            const response = await getPortfolio(portfolioId)
            if (response.status === 200) {
                await setPortfolioResponse(response)
            }
        } catch(err) {
            console.log(err.response)
        }
    }

    useEffect(() => {
        initPortfolioResponse()
    }, [])

    useEffect(() => {
        generatePickList(portfolioResponse).then((pickList) => {
            console.log(pickList)
            setPortfolioPickList(pickList)
        })
    }, [portfolioResponse])
    
    async function deletePick(pickId) {
        try {
            const response = await deletePortfolioPick(portfolioId, pickId)
            if (response.status === 200) {
                await initPortfolioResponse()
            }
        } catch(err) {
            console.log(err.response)
        }
    }
    
    const generateAbsoluteReturn = () => {
        return <>
            { portfolioResponse.data.absolute_return >= 0 
            ? <><span style={{color: Colors.GREEN4}}>+{portfolioResponse.data.absolute_return.toFixed(2)}%</span></>
            : <><span style={{color: Colors.RED3}}>-{portfolioResponse.data.absolute_return.toFixed(2)}%</span></>}
        </>
    }
    
    return <>
        <section style={newPickFormStyle}>
            <NewPickForm portfolioId={portfolioId} setPortfolioResponse={setPortfolioResponse} />
        </section>
        {portfolioResponse.hasOwnProperty("status") ? <section style={portfolioInfoStyle}>
            <h2>{portfolioResponse.data.name} | {generateAbsoluteReturn()}</h2>
            <pre>{portfolioResponse.data.description}</pre>
        </section> : <></> }
        <section style={portfolioPickListStyle}>
            <>{portfolioPickList}</>
        </section>
    </>;
}

export default Portfolio;

