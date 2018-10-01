import React, { Component } from 'react';
import {Panel, ListGroup, ListGroupItem, ButtonToolbar, Button, Modal} from 'react-bootstrap';
//import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom";


// Load Recipe Items or set default Recipe Items
var recipes = [
    {title: "Pumpkin Pie", ingredients: ["Pumpkin Puree", "Sweetened Condensed Milk", "Eggs", "Pumpkin Pie Spice", "Pie Crust"]},
    {title: "Spaghetti", ingredients: ["Noodles", "Tomato Sauce", "(Optional) Meatballs"]},
    {title: "Onion Pie", ingredients: ["Onion", "Pie Crust", "Sounds Yummy right?"]}
];
var edit_recipe;

class App extends Component {
    render() {
        return (
            <div className={"App"} id={"Container"}>
                <RecipeBook data = {recipes} />
                <AddRecipe/>
            </div>
        );
    }
}

// holds all recipe items
// input props: recipes,
class RecipeBook extends Component {
    render() {
        let recipes = this.props.data;
        var items = [];//const什么意思，能否修改?
        for (var i=0; i < recipes.length; i++) {
            items.push(
                <Panel eventKey={i} bsStyle="success">
                    <Panel.Heading>
                        <Panel.Title toggle>
                        {recipes[i].title}
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse>
                    <RecipeItem title={recipes[i].title} ingredients={recipes[i].ingredients} index={i}/>
                    </Panel.Collapse>
                </Panel>
            );
        }

        return (
            items
        );
    }
}



//props: title, ingredients, index
class RecipeItem extends Component {
    remove () {
        recipes.splice(this.props.index,1);
        update();
    }
    edit () {
        edit_recipe = this.props;
        document.getElementById("addRecipe").click();
    }
    // var edit = ()=>{re}
    render() {
        return (
            <div>
                <h4 className={"text-center"}>Ingredients</h4><hr/>
                <IngredientList ingredients={this.props.ingredients}/>
                <ButtonToolbar>
                    <Button bsStyle={"danger"} onClick={this.remove.bind(this)}>Delete</Button>
                    <Button bsStyle={"primary"} onClick={this.edit.bind(this)}>Edit</Button>
                </ButtonToolbar>
            </div>

        );
    }
}

class IngredientList extends Component {
    render() {
        var ingredients = this.props.ingredients.map(
            function(ingredient){
            return (
                <ListGroupItem>
                    {ingredient}
                </ListGroupItem>
            );
        });
        return (
            <ListGroup>
                {ingredients}
            </ListGroup>
        );
        }
}

//state组件，有constructor
class AddRecipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }
    handleShow() {
        this.setState({show: true});
        if (edit_recipe) {
            if (document.getElementById("title") && document.getElementById("ingredients")) {
                document.getElementById("title").value = edit_recipe.title;
                document.getElementById("ingredients").value = edit_recipe.ingredients;
                document.getElementById("modalTitle").innerText = "Edit Recipe";
                document.getElementById("modalAdd").innerText = "Confirm";
            }
            else requestAnimationFrame(this.handleShow.bind(this));
        }
    }
    handleClose() {
        edit_recipe = undefined;
        this.setState({show: false});
    }
    addRecipe() {
        var title = document.getElementById("title").value;
        var ingredients = document.getElementById("ingredients").value.split(","); //parse ingredients
        var exists = false;
        for (var i=0; i<recipes.length; i++) {
            if (title === recipes[i].title) {
                exists = true;
                break;
            }
        }
        if (!exists || edit_recipe) {
            if (title.length < 1) {
                title = "Untitled";
            }
            if (edit_recipe) {
                recipes[edit_recipe.index] = {title: title, ingredients: ingredients};
                // edit_recipe = {};
            }
            else {recipes.push({title: title, ingredients: ingredients});}

        }
        update();
        edit_recipe = undefined;
        this.handleClose();
    }
    render() {
        return (
            <div>
                <Button bsStyle={"primary"} onClick={this.handleShow.bind(this)} id={"addRecipe"}>
                    Add Recipe
                </Button>
                <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title id={"modalTitle"}>Add Recipe</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            Title<br/>
                            <input type="text" label="Recipe" placeholder="Recipe Name" size={"40"} id="title" /><br/>
                            Ingredients<br/>
                            <input type="textarea" label="Ingredients"
                                   placeholder="Enter Ingredients,Separated,By Commas" size={"40"} id="ingredients"/>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle={"primary"} onClick={this.addRecipe.bind(this)} id={"modalAdd"}>Add</Button>
                        <Button bsStyle={"danger"} onClick={this.handleClose.bind(this)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
}

function update () {
    ReactDOM.render(<App />, document.getElementById('root'));
}

export default App;