import React from 'react';
import { Card, Button, Intent } from '@blueprintjs/core';
import { Link } from 'react-router-dom'

function PortfolioCard(props) {
    const portfolioSectionStyle = {
        paddingBottom:"1rem"
    }
    
    const portfolioStyle = { 
        width:"100%",
    }

    const portfolioLinkStyle = {
        color:"inherit", 
        textDecoration: "none"
    }
    
    return (
        <Link style={portfolioLinkStyle} to={`/portfolio/${props.portfolio.id}`}>    
        <section style={portfolioSectionStyle}>
                <Card interactive={true} style={portfolioStyle}>
                    <h3>{props.portfolio.name}</h3> 
                    <p>{props.portfolio.description}</p>
                    <hr />
                    <p>Added on: <strong>{props.portfolio.created_on}</strong> <Button intent={Intent.DANGER} style={{float:"right"}}>Deactivate</Button></p>
                </Card>
        </section>
        </Link>
    )
}

export default PortfolioCard;
