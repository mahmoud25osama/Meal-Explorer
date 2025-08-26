const mealCat = document.getElementById('meal-category');
const mealList = document.getElementById('meal-list');
const closeBtn = document.getElementById('close-btn');
const overlay = document.getElementById('overlay');
const overlayItem = document.getElementById('item-content');


function getMealCat(optionValue='Beef') {
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.themealdb.com/api/json/v1/1/filter.php?c=${optionValue}`);
    xhr.responseType = 'json';
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                var response = xhr.response;
                renderMeal(response);
                console.log("res",response);
                
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    xhr.send();
}

mealCat.addEventListener('change', function (e) {
    getMealCat(e.target.value);
    
})

function renderMeal(res) {
    
    mealList.innerHTML = '';
    if (!res.meals) {
        mealList.innerHTML = `<p>No Meals to Show.</p>`;
        return;
    }
    res.meals.forEach(meal => {
        mealList.innerHTML += `
        <div class="meal-item" id=${meal.idMeal}>
        <img src=${meal.strMealThumb} alt=${meal.strMeal}>
        <div class="meal-name">${meal.strMeal.split(" ").slice(0, 3).join(" ")}</div>
        </div>
        `;
        
    });
    
    const mealItem = document.querySelectorAll('.meal-item')
    mealItem.forEach(function(elm){
        elm.addEventListener('click', function () {            
            getMealDetails(elm.id);
        });
        
    })
    
}



function getMealDetails(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    xhr.responseType = 'json';
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const meal = xhr.response.meals[0];
                showMealOverlay(meal); 
                overlay.classList.add('toggle'); 
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    xhr.send();
}

function showMealOverlay(meal) {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
        }
    }
    
    overlayItem.innerHTML = `
    <div class="head">
    <div class="meal-title">${meal.strMeal}</div>
    </div>
    <div class="info">
    <div class="category">Category: ${meal.strCategory}</div>
    <div class="area">● Cuisine: ${meal.strArea}</div>
    </div>
    <div class="img">
    <img src=${meal.strMealThumb} alt=${meal.strMeal}>
    </div>
    <div class="ingredients">
    <h3>Ingredients: </h3>
    <ul>
    ${ingredients}
    </ul>
    </div>
    <div class="instructions">
    <h3>Instructions: </h3>
    <p>${meal.strInstructions}</p>
    </div>
    ${meal.strYoutube 
        ? `<a href="${meal.strYoutube}" target="_blank" class="youtubeLink">Watch Video</a>` 
        : ''
    }
    `;
}

closeBtn.addEventListener('click', function () {
    overlay.classList.remove('toggle');
});

getMealCat(mealCat.value);