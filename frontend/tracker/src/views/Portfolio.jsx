import React, { useState, useEffect } from 'react';
import {
    useRouteMatch,
    useParams
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

function Portfolio() {
    const match = useRouteMatch()
    
    const portfolioId = match.params.id

    const [portfolioPickList, setPortfolioPickList] = useState(<></>)
    const [portfolioResponse, setPortfolioResponse] = useState(undefined)
    
    const generatePickList = async (response) => {
        console.log("PickList", response)
        if (!response) {
            return <></>
        }
        return response.data.picks.map((pick) => {
            console.log(pick)
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
        generatePickList(portfolioResponse).then(async (pickList) => {
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
    
    return <>
        <section style={newPickFormStyle}>
            <NewPickForm portfolioId={portfolioId} setPortfolioResponse={setPortfolioResponse} />
        </section>
        <section style={portfolioPickListStyle}>
            <>{portfolioPickList}</>
        </section>
    </>;
}

export default Portfolio;

