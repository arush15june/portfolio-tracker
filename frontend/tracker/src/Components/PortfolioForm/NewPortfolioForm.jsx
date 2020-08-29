import React, { useState } from 'react';
import { FormGroup, InputGroup, Button, setHotkeysDialogProps } from '@blueprintjs/core'
import { newPortfolio } from  '../../Api/Api.jsx';


const flexCol = {
    display: "flex",
    flexFlow: "row nowrap",
    width:"100%",
    margin:"auto",
    flex:"1 100%",
    alignItems:"center",
    paddingTop:"0.5rem"
}

const formGroupPadding = {
    padding:"0.5rem"
}

function NewPortfolioForm(props) {
    const [newPortfolioError, setNewPortfolioError] = useState(<></>)
    
    const newPortfolioHandler = async (evt) => {
        evt.preventDefault()

        let name = evt.target.name.value
        let description = evt.target.description.value
        
        try {
            const response = await newPortfolio({
                name: name,
                description: description
            })
            if (response.status === 200) {
                props.newPortfolioCallback(response)
            } else {
                setNewPortfolioError(<p>Error processing new portfolio.</p>)
            }
        } catch(err) {
            if (err.response) {
                if (err.response.status === 400) {
                    setNewPortfolioError(<p>Error creating new portfolio. {err.response.data.detail.error}</p>)
                    return
                }
            }
            setNewPortfolioError(<p>Error creating new portfolio.</p>)
        }
    }
    
    return (
        <>
        <form onSubmit={newPortfolioHandler} style={flexCol}>
            <FormGroup style={formGroupPadding}>
                <InputGroup required id="name" placeholder="Portfolio Name" />
            </FormGroup>
            <FormGroup style={formGroupPadding}>
                <InputGroup required id="description" placeholder="Portfolio Description" />
            </FormGroup>
            <FormGroup style={{...formGroupPadding}}>
                <Button type="submit" icon="plus">Portfolio</Button> 
            </FormGroup>
        </form>
        <div>
            {newPortfolioError}
        </div>
        </>
    );
}

export default NewPortfolioForm;
