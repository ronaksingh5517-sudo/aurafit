"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const DEFAULT_USER = {
  name: "Rahul Sharma",
  email: "rahul.fit@aura.ai",
  age: 23,
  gender: "male",
  height: 176,
  weight: 71.2,
  targetWeight: 68.0,
  goal: "Build Muscle & Lean Down",
  workoutTime: "20",
  dailyCalories: 2180,
  membership: "30-Day Pro Trial",
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [streak, setStreak] = useState(1);
  const [waterGlasses, setWaterGlasses] = useState(4);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [toast, setToast] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("aurafit_user");
      const savedStreak = localStorage.getItem("aurafit_streak");
      const savedWater = localStorage.getItem("aurafit_water");
      const savedWorkouts = localStorage.getItem("aurafit_workouts");
      const savedMeals = localStorage.getItem("aurafit_meals");

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedStreak) setStreak(Number(savedStreak));
      if (savedWater) setWaterGlasses(Number(savedWater));
      if (savedWorkouts) setCompletedWorkouts(JSON.parse(savedWorkouts));
      if (savedMeals) setLoggedMeals(JSON.parse(savedMeals));
    } catch (e) {
      console.warn("Storage sync error:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const updateUser = (newFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...newFields };
      localStorage.setItem("aurafit_user", JSON.stringify(updated));
      return updated;
    });
    triggerToast("Profile metrics updated!");
  };

  const addWaterGlass = () => {
    setWaterGlasses((prev) => {
      const nextVal = Math.min(prev + 1, 12);
      localStorage.setItem("aurafit_water", String(nextVal));
      if (nextVal === 8) {
        triggerToast("🎉 Target Reached! 2,000ml Hydration Goal Hit!");
      } else {
        triggerToast(`+250ml logged (${nextVal}/8 glasses)`);
      }
      return nextVal;
    });
  };

  const recordWorkoutDone = (workoutName) => {
    const entry = {
      id: Date.now(),
      name: workoutName,
      date: new Date().toLocaleDateString(),
      caloriesBurned: 180,
    };
    setCompletedWorkouts((prev) => {
      const updated = [entry, ...prev];
      localStorage.setItem("aurafit_workouts", JSON.stringify(updated));
      return updated;
    });
    setStreak((prev) => {
      const nextStreak = prev + 1;
      localStorage.setItem("aurafit_streak", String(nextStreak));
      return nextStreak;
    });
    triggerToast("🔥 Workout Saved! Streak upgraded!");
  };

  const recordMealDone = (meal) => {
    setLoggedMeals((prev) => {
      const updated = [meal, ...prev];
      localStorage.setItem("aurafit_meals", JSON.stringify(updated));
      return updated;
    });
    triggerToast(`📸 ${meal.dishName || "Meal"} logged successfully!`);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        streak,
        waterGlasses,
        addWaterGlass,
        completedWorkouts,
        recordWorkoutDone,
        loggedMeals,
        recordMealDone,
        toast,
        triggerToast,
        isLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}