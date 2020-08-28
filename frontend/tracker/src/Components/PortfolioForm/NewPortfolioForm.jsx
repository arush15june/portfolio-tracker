import React from 'react';
import { FormGroup, InputGroup, Button } from '@blueprintjs/core'

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

function NewPortfolioForm() {
    return (
        <>
        <form style={flexCol}>
            <FormGroup style={formGroupPadding}>
                <InputGroup large id="name" placeholder="Portfolio Name" />
            </FormGroup>
            <FormGroup style={formGroupPadding}>
                <InputGroup large id="description" placeholder="Portfolio Description" />
            </FormGroup>
            <FormGroup style={{...formGroupPadding}}>
                <Button icon="plus">Portfolio</Button> 
            </FormGroup>
        </form>
        </>
    );
}

export default NewPortfolioForm;
