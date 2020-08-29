import React, { useState } from 'react';
import { Card, Button, Intent } from '@blueprintjs/core';
import { Link } from 'react-router-dom'
import { deactivatePortfolio } from "../../Api/Api.jsx"

const portfolioSectionStyle = {
    paddingBottom:"1rem"
}

const portfolioStyle = { 
    width:"100%",
}

const portfolioLinkStyle = {
    color:"inherit", 
}

function PortfolioCard(props) {
    const [deactivateResponseError, setDeactivateResponseError] = useState(<></>)
    
    const portfolioDeactivateHandler = async () => {
        const id = props.portfolio.id
        try {
            const response = await deactivatePortfolio(id)
            if (response.status === 200) {
                props.portfolioDeactivateCallback(response)
            } else {
                setDeactivateResponseError(<p>Error deactivating portfolio.</p>)
            }
        } catch(err) {
            if(err.response) {
                if(err.response.status === 400) {
                    setDeactivateResponseError(<p>Error deactivating portfolio. {err.response.data.detail.error}</p>)
                    return
                }
            }
            setDeactivateResponseError(<p>Error deactivating portfolio.</p>)
        }
    }
    
    return (
        <section style={portfolioSectionStyle}>
                <Card interactive={false} style={portfolioStyle}>
                    <Link style={portfolioLinkStyle} to={`/portfolio/${props.portfolio.id}`}>    
                        <div>
                            <h3>{props.portfolio.name}</h3> 
                            <p>{props.portfolio.description}</p>
                        </div>
                    </Link>
                    <hr />
                    <p>Added on: <strong>{props.portfolio.created_on}</strong> <span style={{float:"right"}}>{deactivateResponseError}<Button onClick={portfolioDeactivateHandler} intent={Intent.DANGER}>Deactivate</Button></span></p>
                </Card>
        </section>
    )
}

export default PortfolioCard;
