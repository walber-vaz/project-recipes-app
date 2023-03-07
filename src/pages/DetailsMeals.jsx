import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import Recomendations from '../components/Recomendations';
import ButtonStartRecipe from '../components/ButtonStartRecipe';
import './Details.css';

import image from '../images/shareIcon.svg';

const copy = require('clipboard-copy');

export default function DetailsMeals({ match: { params: { id } } }) {
  const [detailsMeals, setDetailsMeals] = useState('');
  const [checkTheLinkCopied, setCheckTheLinkCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const ingredients = [];
  const medidas = [];

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((respose) => respose.json())
      .then((data) => setDetailsMeals(data.meals));
  }, [id]);

  const obj = detailsMeals[0];
  if (obj !== undefined) {
    Object.keys(obj).forEach((key) => {
      if (key.startsWith('strIngredient')) {
        ingredients.push(obj[key]);
      }
    });
    Object.keys(obj).forEach((key) => {
      if (key.startsWith('strMeasure')) {
        medidas.push(obj[key]);
      }
    });
  }

  const handleClickShare = () => {
    const url = window.location.href;
    copy(url);
    setCheckTheLinkCopied(true);
  const addFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favorites) {
      const isFavorite = favorites.some((item) => item.id === detailsMeals[0].idMeal);
      if (isFavorite) {
        const newFavorites = favorites
          .filter((item) => item.id !== detailsMeals[0].idMeal);
        localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
        setFavorite(false);
      } else {
        const newFavorite = {
          id: detailsMeals[0].idMeal,
          type: 'meal',
          alcoholicOrNot: detailsMeals[0].strAlcoholic,
          name: detailsMeals[0].strMeal,
          image: detailsMeals[0].strMealThumb,
        };
        localStorage
          .setItem('favoriteRecipes', JSON.stringify([...favorites, newFavorite]));
        setFavorite(true);
      }
    } else {
      const newFavorite = {
        id: detailsMeals[0].idMeal,
        type: 'meal',
        nationality: detailsMeals[0].strArea,
        category: detailsMeals[0].strCategory,
        alcoholicOrNot: '',
        name: detailsMeals[0].strMeal,
        image: detailsMeals[0].strMealThumb,
      };
      localStorage.setItem('favoriteRecipes', JSON.stringify([newFavorite]));
      setFavorite(true);
    }
  };

  return (
    <section className="fullSection">
      <h1>Details Meals</h1>
      {
        detailsMeals.length > 0
          ? (
            <div className="itemDetail">
              <img
                src={ detailsMeals[0].strMealThumb }
                alt={ detailsMeals[0].strMeal }
                data-testid="recipe-photo"
              />
              <h1 data-testid="recipe-title">{ detailsMeals[0].strMeal }</h1>
              <p data-testid="recipe-category">{ detailsMeals[0].strCategory }</p>
              <p data-testid="instructions">{ detailsMeals[0].strInstructions }</p>
              <div
                className="react-player"
              >
                <ReactPlayer
                  url={ detailsMeals[0].strYoutube }
                  data-testid="video"
                />
              </div>
              <div>
                <ul>
                  {
                    ingredients.map((ingrediente, index) => {
                      let iten = null;
                      if (ingrediente) {
                        iten = (
                          <li
                            key={ ingrediente }
                            data-testid={ `${index}-ingredient-name-and-measure` }
                          >
                            { ingrediente }
                            {' '}
                            { medidas[index] }
                          </li>);
                      }
                      return iten;
                    })
                  }
                </ul>
              </div>
              <div>
                <button
                  type="button"
                  data-testid="share-btn"
                  onClick={ () => handleClickShare() }
                >
                  <img
                    src={ image }
                    alt="img"
                    style={ { height: '20px', width: '20px' } }
                  />
                </button>
                <button
                  type="button"
                  data-testid="favorite-btn"
                  onClick={ addFavorite }
                >
                  {favorite ? 'Desfavoritar' : 'Favoritar'}
                </button>
                {
                  !checkTheLinkCopied
                    ? ''
                    : <p>Link copied!</p>
                }
              </div>
            </div>
          )
          : null
      }
      <Recomendations />
      <ButtonStartRecipe url="meals" id={ id } />
    </section>
  );
}

DetailsMeals.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
