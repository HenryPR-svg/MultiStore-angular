// src/app/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from './models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'https://fakestoreapi.com/products';
  private categoriesUrl = 'https://fakestoreapi.com/products/categories';

  constructor(private http: HttpClient) {}

  // 🔹 Obtiene TODAS las categorías desde la API
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.categoriesUrl);
  }

  // 🔹 Obtiene productos por categoría DESDE LA API
  getProductsByCategory(category: string): Observable<Product[]> {
    if (!category || category === 'Todos') {
      // Todos los productos (sin filtrar) desde la API
      return this.http.get<Product[]>(this.apiUrl);
    } else {
      // Productos de una categoría
      const url = `${this.apiUrl}/category/${encodeURIComponent(category)}`;
      return this.http.get<Product[]>(url);
    }
  }
}



