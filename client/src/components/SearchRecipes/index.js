import React, { Component } from "react";

import { DropDownMenu, MenuItem } from "material-ui";
import ReactSuperSelect from "react-super-select";

import * as userActions from "../../actions/user_actions";
import * as searchActions from "../../actions/search_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withRouter } from "react-router-dom";
import { Paper } from "material-ui";
import { Card, CardHeader, CardTitle, CardText, CardMedia } from "material-ui";
import CircularProgress from "material-ui/CircularProgress";

import InputToken from "./InputTokenForm";

import "./InputTokenForm.css";

import "./SearchRecipes.css";
import StarRatingComponent from "react-star-rating-component";

class SearchRecipes extends Component {
  state = {
    recipes: [],
    healthTokens: [],
    healthOptions: [
      { id: 1, name: "vegan", element: <span>vegan</span> },
      { id: 2, name: "vegetarian", element: <span>vegetarian</span> },
      { id: 3, name: "sugar-conscious", element: <span>sugar-conscious</span> },
      { id: 4, name: "peanut-free", element: <span>peanut-free</span> },
      { id: 5, name: "tree-nut-free", element: <span>tree-nut-free</span> },
      { id: 6, name: "alcohol-free", element: <span>alcohol-free</span> }
    ],
    healthFilters: [],
    dietTokens: [],
    dietOptions: [
      { id: 1, name: "balanced", element: <span>balanced</span> },
      { id: 2, name: "high-protein", element: <span>high-protein</span> },
      { id: 3, name: "low-fat", element: <span>low-fat</span> },
      { id: 4, name: "low-carb", element: <span>low-carb</span> }
    ],
    dietFilters: []
  };

  componentWillReceiveProps(nextProps) {
    console.log("nextProps: ", nextProps);
    this.setState({
      recipes: !Array.isArray(nextProps.searchReducer.results)
        ? []
        : nextProps.searchReducer.results
    });
    if (nextProps.searchReducer.query !== this.props.searchReducer.query) {
      this.props.searchActions.requestSearch(
        nextProps.searchReducer.query,
        nextProps.searchReducer.preferences
      );
    }
  }

  componentWillMount() {
    this.props.searchActions.requestSearch(
      this.props.searchReducer.query,
      this.props.searchReducer.preferences
    );
  }

  // handleChange = (event, index, value) => this.setState({ value });

  selectToken = e => {
    const filterType = e.target.name;
    const filterTokenArray = e.target.value;
    this.setState({
      [`${filterType}Tokens`]: filterTokenArray,
      [`${filterType}Filters`]: filterTokenArray.map(
        token => this.state[`${filterType}Options`][token - 1].name
      )
    });
  };

  filterRecipes = () => {
    return this.state.recipes.filter(recipe => {
      return this.isValidRecipe(recipe);
    });
  };

  isValidRecipe = recipe => {
    const filters = [...this.state.dietFilters, ...this.state.healthFilters];
    console.log("filters: ", filters);
    return filters.reduce(
      (isValid, filter) =>
        recipe.preferences &&
        !!recipe.preferences.find(
          preference => preference.toLowerCase() === filter.toLowerCase()
        ) &&
        isValid,
      true
    );
  };

  renderHealthInputToken = () =>
    <InputToken
      name="health"
      value={this.state.healthTokens}
      placeholder="pick health option"
      options={this.state.healthOptions}
      onSelect={this.selectToken}
    />;

  renderDietInputToken = () =>
    <InputToken
      name="diet"
      value={this.state.dietTokens}
      placeholder="pick diet option"
      options={this.state.dietOptions}
      onSelect={this.selectToken}
    />;

  render() {
    const recipes = this.filterRecipes(this.state.recipes).map(recipe =>
      <Card className="recipe-card" key={recipe.name}>
        <CardMedia>
          {recipe.image && <img src={recipe.image.url} />}
        </CardMedia>
        <CardTitle className="card-title">
          {recipe.name}
        </CardTitle>
        <StarRatingComponent
          className="star-rating"
          name="rating"
          value={Math.floor(Math.random() * 5)}
          editing={false}
        />
      </Card>
    );
    return (
      <div className="background">
        <div className="search-container">
          <div className="search-recipes">
            <p className="search-recipes-title">find delicious recipes</p>
            <div className="filters-container">
              <div className="filter filter-health">
                {this.renderHealthInputToken()}
              </div>
              <div className="filter filter-diet">
                {this.renderDietInputToken()}
              </div>
            </div>
            <div className="recipe-results">
              {this.props.searchReducer.isSearching
                ? <CircularProgress />
                : recipes}
            </div>
          </div>
          <Paper className="newsfeed">placeholder</Paper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch),
  searchActions: bindActionCreators(searchActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchRecipes)
);
