import Storage from './Storage';

class CalorieTracker {
	constructor() {
		this._calorieLimit = Storage.getCalorieLimit();
		this._totalCalories = Storage.getTotalCalories(0);
		this._meals = Storage.getMeals();
		this._workouts = Storage.getWorkouts();

		this._displayCalorieLimit();
		this._displayCalorieTotal();
		this._displayCaloriesConsumed();
		this._displayCaloriesBurned();
		this._displayCaloriesRemaining();
		this._displayCaloriesProgress();

		document.getElementById('limit').value = this._calorieLimit;
	}

	// Private API

	_displayCalorieTotal() {
		const totalCaloriesEL = document.getElementById('calories-total');
		totalCaloriesEL.innerHTML = this._totalCalories;
	}

	_displayCalorieLimit() {
		const totalCalorieLimitEL = document.getElementById('calories-limit');
		totalCalorieLimitEL.innerHTML = this._calorieLimit;
	}

	_displayCaloriesConsumed() {
		const caloriesConsumedEL = document.getElementById('calories-consumed');
		const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);
		caloriesConsumedEL.innerHTML = consumed;
	}

	_displayCaloriesBurned() {
		const caloriesBurnedEL = document.getElementById('calories-burned');
		const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);
		caloriesBurnedEL.innerHTML = burned;
	}
	_displayCaloriesRemaining() {
		const caloriesReaminingEL = document.getElementById('calories-remaining');
		const progressEL = document.getElementById('calorie-progress');
		const remaining = this._calorieLimit - this._totalCalories;
		caloriesReaminingEL.innerHTML = remaining;

		if (remaining <= 0) {
			caloriesReaminingEL.parentElement.parentElement.classList.remove('bg-light');
			caloriesReaminingEL.parentElement.parentElement.classList.add('bg-danger');
			progressEL.classList.remove('bg-success');
			progressEL.classList.add('bg-danger');
		} else {
			caloriesReaminingEL.parentElement.parentElement.classList.remove('bg-danger');
			caloriesReaminingEL.parentElement.parentElement.classList.add('bg-light');
			progressEL.classList.remove('bg-danger');
			progressEL.classList.add('bg-success');
		}
	}

	_displayCaloriesProgress() {
		const progressEL = document.getElementById('calorie-progress');
		const percentage = (this._totalCalories / this._calorieLimit) * 100;
		const width = Math.min(percentage, 100);
		progressEL.style.width = `${width}%`;
	}

	_displayNewItem(type, item) {
		const parent = document.getElementById(`${type}-items`);
		const child = document.createElement('div');
		child.classList.add('card', 'my-2');
		child.setAttribute('data-id', item.id);

		if (type === 'meal') {
			child.innerHTML = `
    <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${item.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${item.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
    `;
		} else {
			child.innerHTML = `
      <div class="card-body">
								<div class="d-flex align-items-center justify-content-between">
									<h4 class="mx-1">${item.name}</h4>
									<div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">${item.calories}</div>
									<button class="delete btn btn-danger btn-sm mx-2">
										<i class="fa-solid fa-xmark"></i>
									</button>
								</div>
							</div>`;
		}
		parent.appendChild(child);
	}

	_render() {
		this._displayCalorieTotal();
		this._displayCaloriesConsumed();
		this._displayCaloriesBurned();
		this._displayCaloriesRemaining();
		this._displayCaloriesProgress();
	}

	// Public API
	addMeal(meal) {
		this._meals.push(meal);
		this._totalCalories += meal.calories;
		Storage.updateTotalCalories(this._totalCalories);
		Storage.saveMeal(meal);
		this._displayNewItem('meal', meal);
		this._render();
	}

	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.calories;
		Storage.updateTotalCalories(this._totalCalories);
		Storage.saveWorkout(workout);
		this._displayNewItem('workout', workout);
		this._render();
	}

	removeMeal(id) {
		const index = this._meals.findIndex((meal) => meal.id === id);
		if (index !== -1) {
			const meal = this._meals[index];
			this._totalCalories -= meal.calories;
			Storage.updateTotalCalories(this._totalCalories);
			this._meals.splice(index, 1);
			Storage.removeMeal(id);
			this._render();
		}
	}

	removeWorkout(id) {
		const index = this._workouts.findIndex((workout) => workout.id === id);
		if (index !== -1) {
			const workout = this._workouts[index];
			this._totalCalories += workout.calories;
			Storage.updateTotalCalories(this._totalCalories);
			this._workouts.splice(index, 1);
			Storage.removeWorkout(id);
			this._render();
		}
	}
	reset() {
		this._totalCalories = 0;
		this._meals = [];
		this._workouts = [];
		Storage.clearStorage();
		this._render();
	}
	setLimit(calorieLimit) {
		this._calorieLimit = calorieLimit;
		Storage.setCalorieLimit(calorieLimit);
		this._displayCalorieLimit();
		this._render();
	}

	loadItems() {
		this._meals.forEach((meal) => this._displayNewItem('meal', meal));
		this._workouts.forEach((workout) => this._displayNewItem('workout', workout));
	}
}

export default CalorieTracker;
