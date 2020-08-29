import React, { useState } from 'react';
import { FormGroup, InputGroup, Button, Popover, Position, PopoverInteractionKind, Spinner } from '@blueprintjs/core'
import { getSymbolInfo, createPortfolioPick } from  '../../Api/Api.jsx';

const flexCol = {
    display: "flex",
    flexFlow: "row wrap",
    margin:"auto",
    flex:"1 100%",
    justifyContent:"center",
    alignItems:"center",
    paddingTop:"0.5rem"
}

const formGroupPadding = {
    padding:"0.5rem"
}

const symbolPopoverStyle = {
    minWidth:"200px",
    minHeight:"50px",
    padding:"1rem",
    textAlign:"center",
}

function NewPickForm(props) {
    const portfolioId = props.portfolioId
    const setPortfolioResponse = props.setPortfolioResponse
    
    const [symbol, setSymbol] = useState("")
    const [symbolPopoverContent, setSymbolPopoverContent] = useState(<div style={symbolPopoverStyle}></div>)
    const [pickResponseError, setPickResponseError] = useState(undefined)

    async function addPick(evt) {
        evt.preventDefault()

        let pickPayload = new FormData()

        pickPayload = {
            stock: evt.target.symbol.value,
            bought_price: evt.target.bought_price.value, 
            bought_date: evt.target.bought_date.value,
            allocation: evt.target.allocation.value
        }
        
        try {
            const response = await createPortfolioPick(portfolioId, pickPayload)
            if (response.status === "200") {
                setPortfolioResponse(response)
            }
        } catch(err) {
            if (err.response) {
                if (err.response.status === 400) {
                    setPickResponseError(err.response.data.detail.error)
                }
            }
        }
        
        return false
    }

    async function setSymbolTooltipInfo() {
        setSymbolPopoverContent(<div style={symbolPopoverStyle}>Fetching Symbol Data...<div style={{padding:"10px"}}><Spinner size={Spinner.SIZE_SMALL} /></div></div>)

        try {
            const symbolResponse = await getSymbolInfo(symbol)
            if (symbolResponse.status === 200) {

                const symbolInfo = <>
                    <div style={symbolPopoverStyle}>
                        <div>
                            {symbolResponse.data.symbol}
                        </div>
                        <div>
                            Last Price: {symbolResponse.data.last_price}
                        </div>
                        <div>
                            Last Price Date: {symbolResponse.data.last_price_date}
                        </div>
                    </div>
                </>
                
                setSymbolPopoverContent(symbolInfo)
            } else {
                setSymbolPopoverContent(<div style={symbolPopoverStyle}>Failed to fetch symbol info.</div>)
            }

        } catch(err) {
            let errMsg = ""
            if (err.response) {
                if (err.response.data.status === 400) {
                    errMsg = err.response.data.detail.error
                }
            }
            setSymbolPopoverContent(<div style={symbolPopoverStyle}>Failed to fetch symbol info.<div>{errMsg}</div></div>)
        }
    }

    const symbolRightElement = <>
        <Popover interactionKind={PopoverInteractionKind.CLICK} content={symbolPopoverContent} position={Position.BOTTOM}>
            <Button onClick={setSymbolTooltipInfo} icon="info-sign"></Button>
        </Popover>
    </>
    
    return (
        <>
            <form onSubmit={addPick} style={flexCol}>
                <FormGroup style={formGroupPadding}>
                    <InputGroup 
                        required
                        id="symbol" 
                        placeholder="Symbol"
                        rightElement={symbolRightElement}
                        onChange={(evt) => {setSymbol(evt.target.value)}}
                    />
                </FormGroup>
                <FormGroup style={formGroupPadding}>
                    <InputGroup 
                        required
                        id="bought_price" 
                        placeholder="Bought Price" 
                    />
                </FormGroup>
                <FormGroup style={formGroupPadding}>
                    <InputGroup 
                        required
                        type="date"
                        id="bought_date" 
                        placeholder="Bought On Date"
                        parseDate={str => new Date(str)}
                    />
                </FormGroup>
                <FormGroup style={formGroupPadding}>
                    <InputGroup 
                        required
                        id="allocation" 
                        placeholder="Allocation"
                    />
                </FormGroup>
                <FormGroup style={{...formGroupPadding}}>
                    <Button type="sumbit" icon="plus">Pick</Button> 
                </FormGroup>
            </form>
            <div style={{textAlign:"center"}}>
                {pickResponseError}
            </div>
        </>
    );
}

export default NewPickForm;
