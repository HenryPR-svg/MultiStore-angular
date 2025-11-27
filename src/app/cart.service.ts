// src/app/cart.service.ts
import { Injectable } from '@angular/core';
import { CartItem, Product } from './models';

const STORAGE_KEY = 'fakeStoreCart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.items = JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading cart from storage', e);
      this.items = [];
    }
  }

  getItems(): CartItem[] {
    return this.items;
  }

  // 🔹 AHORA acepta cantidad (2º argumento)
  addToCart(product: Product, quantity: number = 1): void {
    if (quantity <= 0) {
      return;
    }

    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    this.saveToStorage();
  }

  clearCart(): void {
    this.items = [];
    this.saveToStorage();
  }

  getTotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }
}

