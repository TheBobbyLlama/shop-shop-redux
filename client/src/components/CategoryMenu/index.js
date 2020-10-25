import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { idbPromise } from '../../utils/helpers';
import { updateCategories, updateCurrentCategory } from '../../utils/actions';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from "../../utils/queries";

const mapStateToProps = state => {
	return {
	  categories: state.categories
	}
}

function CategoryMenu({ categories, dispatch }) {
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch(updateCategories(categoryData.categories));
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch(updateCategories(categories));
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = id => {
    dispatch(updateCurrentCategory(id));
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default connect(mapStateToProps)(CategoryMenu); // Container/component in one.
