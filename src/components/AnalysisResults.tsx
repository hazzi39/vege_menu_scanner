import React from 'react';
import { Leaf, CircleSlash, AlertCircle } from 'lucide-react';
import type { DishAnalysis } from '../types';

interface AnalysisResultsProps {
  results: DishAnalysis[];
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  // Sort and group results
  const veganDishes = results
    .filter(dish => dish.is_vegan)
    .sort((a, b) => b.confidence - a.confidence);

  const vegetarianDishes = results
    .filter(dish => dish.is_vegetarian && !dish.is_vegan)
    .sort((a, b) => b.confidence - a.confidence);

  const nonVegetarianDishes = results
    .filter(dish => !dish.is_vegetarian && !dish.is_vegan)
    .sort((a, b) => b.confidence - a.confidence);

  const DishCard = ({ dish }: { dish: DishAnalysis }) => (
    <div 
      className={`
        p-6 rounded-lg shadow-sm border
        ${dish.is_vegan ? 'bg-green-50 border-green-200' :
          dish.is_vegetarian ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{dish.name}</h3>
          <div className="mt-1 flex items-center space-x-2">
            {dish.is_vegan ? (
              <Leaf className="w-5 h-5 text-green-600" />
            ) : dish.is_vegetarian ? (
              <Leaf className="w-5 h-5 text-yellow-600" />
            ) : (
              <CircleSlash className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-medium">
              {dish.is_vegan ? 'Vegan' : 
               dish.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <AlertCircle className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {dish.confidence}% confident
          </span>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Reasoning:</span> {dish.reasoning}
        </p>
        <div>
          <span className="text-sm font-medium text-gray-600">Likely ingredients:</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {dish.ingredients.map((ingredient, i) => (
              <span 
                key={i}
                className="px-2 py-1 text-xs rounded-full bg-white border border-gray-200"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const CategorySection = ({ 
    title, 
    dishes, 
    className 
  }: { 
    title: string; 
    dishes: DishAnalysis[]; 
    className: string;
  }) => dishes.length > 0 ? (
    <div className="space-y-4">
      <h2 className={`text-2xl font-bold ${className}`}>{title}</h2>
      <div className="space-y-4">
        {dishes.map((dish, index) => (
          <DishCard key={index} dish={dish} />
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="w-full max-w-2xl space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Analysis Results</h2>
      
      <CategorySection 
        title="Vegan Dishes" 
        dishes={veganDishes} 
        className="text-green-700"
      />
      
      <CategorySection 
        title="Vegetarian Dishes" 
        dishes={vegetarianDishes} 
        className="text-yellow-700"
      />
      
      <CategorySection 
        title="Non-Vegetarian Dishes" 
        dishes={nonVegetarianDishes} 
        className="text-red-700"
      />
      
      {results.length === 0 && (
        <p className="text-center text-gray-500">No dishes found to analyze.</p>
      )}
    </div>
  );
}