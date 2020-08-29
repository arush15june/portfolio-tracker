import React from 'react';
import { Colors, Button, Intent } from "@blueprintjs/core";
import { Card } from '@blueprintjs/core';

function PickCard(props) {
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
    
    function getReturn() {
        return <>
            { props.pick.pick_return >= 0 
            ? <><span style={{color: Colors.GREEN3}}>+{props.pick.pick_return.toFixed(2)}%</span></>
            : <><span style={{color: Colors.RED3}}>-{props.pick.pick_return.toFixed(2)}%</span></>}
        </>
    }
    
    return (
        <section style={portfolioSectionStyle}>
            <Card style={portfolioStyle}>
                <h1>{props.pick.stock.symbol} | {getReturn()} <span style={{float:"right"}}><Button onClick={async () => { props.deletePick(props.pick.id)}} intent={Intent.DANGER}>Delete</Button></span></h1>
                <p>Bought on: <strong>{props.pick.bought_date}</strong></p>
                <p>Bought Price: {parseFloat(props.pick.bought_price).toFixed(2)}</p>
                <p>Allocation: {parseFloat(props.pick.allocation).toFixed(2)}%</p>
                <hr />
                <p>Last Price: {parseFloat(props.pick.stock.last_price).toFixed(2)}</p>
                <p>Last Price Date: {props.pick.stock.last_price_date}</p>
            </Card>
        </section>
    )
}

export default PickCard;
